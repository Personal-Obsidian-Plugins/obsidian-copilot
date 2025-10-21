import { logError, logInfo, logWarn } from "@/logger";
import type { CopilotSettings } from "@/settings/model";
import type { AuthToken, Driver, Session } from "neo4j-driver";
import neo4j from "neo4j-driver";
import type { NormalizedTagPath } from "@/search/tagNormalization";
import { expandCanonicalPrefixes, normalizeTagPaths } from "@/search/tagNormalization";

/**
 * Runtime configuration for the Neo4j graph vector store connection.
 */
export interface GraphStoreConnectionConfig {
  /** Bolt or Neo4j+SRV URI supplied by the user. */
  uri: string;
  /** Authentication token, typically created via `neo4j.auth.basic`. */
  authToken?: AuthToken;
  /** Optional database name (defaults to the server's default database). */
  database?: string;
  /** Toggle encryption; defaults to false for local setups. */
  encrypted?: boolean;
}

/**
 * Settings-derived runtime options that gate indexing behaviour.
 */
export interface GraphStoreRuntimeOptions {
  /** Whether graph indexing is enabled by user settings. */
  enabled: boolean;
  /** Canonical tag prefixes that are eligible for graph ingestion. */
  includedTagPrefixes: string[];
  /** Whether to bypass tag filtering and index all tags. */
  indexAllTags: boolean;
  /** Whether wiki-links should be ingested. */
  includeWikiLinks: boolean;
  /** Whether embeds should be ingested. */
  includeEmbeds: boolean;
}

/**
 * Minimal representation of a note ready for graph ingestion.
 */
export interface GraphIndexedNote {
  /** Stable identifier used to de-duplicate nodes, typically the note path. */
  noteId: string;
  /** File system path relative to the vault root. */
  notePath: string;
  /** Normalized tag descriptors associated with the note. */
  tags: NormalizedTagPath[];
  /** Canonical wiki-link targets (note paths) referenced from this note. */
  wikiLinkTargets: string[];
  /** Embedded resources or notes referenced by this note. */
  embedTargets: string[];
  /** Epoch milliseconds for the note's last modified timestamp. */
  updatedAt: number;
}

/**
 * Build runtime graph options based on persisted settings.
 *
 * @param settings - Current Copilot settings snapshot.
 * @returns Graph indexing runtime options.
 */
export function buildGraphOptionsFromSettings(settings: CopilotSettings): GraphStoreRuntimeOptions {
  return {
    enabled: settings.enableGraphVectorStore,
    includedTagPrefixes: settings.graphIncludedTagPrefixes,
    indexAllTags: settings.graphIndexAllTags,
    includeWikiLinks: settings.graphIncludeWikiLinks,
    includeEmbeds: settings.graphIncludeEmbeds,
  };
}

/**
 * Filter note tags against user-selected prefixes expanded across each hierarchical level.
 *
 * @param tags - Normalized tag descriptors associated with a note.
 * @param includedPrefixes - Canonical prefixes that should be kept.
 * @returns Subset of `tags` whose canonical representation matches at least one prefix.
 */
export function filterTagsByPrefixes(
  tags: NormalizedTagPath[],
  includedPrefixes: string[],
  indexAll: boolean
): NormalizedTagPath[] {
  if (indexAll || includedPrefixes.length === 0) {
    return tags;
  }

  const expandedPrefixes = new Set<string>();
  includedPrefixes.forEach((prefix) => {
    expandCanonicalPrefixes(prefix).forEach((expandedPrefix) => {
      expandedPrefixes.add(expandedPrefix);
    });
  });

  return tags.filter((tag) => tag.hierarchicalPaths.some((path) => expandedPrefixes.has(path)));
}

/**
 * Neo4j graph store orchestrator. Lazily manages the driver lifecycle and prepares
 * ingestion helpers. Mutation methods currently log intentions and will be expanded
 * in subsequent iterations.
 */
export class Neo4jGraphStore {
  private driver: Driver | null = null;
  private database: string | undefined;

  constructor(private readonly driverFactory: typeof neo4j.driver = neo4j.driver) {}

  /**
   * Initialize the graph store by creating a Neo4j driver. Safe to call multiple times.
   *
   * @param connection - Connection parameters supplied by the settings modal.
   */
  async initialize(connection: GraphStoreConnectionConfig): Promise<void> {
    if (this.driver) {
      return;
    }

    if (!connection.uri) {
      logWarn("Neo4j graph store initialization skipped due to missing URI");
      return;
    }

    if (!connection.authToken) {
      logWarn("Neo4j graph store initialization skipped due to missing auth token", {
        uri: connection.uri,
      });
      return;
    }

    try {
      this.driver = this.driverFactory(connection.uri, connection.authToken, {
        encrypted: connection.encrypted ?? false,
      });
      this.database = connection.database;
      logInfo("Neo4j graph store driver initialized", { uri: connection.uri });
    } catch (error) {
      logError("Failed to initialize Neo4j driver", { error });
      this.driver = null;
    }
  }

  /**
   * Close the underlying driver to release resources.
   */
  async shutdown(): Promise<void> {
    if (!this.driver) {
      return;
    }

    try {
      await this.driver.close();
    } catch (error) {
      logWarn("Neo4j driver close encountered an error", { error });
    } finally {
      this.driver = null;
    }
  }

  /**
   * Ingest a note into the graph store. Currently logs the intended mutation and will be
   * implemented with full Cypher upserts in a follow-up change.
   *
   * @param note - Normalized note payload including tag metadata.
   * @param options - Runtime toggles derived from settings.
   */
  async upsertNote(note: GraphIndexedNote, options: GraphStoreRuntimeOptions): Promise<void> {
    if (!options.enabled) {
      logInfo("Graph indexing disabled; skipping note upsert", { noteId: note.noteId });
      return;
    }

    if (!this.driver) {
      logWarn("Graph indexing skipped because Neo4j driver is not initialized", {
        noteId: note.noteId,
      });
      return;
    }

    const tagsForGraph = filterTagsByPrefixes(
      note.tags,
      options.includedTagPrefixes,
      options.indexAllTags
    );
    const session = this.openSession();

    try {
      const wikiLinks = options.includeWikiLinks ? note.wikiLinkTargets : [];
      const embeds = options.includeEmbeds ? note.embedTargets : [];

      if (tagsForGraph.length === 0 && wikiLinks.length === 0 && embeds.length === 0) {
        logInfo("No eligible tags or links for graph ingestion", { noteId: note.noteId });
        return;
      }

      logInfo("Preparing graph upsert (to be implemented)", {
        noteId: note.noteId,
        tagCount: tagsForGraph.length,
        wikiLinkCount: wikiLinks.length,
        embedCount: embeds.length,
      });
      // TODO: Implement Cypher upsert mutations for notes and tag hierarchy nodes.
    } catch (error) {
      logError("Failed to prepare graph upsert", { error, noteId: note.noteId });
    } finally {
      await session.close();
    }
  }

  /**
   * Convenience helper to normalize raw tags before ingestion.
   *
   * @param rawTags - Iterable of tag strings collected from a note.
   * @returns Normalized tag descriptors. Invalid tags are automatically discarded.
   */
  normalizeTags(rawTags: Iterable<string>): NormalizedTagPath[] {
    return normalizeTagPaths(rawTags);
  }

  private openSession(): Session {
    if (!this.driver) {
      throw new Error("Neo4j driver is not initialized");
    }

    return this.driver.session({ database: this.database });
  }
}
