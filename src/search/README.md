# Search Vector Architecture Refactor Plan

## Objectives

- Consolidate search around two local vector stores orchestrated by LangChain: a Chroma dense store and a Neo4j-backed graph store.
- Support hybrid retrieval via Reciprocal Rank Fusion (RRF) with a default-on toggle that can fall back to pure Chroma when graph features are disabled.
- Remove all residual Orama dependencies and align ingestion/retrieval APIs with the broader chain factory.
- Keep the design flexible enough to introduce additional metadata signals without hardcoding vault-specific logic.

## Target Architecture Overview

1. **Document Ingestion Pipeline**

   - Uses existing file watchers to enqueue note updates into a LangChain `RunnableSequence` responsible for chunking, cleaning, and enrichment.
   - Normalizes note metadata (YAML frontmatter, tags, inferred properties) into a provider-agnostic `IndexedNote` shape. Multilevel tags such as `#economics/industrial-organization/cournot-competition` remain single canonical tags while also exposing helper metadata for their hierarchy when needed (e.g., for prefix filtering).
   - Extracts wiki-links, embeds, and block references to capture outbound relationships that power Zettelkasten-style traversal.
   - Emits batched operations to both the Chroma store and the Neo4j graph store in parallel.

2. **Chroma Vector Store**

   - Stores dense embeddings for note chunks using the currently selected embedding provider.
   - Retains metadata needed for re-ranking (note id, path, tags, timestamps).
   - Persists locally within the plugin directory; initialization rehydrates the index if present.

3. **Neo4j Graph Vector Store**

   - Builds a property graph where notes and tag paths are primary nodes, with optional helper nodes representing hierarchy segments purely for parent-child relationships (they are not treated as independent tags).
   - Adds `LINKS_TO`, `EMBEDS`, and `MENTIONS` edges to model wiki-links, embeds, and other cross-note references so Zettelkasten clusters surface naturally.
   - Implements a lean, tag-focused schema maintained in-house; frontmatter properties can be toggled in a later phase.
   - Powered by the `neo4j-driver` packaged with the plugin; runs against a local Neo4j instance started by the user or embedded (TBD).

4. **LangChain Hybrid Retriever**

   - Wraps a `Chroma.as_retriever()` instance and a custom `Neo4jGraphRetriever` inside a LangChain `EnsembleRetriever` using RRF.
   - Exposes a simplified `retrieveRelevantChunks(query, options)` API that downstream consumers call.
   - Honors user settings to disable the graph store and/or RRF, gracefully degrading to plain dense retrieval.

5. **Settings & UX**
   - New settings panel controls graph indexing (enable/disable), Neo4j connection details, and optional metadata inclusion.
   - Default configuration keeps graph indexing + RRF enabled to deliver best recall.
   - Provides reindex buttons for Chroma-only or hybrid rebuilds, along with status indicators for each store.

### Tag Settings & Suggestions

- Add a dedicated modal where users manage the list of tags included in graph indexing. The modal provides inline completion as users type paths (typing `#economics/` suggests known continuations such as `industrial-organization`, `econometrics`, etc.) while treating each full path as a single tag.
- Source suggestions from the vault's existing tag index plus recently indexed tag paths in the Chroma metadata. Suggestions respect hierarchy separators (`/`) and allow quick selection or creation of deeper levels.
- Persist the managed list to settings so ingestion can constrain graph creation to approved tags while keeping the option to include "all tags".
- Display preview chips of selected tags and allow quick removal; include validation for malformed tag paths.

### Link Awareness & Retrieval Boosting

- Extend ingestion to capture wiki-links, embeds, and block references via Obsidian's metadata cache, storing outbound link targets alongside tag metadata.
- Upsert `(:Note)-[:LINKS_TO]->(:Note)` edges (plus optional `EMBEDS` or `MENTIONS` when the source is an embed or block reference) so graph traversal can surface neighbourhood notes common in Zettelkasten workflows.
- Cache link-degree statistics (out-links, in-links, mutual links) in Chroma metadata to let the hybrid retriever bias toward highly connected atomic notes.
- Provide settings toggles for including wiki-links and embeds in the graph, along with depth limits for traversal-heavy features.

## Data Flow

```text
Filesystem events / manual reindex
             ↓
      Ingestion Orchestrator (LangChain RunnableSequence)
             ↓                 ↘ settings state
      ┌───────────────┬───────────────────────┐
      │                               │
ChromaVectorStoreWriter      Neo4jGraphStoreWriter
      │                               │
Dense embeddings              Tag + hierarchy graph
      └───────────────┬───────────────────────┘
                      ↓
            LangChain Hybrid Retriever (RRF)
                      ↓
          Downstream chat/search consumers
```

## Migration Strategy

1. **Dependency Cleanup**

   - Remove Orama-related code paths (`DBOperations`, `ChunkedStorage`, Orama helpers) once the new stores are stable.
   - Replace Orama-specific commands with Chroma/Neo4j management equivalents.

2. **New Modules**

   - Introduce `src/search/chromaStore.ts`, `src/search/neo4jGraphStore.ts`, and `src/search/hybridRetriever.ts` (retained name) to encapsulate store logic.
   - Create an `IngestionOrchestrator` responsible for chunk creation and metadata extraction, including tag-path decomposition utilities and link extraction shared with the settings suggestions pipeline.
   - Update `VectorStoreManager` (or successor) to manage initialization, toggles, and lifecycle hooks for both stores.

3. **Reindexing Path**

   - On first run after upgrade, prompt users to rebuild indexes; automatically clear obsolete Orama files.
   - Provide CLI/command palette entries for reindexing Chroma only or both stores.

4. **Backwards Compatibility**
   - Detect presence of existing Orama snapshots and mark them as deprecated with a warning, but do not attempt live migrations.
   - Ensure existing retrieval consumers can operate in Chroma-only or tag-only modes while graph + link indexing is initializing.
   - Persist user-managed tag preferences and link ingestion toggles even when Neo4j is disabled so toggling back on retains curation effort.

## Pending Decisions & Notes

- LlamaIndex is not on the path because it lacks first-class Neo4j support for our requirements; we will ship a simple, tag- and link-driven graph ingestion layer on top of the `neo4j-driver`.
- Initial launch focuses on tags, link relationships, and tag hierarchies for graph enrichment. Support for additional frontmatter fields will be exposed via settings after the initial release.
- Neo4j + RRF remains the default experience; users can disable the graph store, wiki-link ingestion, and fall back to dense-only retrieval if needed.
- No Orama dependencies remain after the migration; all new functionality is local-first and controlled through settings.

## Implementation Checklist (Draft)

- [ ] Abstract existing file watchers to feed the ingestion orchestrator.
- [ ] Implement metadata normalization shared between stores.
- [ ] Build Chroma adapter with persistence, GC, and settings-aware initialization.
- [ ] Build Neo4j graph writer, schema bootstrapper, and tests against a local driver instance.
- [ ] Implement hybrid retriever with RRF scoring, link-degree weighting, and configuration toggles.
- [ ] Update commands, settings UI, and docs to reflect the new architecture, link ingestion toggles, and rebuild paths.
