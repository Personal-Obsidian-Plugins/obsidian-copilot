import { CHUNK_SIZE } from "@/constants";
import EmbeddingsManager from "@/LLMProviders/embeddingManager";
import { logError, logInfo } from "@/logger";
import { RateLimiter } from "@/rateLimiter";
import { getSettings, subscribeToSettingsChange } from "@/settings/model";
import { formatDateTime } from "@/utils";
import { MD5 } from "crypto-js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { App, Notice, TFile } from "obsidian";
import type { EmbedCache, LinkCache } from "obsidian";
import { DBOperations } from "./dbOperations";
import {
  buildGraphConnectionConfigFromSettings,
  buildGraphOptionsFromSettings,
  GraphIndexedNote,
  GraphStoreRuntimeOptions,
  Neo4jGraphStore,
} from "@/search/neo4jGraphStore";
import { normalizeTagPaths } from "@/search/tagNormalization";
import {
  extractAppIgnoreSettings,
  getDecodedPatterns,
  getMatchingPatterns,
  shouldIndexFile,
} from "./searchUtils";

export interface IndexingState {
  isIndexingPaused: boolean;
  isIndexingCancelled: boolean;
  indexedCount: number;
  totalFilesToIndex: number;
  processedFiles: Set<string>;
  currentIndexingNotice: Notice | null;
  indexNoticeMessage: HTMLSpanElement | null;
}

interface PreparedChunk {
  content: string;
  fileInfo: any;
}

interface PreparedNoteIngestion {
  graphNote: GraphIndexedNote;
  chunks: PreparedChunk[];
}

export class IndexOperations {
  private rateLimiter: RateLimiter;
  private checkpointInterval: number;
  private embeddingBatchSize: number;
  private readonly graphStore = new Neo4jGraphStore();
  private state: IndexingState = {
    isIndexingPaused: false,
    isIndexingCancelled: false,
    indexedCount: 0,
    totalFilesToIndex: 0,
    processedFiles: new Set(),
    currentIndexingNotice: null,
    indexNoticeMessage: null,
  };

  constructor(
    private app: App,
    private dbOps: DBOperations,
    private embeddingsManager: EmbeddingsManager
  ) {
    const settings = getSettings();
    this.rateLimiter = new RateLimiter(settings.embeddingRequestsPerMin);
    this.embeddingBatchSize = settings.embeddingBatchSize;
    this.checkpointInterval = 8 * this.embeddingBatchSize;

    // Subscribe to settings changes
    subscribeToSettingsChange(async () => {
      const settings = getSettings();
      this.rateLimiter = new RateLimiter(settings.embeddingRequestsPerMin);
      this.embeddingBatchSize = settings.embeddingBatchSize;
      this.checkpointInterval = 8 * this.embeddingBatchSize;
    });
  }

