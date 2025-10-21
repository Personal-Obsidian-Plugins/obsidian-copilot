import { logError, logInfo, logWarn } from "@/logger";
import type { CopilotSettings } from "@/settings/model";
import type { AuthToken, Driver, Session, Transaction } from "neo4j-driver";
import neo4j from "neo4j-driver";
import type { NormalizedTagPath } from "@/search/tagNormalization";
import { expandCanonicalPrefixes, normalizeTagPaths } from "@/search/tagNormalization";

/**
 * Runtime configuration for the Neo4j graph vector store connection.
 */
export interface GraphStoreConnectionConfig {
  /** Bolt or Neo4j+SRV URI supplied by the user. */
  uri: string;
  /** Username used when building a basic authentication token. */
  username?: string;
  /** Password used when building a basic authentication token. */
  password?: string;
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
 * Create a connection configuration from persisted settings.
 *
 * @param settings - Current Copilot settings snapshot.
 * @returns Connection configuration for initializing the Neo4j driver.
 */
export function buildGraphConnectionConfigFromSettings(
  settings: CopilotSettings
): GraphStoreConnectionConfig {
  return {
    uri: settings.graphNeo4jUri,
    username: settings.graphNeo4jUsername,
    password: settings.graphNeo4jPassword,
    database: settings.graphNeo4jDatabase || undefined,
    encrypted: settings.graphNeo4jUseEncryption,
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
 * ingestion helpers.
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

    if (!connection?.uri) {
      logWarn("Neo4j graph store initialization skipped due to missing URI");
      return;
    }

    let driver: Driver | null = null;
    try {
      const authToken = this.resolveAuthToken(connection);
      if (!authToken) {
        logWarn("Neo4j graph store initialization skipped due to missing credentials", {
          uri: connection.uri,
        });
        return;
      }

      driver = this.driverFactory(connection.uri, authToken, {
        encrypted: connection.encrypted ?? false,
      });
      await driver.verifyConnectivity({
        database: connection.database,
      });

      this.driver = driver;
      this.database = connection.database;
      logInfo("Neo4j graph store driver initialized", { uri: connection.uri });
    } catch (error) {
      if (driver) {
        await driver.close();
      }
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
   * Ingest a note into the graph store by upserting note, tag, and link relationships.
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
      const wikiLinks = options.includeWikiLinks ? Array.from(new Set(note.wikiLinkTargets)) : [];
      const embeds = options.includeEmbeds ? Array.from(new Set(note.embedTargets)) : [];

      if (tagsForGraph.length === 0 && wikiLinks.length === 0 && embeds.length === 0) {
        logInfo("No eligible tags or links for graph ingestion", { noteId: note.noteId });
        return;
      }

      const tagCanonicals = tagsForGraph.map((tag) => tag.canonical);
      const tagHierarchyPairs = this.buildTagHierarchyPairs(tagsForGraph);
      const wikiLinkNodes = wikiLinks.map((targetPath) => ({
        id: targetPath,
        path: targetPath,
      }));
      const embedNodes = embeds.map((targetPath) => ({
        id: targetPath,
        path: targetPath,
      }));

      await this.executeWrite(session, async (tx) => {
        await tx.run(
          `
            MERGE (note:Note {id: $noteId})
            SET
              note.path = $notePath,
              note.updatedAt = $updatedAt
          `,
          {
            noteId: note.noteId,
            notePath: note.notePath,
            updatedAt: note.updatedAt,
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            OPTIONAL MATCH (note)-[existing:HAS_TAG]->(existingTag:Tag)
            WHERE NOT existingTag.canonical IN $tagCanonicals
            DELETE existing
          `,
          {
            noteId: note.noteId,
            tagCanonicals,
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            FOREACH (tag IN $tags |
              MERGE (tagNode:Tag {canonical: tag.canonical})
              SET
                tagNode.segments = tag.segments,
                tagNode.hierarchicalPaths = tag.hierarchicalPaths
              MERGE (note)-[:HAS_TAG]->(tagNode)
            )
            FOREACH (pair IN $tagHierarchyPairs |
              MERGE (parent:Tag {canonical: pair.parent})
              MERGE (child:Tag {canonical: pair.child})
              MERGE (parent)-[:PARENT_OF]->(child)
            )
          `,
          {
            noteId: note.noteId,
            tags: tagsForGraph,
            tagHierarchyPairs,
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            OPTIONAL MATCH (note)-[existing:LINKS_TO]->(other:Note)
            WHERE NOT other.id IN $wikiLinkIds
            DELETE existing
          `,
          {
            noteId: note.noteId,
            wikiLinkIds: wikiLinkNodes.map((node) => node.id),
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            FOREACH (target IN $wikiLinks |
              MERGE (linked:Note {id: target.id})
              SET linked.path = target.path
              MERGE (note)-[:LINKS_TO]->(linked)
            )
          `,
          {
            noteId: note.noteId,
            wikiLinks: wikiLinkNodes,
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            OPTIONAL MATCH (note)-[existing:EMBEDS]->(embed:Note)
            WHERE NOT embed.id IN $embedIds
            DELETE existing
          `,
          {
            noteId: note.noteId,
            embedIds: embedNodes.map((node) => node.id),
          }
        );

        await tx.run(
          `
            MATCH (note:Note {id: $noteId})
            FOREACH (target IN $embeds |
              MERGE (embedded:Note {id: target.id})
              SET embedded.path = target.path
              MERGE (note)-[:EMBEDS]->(embedded)
            )
          `,
          {
            noteId: note.noteId,
            embeds: embedNodes,
          }
        );
      });
    } catch (error) {
      logError("Failed to upsert note into Neo4j", { error, noteId: note.noteId });
    } finally {
      await session.close();
    }
  }

  /**
   * Remove a note and its relationships from the graph store.
   *
   * @param noteId - Stable identifier for the note to remove.
   */
  async removeNote(noteId: string): Promise<void> {
    if (!this.driver) {
      logWarn("Graph removal skipped because Neo4j driver is not initialized", { noteId });
      return;
    }

    const session = this.openSession();
    try {
      await this.executeWrite(session, (tx) =>
        tx.run(
          `
            MATCH (note:Note {id: $noteId})
            DETACH DELETE note
          `,
          { noteId }
        )
      );
    } catch (error) {
      logError("Failed to remove note from Neo4j", { error, noteId });
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

  /**
   * Validate connectivity using the provided connection configuration.
   *
   * @param connection - Connection configuration to test.
   * @throws Error when connectivity fails.
   */
  async verifyConnection(connection: GraphStoreConnectionConfig): Promise<void> {
    if (!connection?.uri) {
      throw new Error("Neo4j connection URI is required.");
    }

    const authToken = this.resolveAuthToken(connection);
    if (!authToken) {
      throw new Error("Neo4j credentials are required to verify connectivity.");
    }

    const driver = this.driverFactory(connection.uri, authToken, {
      encrypted: connection.encrypted ?? false,
    });

    try {
      await driver.verifyConnectivity({
        database: connection.database,
      });
    } finally {
      await driver.close();
    }
  }

  private openSession(): Session {
    if (!this.driver) {
      throw new Error("Neo4j driver is not initialized");
    }

    return this.driver.session({ database: this.database });
  }

  /**
   * Resolve an authentication token from supplied connection credentials.
   *
   * @param connection - User-supplied connection configuration.
   * @returns Auth token compatible with the Neo4j driver, or null when credentials are missing.
   */
  private resolveAuthToken(connection: GraphStoreConnectionConfig): AuthToken | null {
    if (connection.authToken) {
      return connection.authToken;
    }

    if (connection.username && connection.password) {
      return neo4j.auth.basic(connection.username, connection.password);
    }

    return null;
  }

  /**
   * Produce parent/child tag relationships for a collection of normalized tags.
   *
   * @param tags - Normalized tag descriptors.
   * @returns Array of parent-child canonical path pairs.
   */
  private buildTagHierarchyPairs(
    tags: NormalizedTagPath[]
  ): Array<{ parent: string; child: string }> {
    const pairs: Array<{ parent: string; child: string }> = [];
    tags.forEach((tag) => {
      const paths = tag.hierarchicalPaths;
      for (let index = 1; index < paths.length; index += 1) {
        pairs.push({
          parent: paths[index - 1],
          child: paths[index],
        });
      }
    });
    return pairs;
  }

  /**
   * Execute a write transaction using whichever API is available on the current driver version.
   *
   * @param session - Active Neo4j session.
   * @param work - Callback executed within a transactional context.
   * @returns Result of the transactional callback.
   */
  private async executeWrite<T>(
    session: Session,
    work: (tx: Transaction) => Promise<T>
  ): Promise<T> {
    const maybeExecuteWrite = (
      session as unknown as {
        executeWrite?: (fn: (tx: Transaction) => Promise<T>) => Promise<T>;
        writeTransaction?: (fn: (tx: Transaction) => Promise<T>) => Promise<T>;
      }
    ).executeWrite;
    if (typeof maybeExecuteWrite === "function") {
      return maybeExecuteWrite.call(session, work);
    }

    const maybeWriteTransaction = (
      session as unknown as {
        writeTransaction?: (fn: (tx: Transaction) => Promise<T>) => Promise<T>;
      }
    ).writeTransaction;
    if (typeof maybeWriteTransaction === "function") {
      return maybeWriteTransaction.call(session, work);
    }

    throw new Error("Neo4j session does not support executeWrite/writeTransaction");
  }
}
