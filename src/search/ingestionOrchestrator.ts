import { logError } from "@/logger";
import type {
  GraphIndexedNote,
  GraphStoreConnectionConfig,
  GraphStoreRuntimeOptions,
} from "@/search/neo4jGraphStore";
import { Neo4jGraphStore } from "@/search/neo4jGraphStore";

/**
 * Dense chunk payload destined for the Chroma vector store writer.
 */
export interface DenseVectorChunk {
  /** Stable chunk identifier used by the dense store for updates. */
  chunkId: string;
  /** Identifier of the note the chunk belongs to. */
  noteId: string;
  /** Rendered content fed into the embedding provider. */
  content: string;
  /** Additional metadata persisted alongside the chunk. */
  metadata: Record<string, unknown>;
}

/**
 * Interface describing the dense vector store writer API.
 */
export interface DenseVectorWriter {
  /**
   * Upsert or replace the supplied dense chunks.
   *
   * @param chunks - Chunk payloads destined for Chroma (or equivalent) storage.
   */
  upsertChunks(chunks: DenseVectorChunk[]): Promise<void>;

  /**
   * Remove all dense chunks associated with the provided note identifier.
   *
   * @param noteId - Stable identifier for the note being deleted.
   */
  removeNote(noteId: string): Promise<void>;
}

/**
 * Aggregate ingestion payload combining dense chunks and graph metadata.
 */
export interface IngestionPayload {
  /** Dense chunks to persist in Chroma. */
  denseChunks: DenseVectorChunk[];
  /** Graph-ready snapshot of the note. */
  note: GraphIndexedNote;
}

/**
 * Coordinates ingestion work across the dense vector store and Neo4j graph store.
 */
export class IngestionOrchestrator {
  constructor(
    private readonly denseWriter: DenseVectorWriter,
    private readonly graphStore: Neo4jGraphStore,
    private readonly connectionProvider: () => GraphStoreConnectionConfig,
    private readonly optionsProvider: () => GraphStoreRuntimeOptions
  ) {}

  /**
   * Ingest a note into both Chroma and Neo4j, respecting runtime settings.
   *
   * @param payload - Aggregated dense chunks and graph metadata.
   */
  async ingest(payload: IngestionPayload): Promise<void> {
    if (payload.denseChunks.length > 0) {
      await this.denseWriter.upsertChunks(payload.denseChunks);
    }

    const graphOptions = this.optionsProvider();
    if (graphOptions.enabled) {
      await this.graphStore.initialize(this.connectionProvider());
    }

    try {
      await this.graphStore.upsertNote(payload.note, graphOptions);
    } catch (error) {
      logError("Graph ingestion failed during orchestrator ingest", {
        error,
        noteId: payload.note.noteId,
      });
    }
  }

  /**
   * Remove a note from both dense and graph stores (when enabled).
   *
   * @param noteId - Stable identifier for the note.
   */
  async removeNote(noteId: string): Promise<void> {
    await this.denseWriter.removeNote(noteId);

    const graphOptions = this.optionsProvider();
    if (!graphOptions.enabled) {
      return;
    }

    await this.graphStore.initialize(this.connectionProvider());

    try {
      await this.graphStore.removeNote(noteId);
    } catch (error) {
      logError("Graph ingestion failed while removing note", { error, noteId });
    }
  }

  /**
   * Shut down the underlying graph store.
   */
  async shutdown(): Promise<void> {
    await this.graphStore.shutdown();
  }
}