  public async indexVaultToVectorStore(overwrite?: boolean): Promise<number> {
    const errors: string[] = [];

    try {
      const embeddingInstance = await this.embeddingsManager.getEmbeddingsAPI();
      if (!embeddingInstance) {
        console.error("Embedding instance not found.");
        return 0;
      }

      // Check for model change first
      const modelChanged = await this.dbOps.checkAndHandleEmbeddingModelChange(embeddingInstance);
      if (modelChanged) {
        // If model changed, force a full reindex by setting overwrite to true
        overwrite = true;
      }

      // Clear index and tracking if overwrite is true
      if (overwrite) {
        await this.dbOps.clearIndex(embeddingInstance);
        this.dbOps.clearFilesMissingEmbeddings();
      } else {
        // Run garbage collection first to clean up stale documents
        await this.dbOps.garbageCollect();
      }

      const files = await this.getFilesToIndex(overwrite);
      if (files.length === 0) {
        new Notice("Copilot vault index is up-to-date.");
        return 0;
      }

      this.initializeIndexingState(files.length);
      this.createIndexingNotice();

      // Clear the missing embeddings list before starting new indexing
      this.dbOps.clearFilesMissingEmbeddings();

      const preparedNotes = await this.prepareIngestionPayloads(files);
      const chunkEntries = preparedNotes.flatMap((note) =>
        note.chunks.map((chunk) => ({
          note,
          chunk,
        }))
      );

      if (chunkEntries.length === 0) {
        new Notice("No valid content to index.");
        return 0;
      }

      // Process chunks in batches
      for (let i = 0; i < chunkEntries.length; i += this.embeddingBatchSize) {
        if (this.state.isIndexingCancelled) break;
        await this.handlePause();

        const batch = chunkEntries.slice(i, i + this.embeddingBatchSize);
        try {
          await this.rateLimiter.wait();
          const embeddings = await embeddingInstance.embedDocuments(
            batch.map((entry) => entry.chunk.content)
          );

          // Validate embeddings
          if (!embeddings || embeddings.length !== batch.length) {
            throw new Error(
              `Embedding model returned ${embeddings?.length ?? 0} embeddings for ${batch.length} documents`
            );
          }

          // Save batch to database
          for (let j = 0; j < batch.length; j++) {
            const { chunk } = batch[j];
            const embedding = embeddings[j];

            // Skip documents with invalid embeddings
            if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
              logError(`Invalid embedding for document ${chunk.fileInfo.path}: ${embedding}`);
              this.dbOps.markFileMissingEmbeddings(chunk.fileInfo.path);
              continue;
            }

            try {
              await this.dbOps.upsert({
                ...chunk.fileInfo,
                id: this.getDocHash(chunk.content),
                content: chunk.content,
                embedding,
                created_at: Date.now(),
                nchars: chunk.content.length,
              });
              // Mark success for this file
              this.state.processedFiles.add(chunk.fileInfo.path);
            } catch (err) {
              // Log error but continue processing other documents in batch
              this.handleError(err, {
                filePath: chunk.fileInfo.path,
                errors,
              });
              this.dbOps.markFileMissingEmbeddings(chunk.fileInfo.path);
              continue;
            }
          }

          // Update progress after the batch
          this.state.indexedCount = this.state.processedFiles.size;
          this.updateIndexingNoticeMessage();

          // Calculate if we've crossed a checkpoint threshold
          const previousCheckpoint = Math.floor(
            (this.state.indexedCount - batch.length) / this.checkpointInterval
          );
          const currentCheckpoint = Math.floor(this.state.indexedCount / this.checkpointInterval);

          if (currentCheckpoint > previousCheckpoint) {
            await this.dbOps.saveDB();
            console.log("Copilot index checkpoint save completed.");
          }
        } catch (err) {
          this.handleError(err, {
            filePath: batch?.[0]?.chunk?.fileInfo?.path,
            errors,
            batch,
          });
          if (this.isRateLimitError(err)) {
            break;
          }
        }
      }

      await this.ingestGraphNotes(preparedNotes);

      // Show completion notice before running integrity check
      this.finalizeIndexing(errors);

      // Run save and integrity check with setTimeout to ensure it's non-blocking
      setTimeout(() => {
        this.dbOps
          .saveDB()
          .then(() => {
            logInfo("Copilot index final save completed.");
            this.dbOps.checkIndexIntegrity().catch((err) => {
              logError("Background integrity check failed:", err);
            });
          })
          .catch((err) => {
            logError("Background save failed:", err);
          });
      }, 100); // 100ms delay

      return this.state.indexedCount;
    } catch (error) {
      this.handleError(error);
      return 0;
    }
  }

  /**
   * Prepare dense chunk payloads and graph metadata for the provided files.
   *
   * @param files - Markdown files slated for indexing.
   * @returns Array of note-level ingestion payloads combining dense and graph views.
   */
  private async prepareIngestionPayloads(files: TFile[]): Promise<PreparedNoteIngestion[]> {
    const embeddingInstance = await this.embeddingsManager.getEmbeddingsAPI();
    if (!embeddingInstance) {
      console.error("Embedding instance not found.");
      return [];
    }

    const embeddingModel = EmbeddingsManager.getModelName(embeddingInstance);
    const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: CHUNK_SIZE,
    });
    const payloads: PreparedNoteIngestion[] = [];

    for (const file of files) {
      const content = await this.app.vault.cachedRead(file);
      if (!content?.trim()) {
        continue;
      }

      const fileCache = this.app.metadataCache.getFileCache(file) ?? null;
      const rawTags = fileCache?.tags?.map((tag) => tag.tag) ?? [];
      const fileInfo = {
        title: file.basename,
        path: file.path,
        embeddingModel,
        ctime: file.stat.ctime,
        mtime: file.stat.mtime,
        tags: rawTags,
        extension: file.extension,
        metadata: {
          ...(fileCache?.frontmatter ?? {}),
          created: formatDateTime(new Date(file.stat.ctime)).display,
          modified: formatDateTime(new Date(file.stat.mtime)).display,
        },
      };

      const chunks = await textSplitter.createDocuments([content], [], {
        chunkHeader: `\n\nNOTE TITLE: [[${fileInfo.title}]]\n\nMETADATA:${JSON.stringify(
          fileInfo.metadata
        )}\n\nNOTE BLOCK CONTENT:\n\n`,
        appendChunkOverlapHeader: true,
      });

      const preparedChunks: PreparedChunk[] = [];
      chunks.forEach((chunk) => {
        if (chunk.pageContent.trim()) {
          preparedChunks.push({
            content: chunk.pageContent,
            fileInfo,
          });
        }
      });

      if (preparedChunks.length === 0) {
        continue;
      }

      const graphNote: GraphIndexedNote = {
        noteId: file.path,
        notePath: file.path,
        tags: normalizeTagPaths(rawTags),
        wikiLinkTargets: this.resolveLinkTargets(fileCache?.links, file.path),
        embedTargets: this.resolveLinkTargets(fileCache?.embeds, file.path),
        updatedAt: file.stat.mtime,
      };

      payloads.push({
        graphNote,
        chunks: preparedChunks,
      });
    }

    return payloads;
  }

  /**
   * Resolve link or embed targets to canonical vault paths.
   *
   * @param items - Link-like metadata entries.
   * @param sourcePath - Path of the note containing the links.
   * @returns Unique list of resolved target paths.
   */
  private resolveLinkTargets<T extends LinkCache | EmbedCache>(
    items: T[] | undefined,
    sourcePath: string
  ): string[] {
    if (!items?.length) {
      return [];
    }

    const targets = new Set<string>();
    for (const item of items) {
      const resolved = this.app.metadataCache.getFirstLinkpathDest?.(item.link, sourcePath);
      if (resolved) {
        targets.add(resolved.path);
      }
    }

    return Array.from(targets);
  }

  /**
   * Persist processed notes into the Neo4j graph store when graph indexing is enabled.
   *
   * @param notes - Prepared note payloads produced during indexing.
   */
  private async ingestGraphNotes(notes: PreparedNoteIngestion[]): Promise<void> {
    if (notes.length === 0) {
      return;
    }

    const settings = getSettings();
    const graphOptions = buildGraphOptionsFromSettings(settings);
    if (!graphOptions.enabled) {
      return;
    }

    await this.graphStore.initialize(buildGraphConnectionConfigFromSettings(settings));

    const processedPaths = this.state.processedFiles;
    for (const note of notes) {
      if (!processedPaths.has(note.graphNote.notePath)) {
        continue;
      }

      await this.safeGraphUpsert(note.graphNote, graphOptions);
    }
  }

  /**
   * Upsert a single note into the graph store outside of batch indexing flows.
   *
   * @param note - Graph-ready note payload.
   */
  private async upsertGraphNote(note: GraphIndexedNote): Promise<void> {
    const settings = getSettings();
    const graphOptions = buildGraphOptionsFromSettings(settings);
    if (!graphOptions.enabled) {
      return;
    }

    await this.graphStore.initialize(buildGraphConnectionConfigFromSettings(settings));
    await this.safeGraphUpsert(note, graphOptions);
  }

  /**
   * Execute a graph upsert and surface errors through structured logging.
   *
   * @param note - Graph-ready note payload.
   * @param options - Runtime options gating graph ingestion.
   */
  private async safeGraphUpsert(
    note: GraphIndexedNote,
    options: GraphStoreRuntimeOptions
  ): Promise<void> {
    try {
      await this.graphStore.upsertNote(note, options);
    } catch (error) {
      logError("Graph ingestion failed for note", {
        error,
        noteId: note.noteId,
      });
    }
  }

  private getDocHash(sourceDocument: string): string {
    return MD5(sourceDocument).toString();
  }

  private async getFilesToIndex(overwrite?: boolean): Promise<TFile[]> {
    const { inclusions, exclusions } = getMatchingPatterns();
    const allMarkdownFiles = this.app.vault.getMarkdownFiles();

    // If overwrite is true, return all markdown files that match current filters
    if (overwrite) {
      return allMarkdownFiles.filter((file) => {
        return shouldIndexFile(file, inclusions, exclusions);
      });
    }

    // Get currently indexed files and latest mtime
    const indexedFilePaths = new Set(await this.dbOps.getIndexedFiles());
    const latestMtime = await this.dbOps.getLatestFileMtime();
    const filesMissingEmbeddings = new Set(this.dbOps.getFilesMissingEmbeddings());

    // Get all markdown files that should be indexed under current rules
    const filesToIndex = new Set<TFile>();
    const emptyFiles = new Set<string>();

    for (const file of allMarkdownFiles) {
      if (!shouldIndexFile(file, inclusions, exclusions)) {
        continue;
      }

      // Check actual content
      const content = await this.app.vault.cachedRead(file);
      if (!content || content.trim().length === 0) {
        emptyFiles.add(file.path);
        continue;
      }

      const isIndexed = indexedFilePaths.has(file.path);
      const needsEmbeddings = filesMissingEmbeddings.has(file.path);

      if (!isIndexed || needsEmbeddings || file.stat.mtime > latestMtime) {
        filesToIndex.add(file);
      }
    }

    logInfo(
      [
        `Files to index: ${filesToIndex.size}`,
        `Previously indexed: ${indexedFilePaths.size}`,
        `Empty files skipped: ${emptyFiles.size}`,
        `Files missing embeddings: ${filesMissingEmbeddings.size}`,
      ].join("\n")
    );

    return Array.from(filesToIndex);
  }

  private initializeIndexingState(totalFiles: number) {
    this.state = {
      isIndexingPaused: false,
      isIndexingCancelled: false,
      indexedCount: 0,
      totalFilesToIndex: totalFiles,
      processedFiles: new Set(),
      currentIndexingNotice: null,
      indexNoticeMessage: null,
    };
  }

  private createIndexingNotice(): Notice {
    const frag = document.createDocumentFragment();
    const container = frag.createEl("div", { cls: "copilot-notice-container" });

    this.state.indexNoticeMessage = container.createEl("div", { cls: "copilot-notice-message" });
    this.updateIndexingNoticeMessage();

    // Create button container for better layout
    const buttonContainer = container.createEl("div", { cls: "copilot-notice-buttons" });

    // Pause/Resume button
    const pauseButton = buttonContainer.createEl("button");
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.state.isIndexingPaused) {
        this.resumeIndexing();
        pauseButton.textContent = "Pause";
      } else {
        this.pauseIndexing();
        pauseButton.textContent = "Resume";
      }
    });

    // Stop button
    const stopButton = buttonContainer.createEl("button");
    stopButton.textContent = "Stop";
    stopButton.style.marginLeft = "8px";
    stopButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.cancelIndexing();
    });

    frag.appendChild(this.state.indexNoticeMessage);
    frag.appendChild(buttonContainer);

    this.state.currentIndexingNotice = new Notice(frag, 0);
    return this.state.currentIndexingNotice;
  }

  private async handlePause(): Promise<void> {
    if (this.state.isIndexingPaused) {
      while (this.state.isIndexingPaused && !this.state.isIndexingCancelled) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // After we exit the pause loop (meaning we've resumed), re-evaluate files
      if (!this.state.isIndexingCancelled) {
        const files = await this.getFilesToIndex();
        if (files.length === 0) {
          // If no files to index after filter change, cancel the indexing
          console.log("No files to index after filter change, stopping indexing");
          this.cancelIndexing();
          new Notice("No files to index with current filters");
          return;
        }
        this.state.totalFilesToIndex = files.length;
        console.log("Total files to index:", this.state.totalFilesToIndex);
        console.log("Files to index:", files);
        this.updateIndexingNoticeMessage();
      }
    }
  }

  private pauseIndexing(): void {
    this.state.isIndexingPaused = true;
  }

  private resumeIndexing(): void {
    this.state.isIndexingPaused = false;
  }

  private updateIndexingNoticeMessage(): void {
    if (this.state.indexNoticeMessage) {
      const status = this.state.isIndexingPaused ? " (Paused)" : "";
      const messages = [
        `Copilot is indexing your vault...`,
        `${this.state.indexedCount}/${this.state.totalFilesToIndex} files processed${status}`,
      ];

      const settings = getSettings();

      const inclusions = getDecodedPatterns(settings.qaInclusions);
      if (inclusions.length > 0) {
        messages.push(`Inclusions: ${inclusions.join(", ")}`);
      }

      const obsidianIgnoreFolders = extractAppIgnoreSettings(this.app);
      const exclusions = [...obsidianIgnoreFolders, ...getDecodedPatterns(settings.qaExclusions)];
      if (exclusions.length > 0) {
        messages.push(`Exclusions: ${exclusions.join(", ")}`);
      }

      this.state.indexNoticeMessage.textContent = messages.join("\n");
    }
  }

  private isStringLengthError(error: any): boolean {
    if (!error) return false;

    // Check if it's a direct RangeError
    if (error instanceof RangeError && error.message.toLowerCase().includes("string length")) {
      return true;
    }

    // Check the error message at any depth
    const message = error.message || error.toString();
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes("string length") || lowerMessage.includes("rangeerror");
  }

  private handleError(
    error: any,
    context?: {
      filePath?: string;
      errors?: string[];
      batch?: Array<{ note: PreparedNoteIngestion; chunk: PreparedChunk }>;
    }
  ): void {
    const filePath = context?.filePath;

    // Log the error with appropriate context
    if (filePath) {
      if (context.batch) {
        // Detailed batch processing error logging
        console.error("Batch processing error:", {
          error,
          batchSize: context.batch.length || 0,
          firstChunk: context.batch[0]
            ? {
                path: context.batch[0].chunk.fileInfo?.path,
                contentLength: context.batch[0].chunk.content?.length,
                hasFileInfo: !!context.batch[0].chunk.fileInfo,
              }
            : "No chunks in batch",
          errorType: error?.constructor?.name,
          errorMessage: error?.message,
        });
      } else {
        console.error(`Error indexing file ${filePath}:`, error);
      }
      context.errors?.push(filePath);
    } else {
      console.error("Fatal error during indexing:", error);
    }

    // Hide any existing indexing notice
    if (this.state.currentIndexingNotice) {
      this.state.currentIndexingNotice.hide();
    }

    // Handle json stringify string length error consistently
    if (this.isStringLengthError(error)) {
      new Notice(
        "Vault is too large for 1 partition, please increase the number of partitions in your Copilot QA settings!",
        10000 // Show for 10 seconds
      );
      return;
    }

    // Show appropriate error notice
    if (this.isRateLimitError(error)) {
      return; // Don't show duplicate notices for rate limit errors
    }

    const message = filePath
      ? `Error indexing file ${filePath}. Check console for details.`
      : "Fatal error during indexing. Check console for details.";
    new Notice(message);
  }

  private isRateLimitError(err: any): boolean {
    return err?.message?.includes?.("rate limit") || false;
  }

  private finalizeIndexing(errors: string[]): void {
    if (this.state.currentIndexingNotice) {
      this.state.currentIndexingNotice.hide();
    }

    if (this.state.isIndexingCancelled) {
      new Notice(`Indexing cancelled`);
      return;
    }

    if (errors.length > 0) {
      new Notice(`Indexing completed with ${errors.length} errors. Check console for details.`);
    } else {
      new Notice("Indexing completed successfully!");
    }
  }

  /**
   * Remove note metadata from the graph index when the file is deleted.
   *
   * @param noteId - Stable identifier of the note, typically the vault-relative path.
   */
  public async removeNoteFromGraph(noteId: string): Promise<void> {
    const settings = getSettings();
    const graphOptions = buildGraphOptionsFromSettings(settings);
    if (!graphOptions.enabled) {
      return;
    }

    await this.graphStore.initialize(buildGraphConnectionConfigFromSettings(settings));

    try {
      await this.graphStore.removeNote(noteId);
    } catch (error) {
      logError("Graph ingestion failed while removing note", {
        error,
        noteId,
      });
    }
  }

  public async reindexFile(file: TFile): Promise<void> {
    try {
      const embeddingInstance = await this.embeddingsManager.getEmbeddingsAPI();
      if (!embeddingInstance) {
        return;
      }

      await this.dbOps.removeDocs(file.path);

      // Check for model change
      const modelChanged = await this.dbOps.checkAndHandleEmbeddingModelChange(embeddingInstance);
      if (modelChanged) {
        await this.indexVaultToVectorStore(true);
        return;
      }

      const preparedNotes = await this.prepareIngestionPayloads([file]);
      if (preparedNotes.length === 0) {
        return;
      }

      const notePayload = preparedNotes[0];
      const embeddings = await embeddingInstance.embedDocuments(
        notePayload.chunks.map((chunk) => chunk.content)
      );

      for (let i = 0; i < notePayload.chunks.length; i++) {
        const chunk = notePayload.chunks[i];
        await this.dbOps.upsert({
          ...chunk.fileInfo,
          id: this.getDocHash(chunk.content),
          content: chunk.content,
          embedding: embeddings[i],
          created_at: Date.now(),
          nchars: chunk.content.length,
        });
      }

      await this.upsertGraphNote(notePayload.graphNote);

      // Mark that we have unsaved changes instead of saving immediately
      this.dbOps.markUnsavedChanges();

      if (getSettings().debug) {
        console.log(`Reindexed file: ${file.path}`);
      }
    } catch (error) {
      this.handleError(error, { filePath: file.path });
    }
  }

  public async cancelIndexing(): Promise<void> {
    console.log("Indexing cancelled by user");
    this.state.isIndexingCancelled = true;

    // Add a small delay to ensure all state updates are processed
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.state.currentIndexingNotice) {
      this.state.currentIndexingNotice.hide();
    }
  }
}
