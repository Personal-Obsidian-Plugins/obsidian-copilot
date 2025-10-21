import type { Driver, Session, Transaction } from "neo4j-driver";
import {
  buildGraphConnectionConfigFromSettings,
  buildGraphOptionsFromSettings,
  filterTagsByPrefixes,
  Neo4jGraphStore,
} from "@/search/neo4jGraphStore";
import type { NormalizedTagPath } from "@/search/tagNormalization";
import { normalizeTagPaths } from "@/search/tagNormalization";
import { DEFAULT_SETTINGS } from "@/constants";

interface RecordedRun {
  query: string;
  params: Record<string, unknown>;
}

class MockTransaction {
  public runs: RecordedRun[] = [];

  async run(query: string, params: Record<string, unknown>): Promise<void> {
    this.runs.push({ query, params });
  }
}

class MockSession {
  public transaction = new MockTransaction();
  public closed = false;
  public writeCalls = 0;

  async executeWrite<T>(work: (tx: Transaction) => Promise<T>): Promise<T> {
    this.writeCalls += 1;
    return work(this.transaction as unknown as Transaction);
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}

class MockDriver {
  public sessionInstance: MockSession = new MockSession();
  public verifyCalls = 0;
  public closed = false;

  session(): Session {
    return this.sessionInstance as unknown as Session;
  }

  async verifyConnectivity(): Promise<void> {
    this.verifyCalls += 1;
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}

describe("Neo4jGraphStore", () => {
  it("filters tags by prefixes", () => {
    const tags = normalizeTagPaths(["#parent/child", "#other", "#parent/child/grand"]);
    const filtered = filterTagsByPrefixes(tags, ["#parent/child"], false);
    expect(filtered.map((tag) => tag.canonical)).toEqual(["#parent/child", "#parent/child/grand"]);
  });

  it("builds connection config from settings", () => {
    const config = buildGraphConnectionConfigFromSettings({
      ...DEFAULT_SETTINGS,
      graphNeo4jUri: "bolt://localhost:7687",
      graphNeo4jUsername: "neo4j",
      graphNeo4jPassword: "password",
      graphNeo4jDatabase: "neo4j",
      graphNeo4jUseEncryption: false,
    });

    expect(config).toEqual({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "password",
      database: "neo4j",
      encrypted: false,
    });
  });

  it("initializes, upserts note content, and closes the session", async () => {
    const mockDriver = new MockDriver();
    const factory = jest.fn(() => mockDriver as unknown as Driver);
    const store = new Neo4jGraphStore(factory);

    await store.initialize({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "password",
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(mockDriver.verifyCalls).toBe(1);

    const noteTags: NormalizedTagPath[] = normalizeTagPaths(["#parent/child", "#standalone"]);
    const options = buildGraphOptionsFromSettings({
      ...DEFAULT_SETTINGS,
      enableGraphVectorStore: true,
      graphIndexAllTags: false,
      graphIncludedTagPrefixes: ["#parent"],
      graphIncludeWikiLinks: true,
      graphIncludeEmbeds: true,
    });

    await store.upsertNote(
      {
        noteId: "note-1",
        notePath: "path/to/note.md",
        tags: noteTags,
        wikiLinkTargets: ["linked.md", "linked.md"],
        embedTargets: ["embedded.md"],
        updatedAt: 42,
      },
      options
    );

    const session = mockDriver.sessionInstance;
    expect(session.writeCalls).toBe(1);
    expect(session.closed).toBe(true);

    const runs = session.transaction.runs;
    expect(runs).toHaveLength(7);
    expect(runs[0].query).toContain("MERGE (note:Note");
    expect(runs[1].params).toMatchObject({
      noteId: "note-1",
      tagCanonicals: ["#parent/child"],
    });
    expect((runs[2].params.tags as NormalizedTagPath[]).map((tag) => tag.canonical)).toEqual([
      "#parent/child",
    ]);
    expect(runs[3].params).toMatchObject({
      wikiLinkIds: ["linked.md"],
    });
    expect(runs[4].params).toMatchObject({
      wikiLinks: [{ id: "linked.md", path: "linked.md" }],
    });
    expect(runs[5].params).toMatchObject({
      embedIds: ["embedded.md"],
    });
    expect(runs[6].params).toMatchObject({
      embeds: [{ id: "embedded.md", path: "embedded.md" }],
    });
  });

  it("skips graph ingestion when disabled", async () => {
    const mockDriver = new MockDriver();
    const factory = jest.fn(() => mockDriver as unknown as Driver);
    const store = new Neo4jGraphStore(factory);

    await store.initialize({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "password",
    });

    await store.upsertNote(
      {
        noteId: "note-1",
        notePath: "path/to/note.md",
        tags: [],
        wikiLinkTargets: [],
        embedTargets: [],
        updatedAt: 42,
      },
      {
        enabled: false,
        includedTagPrefixes: [],
        indexAllTags: true,
        includeWikiLinks: false,
        includeEmbeds: false,
      }
    );

    const session = mockDriver.sessionInstance;
    expect(session.writeCalls).toBe(0);
  });

  it("removes a note from the graph store", async () => {
    const mockDriver = new MockDriver();
    const factory = jest.fn(() => mockDriver as unknown as Driver);
    const store = new Neo4jGraphStore(factory);

    await store.initialize({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "password",
    });

    await store.removeNote("note-1");

    const runs = mockDriver.sessionInstance.transaction.runs;
    expect(runs).toHaveLength(1);
    expect(runs[0].query).toContain("DETACH DELETE");
    expect(runs[0].params).toEqual({ noteId: "note-1" });
  });

  it("verifies connectivity with a throw-away driver", async () => {
    const mockDriver = new MockDriver();
    const factory = jest.fn(() => mockDriver as unknown as Driver);
    const store = new Neo4jGraphStore(factory);

    await store.verifyConnection({
      uri: "bolt://localhost:7687",
      username: "neo4j",
      password: "password",
    });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(mockDriver.verifyCalls).toBe(1);
    expect(mockDriver.closed).toBe(true);
  });
});
