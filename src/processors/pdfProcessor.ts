import {
  PDFCache,
  PDF_CACHE_VERSION,
  type PdfCacheEntry,
  type PdfCachePage,
  type PdfParserSource,
} from "@/cache/pdfCache";
import { getDecryptedKey } from "@/encryptionService";
import { logError, logInfo, logWarn } from "@/logger";
import { getSettings } from "@/settings/model";
import pdf2md from "@opendocsg/pdf2md";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { RequestUrlParam, RequestUrlResponse, TFile, Vault, requestUrl } from "obsidian";

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

interface FormatArgs {
  source: PdfParserSource;
  markdown: string;
  pdfBytes: ArrayBuffer;
  pages?: unknown[];
  jobId?: string;
  warnings?: string[];
  fileName?: string;
}

interface PdfArtifacts {
  pageCount: number;
  annotations: Map<number, string[]>;
  imageCounts: Map<number, number>;
  warnings: string[];
}

/**
 * Helper responsible for normalising PDF content into markdown while enriching
 * it with metadata gathered from pdf.js (annotations, image placeholders, etc).
 */
class PdfFormatter {
  private pdfjsModulePromise: Promise<PdfJsModule> | null = null;

  /**
   * Format markdown output into a structured cache entry enriched with page level metadata.
   *
   * @param args - Formatting parameters including markdown, parsed pages, and metadata.
   * @returns A cache entry ready for persistence.
   */
  async format(args: FormatArgs): Promise<PdfCacheEntry> {
    const artifacts = await this.extractPdfArtifacts(args.pdfBytes, args.fileName);
    const segments = this.derivePageSegments(args.markdown, artifacts.pageCount, args.pages);
    const warnings = [...(args.warnings ?? []), ...artifacts.warnings];

    const pages: PdfCachePage[] = [];
    const renderedPages: string[] = [];

    for (let index = 0; index < segments.length; index++) {
      const pageNumber = index + 1;
      const normalizedBlocks = this.reflowBlocks(segments[index]);
      const imagePlaceholders = this.buildImagePlaceholders(
        pageNumber,
        artifacts.imageCounts.get(pageNumber) ?? 0
      );
      const annotations = artifacts.annotations.get(pageNumber) ?? [];
      const pageContent = this.composePageBody(normalizedBlocks, imagePlaceholders, annotations);

      pages.push({
        pageNumber,
        content: pageContent,
        headings: this.extractHeadings(normalizedBlocks),
        images: imagePlaceholders,
        annotations,
      });
      renderedPages.push(pageContent);
    }

    const markdown = renderedPages.join("\n\n---\n\n").trim();

    return {
      version: PDF_CACHE_VERSION,
      source: args.source,
      markdown,
      pages,
      meta: {
        pageCount: pages.length,
        extractedAt: new Date().toISOString(),
        jobId: args.jobId,
        warnings,
      },
    };
  }

