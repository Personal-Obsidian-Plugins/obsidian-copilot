import type {
  DenseVectorWriter,
  DenseVectorChunk,
  IngestionPayload,
} from "@/search/ingestionOrchestrator";
import { IngestionOrchestrator } from "@/search/ingestionOrchestrator";
import type {
  GraphIndexedNote,
  GraphStoreConnectionConfig,
  GraphStoreRuntimeOptions,
  Neo4jGraphStore,
} from "@/search/neo4jGraphStore";

const createDenseChunk = (noteId: string): DenseVectorChunk => ({
  chunkId: `${noteId}-chunk`,
  noteId,
  content: "content",
  metadata: {},
});

describe("IngestionOrchestrator", () => {
  const createGraphOptions = (enabled: boolean): GraphStoreRuntimeOptions => ({
    enabled,
    includedTagPrefixes: [],
    indexAllTags: true,
    includeWikiLinks: true,
    includeEmbeds: true,
  });

  const connection: GraphStoreConnectionConfig = {
    uri: "bolt://localhost:7687",
    username: "neo4j",
    password: "password",
  };

  const createNote = (noteId: string): GraphIndexedNote => ({
    noteId,
    notePath: `${noteId}.md`,
    tags: [],
    wikiLinkTargets: [],
    embedTargets: [],
    updatedAt: Date.now(),
  });

  const createPayload = (noteId: string): IngestionPayload => ({
    denseChunks: [createDenseChunk(noteId)],
    note: createNote(noteId),
  });

  const createDenseWriter = () => {
    const writer: DenseVectorWriter = {
      upsertChunks: jest.fn(),
      removeNote: jest.fn(),
    };
    return writer;
  };

  const createGraphStore = () =>
    ({
      initialize: jest.fn().mockResolvedValue(undefined),
      upsertNote: jest.fn().mockResolvedValue(undefined),
      removeNote: jest.fn().mockResolvedValue(undefined),
      shutdown: jest.fn().mockResolvedValue(undefined),
    }) as unknown as Neo4jGraphStore;

  it("ingests dense chunks then graph metadata when enabled", async () => {
    const denseWriter = createDenseWriter();
    const graphStore = createGraphStore();

    const orchestrator = new IngestionOrchestrator(
      denseWriter,
      graphStore,
      () => connection,
      () => createGraphOptions(true)
    );

    const payload = createPayload("note-1");
    await orchestrator.ingest(payload);

    expect(denseWriter.upsertChunks).toHaveBeenCalledWith(payload.denseChunks);
    expect((denseWriter.upsertChunks as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      (graphStore.upsertNote as jest.Mock).mock.invocationCallOrder[0]
    );
    expect(graphStore.initialize).toHaveBeenCalledTimes(1);
    expect(graphStore.upsertNote).toHaveBeenCalledWith(payload.note, createGraphOptions(true));
  });

  it("skips graph initialization when disabled", async () => {
    const denseWriter = createDenseWriter();
    const graphStore = createGraphStore();

    const orchestrator = new IngestionOrchestrator(
      denseWriter,
      graphStore,
      () => connection,
      () => createGraphOptions(false)
    );

    const payload = createPayload("note-1");
    await orchestrator.ingest(payload);

    expect(graphStore.initialize).not.toHaveBeenCalled();
    expect(graphStore.upsertNote).toHaveBeenCalledWith(payload.note, createGraphOptions(false));
  });

  it("removes note from both stores when enabled", async () => {
    const denseWriter = createDenseWriter();
    const graphStore = createGraphStore();

    const orchestrator = new IngestionOrchestrator(
      denseWriter,
      graphStore,
      () => connection,
      () => createGraphOptions(true)
    );

    await orchestrator.removeNote("note-1");

    expect(denseWriter.removeNote).toHaveBeenCalledWith("note-1");
    expect(graphStore.initialize).toHaveBeenCalled();
    expect(graphStore.removeNote).toHaveBeenCalledWith("note-1");
  });

  it("skips graph removal when disabled", async () => {
    const denseWriter = createDenseWriter();
    const graphStore = createGraphStore();

    const orchestrator = new IngestionOrchestrator(
      denseWriter,
      graphStore,
      () => connection,
      () => createGraphOptions(false)
    );

    await orchestrator.removeNote("note-1");

    expect(graphStore.initialize).not.toHaveBeenCalled();
    expect(graphStore.removeNote).not.toHaveBeenCalled();
  });

  it("shuts down the graph store", async () => {
    const denseWriter = createDenseWriter();
    const graphStore = createGraphStore();

    const orchestrator = new IngestionOrchestrator(
      denseWriter,
      graphStore,
      () => connection,
      () => createGraphOptions(true)
    );

    await orchestrator.shutdown();

    expect(graphStore.shutdown).toHaveBeenCalled();
  });
});