  /**
   * Lazily load the pdf.js module and ensure the worker source is set for the Electron runtime.
   *
   * @returns The pdf.js module instance.
   */
  private async getPdfJsModule(): Promise<PdfJsModule> {
    if (!this.pdfjsModulePromise) {
      this.pdfjsModulePromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((module) => {
        const pdfjs = module as PdfJsModule & { GlobalWorkerOptions?: { workerSrc: string } };
        if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.js";
        }
        return module;
      });
    }
    return this.pdfjsModulePromise;
  }

  /**
   * Extract annotations and image counts for each page using pdf.js primitives.
   *
   * @param pdfBytes - Raw PDF data.
   * @param fileName - Optional filename for logging context.
   * @returns Annotation and image metadata for downstream formatting.
   */
  private async extractPdfArtifacts(
    pdfBytes: ArrayBuffer,
    fileName?: string
  ): Promise<PdfArtifacts> {
    try {
      const pdfjs = await this.getPdfJsModule();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(pdfBytes),
        useSystemFonts: true,
        isEvalSupported: false,
      });

      let document: PDFDocumentProxy | null = null;
      try {
        document = await loadingTask.promise;
        const pageCount = document.numPages;
        const annotations = new Map<number, string[]>();
        const imageCounts = new Map<number, number>();
        const opsConstants = (pdfjs as PdfJsModule & { OPS?: Record<string, number> }).OPS;

        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
          const page = await document.getPage(pageNumber);
          const pageAnnotationsRaw = (await page.getAnnotations()) as Array<
            Record<string, unknown>
          >;
          const normalizedAnnotations = pageAnnotationsRaw
            .map((annotationRecord) => {
              const contents = annotationRecord?.contents;
              const title = annotationRecord?.title;
              const candidate =
                typeof contents === "string" && contents.trim().length > 0
                  ? contents
                  : typeof title === "string" && title.trim().length > 0
                    ? title
                    : null;
              return candidate;
            })
            .filter((value): value is string => value !== null)
            .map((value) => value.trim());

          if (normalizedAnnotations.length > 0) {
            annotations.set(pageNumber, normalizedAnnotations);
          }

          const operatorList = await page.getOperatorList();
          const ops = operatorList.fnArray;
          let imageCounter = 0;
          for (const fn of ops) {
            if (
              opsConstants &&
              (fn === opsConstants.paintImageXObject || fn === opsConstants.paintInlineImageXObject)
            ) {
              imageCounter += 1;
            }
          }
          if (imageCounter > 0) {
            imageCounts.set(pageNumber, imageCounter);
          }
        }

        return {
          pageCount,
          annotations,
          imageCounts,
          warnings: [],
        };
      } finally {
        document?.destroy();
        loadingTask.destroy();
      }
    } catch (error) {
      logWarn(
        "Failed to extract PDF annotations/images; continuing without them:",
        fileName,
        error
      );
      return {
        pageCount: 0,
        annotations: new Map<number, string[]>(),
        imageCounts: new Map<number, number>(),
        warnings: [
          "PDF metadata extraction failed; annotations and image placeholders may be missing.",
        ],
      };
    }
  }

  /**
   * Derive page-level text segments either from LlamaParse JSON pages or by splitting markdown.
   *
   * @param markdown - Markdown string returned by the parser.
   * @param pageCount - Page count detected via pdf.js (0 when unavailable).
   * @param pages - Optional structured pages from LlamaParse.
   * @returns An array of strings—one per page—to feed the formatter.
   */
  private derivePageSegments(markdown: string, pageCount: number, pages?: unknown[]): string[] {
    const segmentsFromPages = Array.isArray(pages)
      ? pages
          .map((page) => this.extractTextFromPage(page))
          .filter(
            (segment): segment is string => typeof segment === "string" && segment.trim().length > 0
          )
      : [];

    let segments = segmentsFromPages.length > 0 ? segmentsFromPages : this.splitMarkdown(markdown);

    if (pageCount > 0 && segments.length !== pageCount) {
      if (segments.length > pageCount) {
        // Merge extra segments into the last page to avoid data loss.
        const mergedTail = segments.slice(pageCount - 1).join("\n\n");
        segments = [...segments.slice(0, pageCount - 1), mergedTail];
      } else if (segments.length < pageCount) {
        // Pad with empty pages so downstream consumers can rely on counts.
        const padding = Array(pageCount - segments.length).fill("");
        segments = [...segments, ...padding];
      }
    }

    if (segments.length === 0) {
      return [markdown.trim()];
    }

    return segments.map((segment) => segment.trim());
  }

  /**
   * Attempt to coerce a structured LlamaParse page into a plain text segment.
   *
   * @param page - Raw page object returned by LlamaParse.
   * @returns The extracted text or null when unavailable.
   */
  private extractTextFromPage(page: unknown): string | null {
    if (!page || typeof page !== "object") {
      return null;
    }

    const record = page as Record<string, unknown>;
    const preferredKeys = ["markdown", "md", "content", "text"];

    for (const key of preferredKeys) {
      const candidate = record[key];
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate;
      }
    }

    if (Array.isArray(record.lines)) {
      const joined = record.lines
        .map((line) => (typeof line === "string" ? line : (line as Record<string, unknown>)?.text))
        .filter((line): line is string => typeof line === "string" && line.length > 0)
        .join("\n");
      if (joined.trim().length > 0) {
        return joined;
      }
    }

    if (Array.isArray(record.items)) {
      const combined = record.items
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            if (typeof obj.markdown === "string") {
              return obj.markdown;
            }
            if (typeof obj.text === "string") {
              return obj.text;
            }
            if (typeof obj.content === "string") {
              return obj.content;
            }
          }
          return "";
        })
        .filter((line) => line.length > 0)
        .join("\n");
      if (combined.trim().length > 0) {
        return combined;
      }
    }

    return null;
  }

  /**
   * Split markdown into per-page segments using common delimiters.
   *
   * @param markdown - Markdown string to segment.
   * @returns A list of trimmed markdown chunks.
   */
  private splitMarkdown(markdown: string): string[] {
    const separators = /\n-{3,}\n/g;
    const parts = markdown
      .split(separators)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
    if (parts.length > 0) {
      return parts;
    }
    const fallback = markdown.replace(/\f/g, "\n").trim();
    if (fallback.length === 0) {
      return [];
    }
    return [fallback];
  }

  /**
   * Reflow markdown lines into semantic blocks while respecting code fences and lists.
   *
   * @param source - Page markdown candidate.
   * @returns Normalised blocks preserving ordering.
   */
  private reflowBlocks(source: string): string[] {
    const lines = source.split(/\r?\n/);
    const blocks: string[] = [];
    let buffer: string[] = [];
    let insideCodeFence = false;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (line.startsWith("```")) {
        if (buffer.length > 0) {
          blocks.push(this.mergeParagraph(buffer));
          buffer = [];
        }
        blocks.push(line);
        insideCodeFence = !insideCodeFence;
        continue;
      }

      if (insideCodeFence) {
        blocks.push(rawLine);
        continue;
      }

      const trimmed = line.trim();
      if (trimmed.length === 0) {
        if (buffer.length > 0) {
          blocks.push(this.mergeParagraph(buffer));
          buffer = [];
        }
        continue;
      }

      if (this.isStandaloneBlock(trimmed)) {
        if (buffer.length > 0) {
          blocks.push(this.mergeParagraph(buffer));
          buffer = [];
        }
        blocks.push(this.normalizeHeading(trimmed));
        continue;
      }

      buffer.push(trimmed);
    }

    if (buffer.length > 0) {
      blocks.push(this.mergeParagraph(buffer));
    }

    return blocks;
  }

  /**
   * Merge multiple line fragments into a single paragraph, repairing soft hyphenation.
   *
   * @param lines - Line fragments belonging to the same paragraph.
   * @returns A normalised paragraph string.
   */
  private mergeParagraph(lines: string[]): string {
    let paragraph = lines[0];
    for (let index = 1; index < lines.length; index++) {
      const previous = paragraph;
      const current = lines[index];
      if (previous.endsWith("-")) {
        paragraph = previous.slice(0, -1) + current.replace(/^\s+/, "");
      } else {
        paragraph = `${previous} ${current}`.replace(/\s+/g, " ").trim();
      }
    }
    return paragraph.trim();
  }

  /**
   * Determine whether the given line represents a standalone markdown block (heading/list/table/etc.).
   *
   * @param line - Line to evaluate.
   * @returns True when the line should be emitted as-is without paragraph merging.
   */
  private isStandaloneBlock(line: string): boolean {
    return (
      /^#{1,6}\s/.test(line) ||
      /^(\*|-|\d+\.)\s+/.test(line) ||
      line.startsWith(">") ||
      /^\|.*\|$/.test(line)
    );
  }

  /**
   * Normalise heading candidates by applying markdown prefixes when appropriate.
   *
   * @param line - Line to normalise.
   * @returns The original or heading-prefixed line.
   */
  private normalizeHeading(line: string): string {
    if (/^#{1,6}\s/.test(line)) {
      return line;
    }

    if (this.isHeadingCandidate(line)) {
      return `## ${line}`;
    }

    return line;
  }

  /**
   * Heuristic to detect lines that likely represent headings without markdown markers.
   *
   * @param line - Line to analyse.
   * @returns True when the line should be treated as a heading.
   */
  private isHeadingCandidate(line: string): boolean {
    if (line.length > 120 || /[.!?]$/.test(line)) {
      return false;
    }

    const letters = line.replace(/[^A-Za-z]/g, "");
    if (letters.length === 0) {
      return false;
    }

    const uppercaseCount = letters.replace(/[^A-Z]/g, "").length;
    const uppercaseRatio = uppercaseCount / letters.length;
    const wordCount = line.split(/\s+/).length;

    return uppercaseRatio >= 0.6 && wordCount <= 12;
  }

  /**
   * Generate human-readable placeholders for pages that reference embedded images.
   *
   * @param pageNumber - 1-based page index.
   * @param count - Number of detected images.
   * @returns Placeholder labels.
   */
  private buildImagePlaceholders(pageNumber: number, count: number): string[] {
    if (count <= 0) {
      return [];
    }
    const placeholders: string[] = [];
    for (let index = 0; index < count; index++) {
      placeholders.push(`Image ${pageNumber}.${index + 1}`);
    }
    return placeholders;
  }

  /**
   * Compose the final page body by combining text blocks, image placeholders, and annotations.
   *
   * @param blocks - Normalised textual blocks.
   * @param imagePlaceholders - Generated image placeholders.
   * @param annotations - Extracted annotations for the page.
   * @returns Markdown representing the final page body.
   */
  private composePageBody(
    blocks: string[],
    imagePlaceholders: string[],
    annotations: string[]
  ): string {
    const entries = [...blocks];

    if (imagePlaceholders.length > 0) {
      imagePlaceholders.forEach((placeholder) => {
        entries.push(`> Image: ${placeholder} (image content not extracted locally)`);
      });
    }

    if (annotations.length > 0) {
      annotations.forEach((annotation) => {
        entries.push(`> Annotation: ${annotation}`);
      });
    }

    return entries.join("\n\n").trim();
  }

  /**
   * Extract heading text from the normalised block list for metadata purposes.
   *
   * @param blocks - Normalised block list.
   * @returns A list of heading strings.
   */
  private extractHeadings(blocks: string[]): string[] {
    return blocks
      .filter((block) => /^#{1,6}\s/.test(block))
      .map((block) => block.replace(/^#{1,6}\s*/, "").trim())
      .filter((heading) => heading.length > 0);
  }
}

/**
 * Local PDF processor that prefers LlamaParse when configured and falls back to pdf2md.
 * Results are cached via PDFCache and enriched using PdfFormatter for consistent markdown.
 */
export class LocalPdfProcessor {
  private static readonly LLAMA_PARSE_BASE_URL = "https://api.cloud.llamaindex.ai";
  private static readonly LLAMA_PARSE_POLL_INTERVAL_MS = 1500;
  private static readonly LLAMA_PARSE_MAX_ATTEMPTS = 40;

  constructor(
    private readonly cache = PDFCache.getInstance(),
    private readonly formatter = new PdfFormatter()
  ) {}

  /**
   * Parse the supplied PDF file into markdown, leveraging caching where possible.
   *
   * @param file - The Obsidian file to parse.
   * @param vault - The vault instance used to read binary content.
   * @returns The cached or newly generated PDF cache entry.
   */
  async parseToMarkdown(file: TFile, vault: Vault): Promise<PdfCacheEntry> {
    const cached = await this.cache.get(file);
    if (cached) {
      logInfo("Using cached PDF parsing result:", file.path);
      return cached;
    }

    const pdfBytes = await vault.readBinary(file);
    const entry = await this.processPdf(file, pdfBytes);
    await this.cache.set(file, entry);
    return entry;
  }

  /**
   * Clear all cached PDF entries.
   */
  async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  /**
   * Decide which parsing strategy to use based on settings and runtime availability.
   *
   * @param file - PDF file being processed.
   * @param pdfBytes - Raw PDF binary content.
   * @returns A formatted cache entry.
   */
  private async processPdf(file: TFile, pdfBytes: ArrayBuffer): Promise<PdfCacheEntry> {
    const settings = getSettings();
    const rawApiKey = settings.llamaParseApiKey?.trim();
    const warnings: string[] = [];

    if (rawApiKey) {
      try {
        const apiKey = await getDecryptedKey(rawApiKey);
        if (!apiKey) {
          throw new Error("LlamaParse API key could not be decrypted.");
        }
        return await this.runLlamaParse(file, pdfBytes, apiKey);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logWarn("LlamaParse request failed, falling back to pdf2md:", file.path, message);
        warnings.push(`LlamaParse unavailable: ${message}`);
      }
    } else {
      logInfo("No LlamaParse API key configured; using pdf2md fallback:", file.path);
      warnings.push("LlamaParse API key missing; used local pdf2md fallback.");
    }

    return await this.runPdf2Md(file, pdfBytes, warnings);
  }

  /**
   * Execute a LlamaParse job via the hosted API.
   *
   * @param file - PDF file reference for logging.
   * @param pdfBytes - Raw PDF data.
   * @param apiKey - Decrypted Llama Cloud API key.
   * @returns A formatted cache entry produced from LlamaParse output.
   */
  private async runLlamaParse(
    file: TFile,
    pdfBytes: ArrayBuffer,
    apiKey: string
  ): Promise<PdfCacheEntry> {
    const jobId = await this.uploadToLlamaParse(pdfBytes, file.name, apiKey);
    await this.pollLlamaParseJob(jobId, apiKey);

    const [markdown, pages] = await Promise.all([
      this.fetchLlamaParseMarkdown(jobId, apiKey),
      this.fetchLlamaParsePages(jobId, apiKey),
    ]);

    return await this.formatter.format({
      source: "llama-parse",
      markdown,
      pages,
      pdfBytes,
      jobId,
      fileName: file.name,
    });
  }

  /**
   * Convert PDFs locally using pdf2md when LlamaParse is unavailable.
   *
   * @param file - PDF file reference for logging.
   * @param pdfBytes - Raw PDF data.
   * @param warnings - Warning messages to attach to the cache entry.
   * @returns A formatted cache entry produced from pdf2md output.
   */
  private async runPdf2Md(
    file: TFile,
    pdfBytes: ArrayBuffer,
    warnings: string[]
  ): Promise<PdfCacheEntry> {
    try {
      const markdown = await pdf2md(pdfBytes);
      return await this.formatter.format({
        source: "pdf2md",
        markdown,
        pdfBytes,
        warnings,
        fileName: file.name,
      });
    } catch (error) {
      logError("pdf2md conversion failed for:", file.path, error);
      throw error;
    }
  }

  private async uploadToLlamaParse(
    pdfBytes: ArrayBuffer,
    fileName: string,
    apiKey: string
  ): Promise<string> {
    const boundary = `----copilot-${Date.now().toString(16)}`;
    const encoder = new TextEncoder();

    const headerPart = encoder.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`
    );
    const footerPart = encoder.encode(`\r\n--${boundary}--\r\n`);
    const filePart = new Uint8Array(pdfBytes);

    const payload = new Uint8Array(headerPart.length + filePart.length + footerPart.length);
    payload.set(headerPart, 0);
    payload.set(filePart, headerPart.length);
    payload.set(footerPart, headerPart.length + filePart.length);

    const response = await this.llamaParseRequest(
      {
        url: `${LocalPdfProcessor.LLAMA_PARSE_BASE_URL}/api/v1/parsing/upload`,
        method: "POST",
        contentType: `multipart/form-data; boundary=${boundary}`,
        body: payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength),
      },
      apiKey
    );

    const data = this.parseJsonResponse(response);
    if (!data?.id) {
      throw new Error("LlamaParse upload did not return a job id.");
    }
    return data.id as string;
  }

  private async pollLlamaParseJob(jobId: string, apiKey: string): Promise<void> {
    for (let attempt = 0; attempt < LocalPdfProcessor.LLAMA_PARSE_MAX_ATTEMPTS; attempt++) {
      const response = await this.llamaParseRequest(
        {
          url: `${LocalPdfProcessor.LLAMA_PARSE_BASE_URL}/api/v1/parsing/job/${jobId}`,
          method: "GET",
        },
        apiKey
      );
      const data = this.parseJsonResponse(response);
      const status = (data?.status as string | undefined) ?? "UNKNOWN";

      if (status === "SUCCESS") {
        return;
      }
      if (status === "ERROR" || status === "CANCELLED") {
        const reason = data?.error_message || data?.error_code || `Job ended with status ${status}`;
        throw new Error(String(reason));
      }

      await this.sleep(LocalPdfProcessor.LLAMA_PARSE_POLL_INTERVAL_MS);
    }
    throw new Error("LlamaParse polling timed out.");
  }

  private async fetchLlamaParseMarkdown(jobId: string, apiKey: string): Promise<string> {
    const response = await this.llamaParseRequest(
      {
        url: `${LocalPdfProcessor.LLAMA_PARSE_BASE_URL}/api/v1/parsing/job/${jobId}/result/markdown`,
        method: "GET",
      },
      apiKey
    );
    const data = this.parseJsonResponse(response);
    const markdown = data?.markdown;
    if (typeof markdown !== "string" || markdown.trim().length === 0) {
      throw new Error("LlamaParse markdown response was empty.");
    }
    return markdown;
  }

  private async fetchLlamaParsePages(jobId: string, apiKey: string): Promise<unknown[]> {
    try {
      const response = await this.llamaParseRequest(
        {
          url: `${LocalPdfProcessor.LLAMA_PARSE_BASE_URL}/api/v1/parsing/job/${jobId}/result/json`,
          method: "GET",
        },
        apiKey
      );
      const data = this.parseJsonResponse(response);
      if (Array.isArray(data?.pages)) {
        return data.pages as unknown[];
      }
      return [];
    } catch (error) {
      logWarn("Failed to fetch LlamaParse JSON result, continuing with markdown only:", error);
      return [];
    }
  }

  private async llamaParseRequest(
    params: RequestUrlParam,
    apiKey: string
  ): Promise<RequestUrlResponse> {
    const response = await requestUrl({
      ...params,
      headers: {
        ...(params.headers ?? {}),
        Authorization: `Bearer ${apiKey}`,
      },
      throw: false,
    });

    if (response.status >= 400) {
      const body = this.safeParseError(response);
      const reason =
        body?.detail?.reason || body?.detail?.message || body?.message || `HTTP ${response.status}`;
      throw new Error(`LlamaParse request failed: ${reason}`);
    }

    return response;
  }

  private parseJsonResponse(response: RequestUrlResponse): any {
    if (response.json && typeof response.json === "object") {
      return response.json;
    }
    if (typeof response.json === "string" && response.json.length > 0) {
      try {
        return JSON.parse(response.json);
      } catch {
        // fall through to text parsing
      }
    }
    if (typeof response.text === "string" && response.text.length > 0) {
      try {
        return JSON.parse(response.text);
      } catch {
        return null;
      }
    }
    return null;
  }

  private safeParseError(response: RequestUrlResponse): any {
    try {
      if (response.json) {
        if (typeof response.json === "string") {
          return JSON.parse(response.json);
        }
        return response.json;
      }
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch {
      // ignore parse errors
    }
    return null;
  }

  private async sleep(durationMs: number): Promise<void> {
    return await new Promise((resolve) => setTimeout(resolve, durationMs));
  }
}
