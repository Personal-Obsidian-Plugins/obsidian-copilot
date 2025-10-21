# Development Session TODO

## Session Goal

Document the planned search refactor that introduces LangChain-orchestrated Chroma and Neo4j vector stores with RRF hybrid retrieval.

## Completed Tasks ✅

- [x] Rewrote `src/search/README.md` to outline the new dual-vector-store architecture and migration strategy.
- [x] Added settings scaffolding fields and canonical tag normalization utilities.
- [x] Scaffolded the Neo4j graph store orchestrator, settings hooks, and tag filtering helpers.
- [x] Documented Zettelkasten-aware link ingestion plans and ensured tag hierarchy notes reflect single-tag semantics.
- [x] Drafted graph settings modal requirements and tag suggestion UX flows.
- [x] Defined link ingestion toggles for wiki-links, embeds, and traversal depth.
- [x] Built user-facing Neo4j connection settings with inline Desktop health checks.
- [x] Implemented the Neo4j graph ingestion writer with Cypher upserts and unit coverage.
- [x] Added an ingestion orchestrator that coordinates dense and graph stores behind settings gates.

## Pending Tasks 📋

- [x] Define Neo4j connection settings + health checks assuming the user runs a local Desktop-managed instance.
- [x] Implement the lean Neo4j graph ingestion layer (tag + link Cypher mutations, tests) using the `neo4j-driver`.
- [x] Update the ingestion orchestrator to emit coordinated Chroma + Neo4j operations behind shared toggles.
- [ ] Add rebuild commands and settings flows that synchronize both stores and fallback paths.
- [x] Document operational guidance and failure handling for user-managed Neo4j deployments.

## Architecture Summary

- Search will reindex notes into both Chroma (dense embeddings) and Neo4j (tag/tag-hierarchy graph) via a shared LangChain ingestion orchestrator.
- Hybrid retrieval will default to RRF fusion between the two stores, with user toggles to disable the graph layer or revert to Chroma-only mode.
- Tag management settings will provide inline completion sourced from the vault tag index, enabling quick curation of hierarchy prefixes.

## Execution Plan

1. ✅ Finalize Neo4j configuration UX so the plugin validates Desktop-hosted instances and surfaces actionable errors when the graph is offline.
2. ✅ Build the graph ingestion writer with batch-friendly Cypher helpers for tags, tag hierarchies, and link edges, plus Jest coverage using the `neo4j-driver` test harness.
3. ✅ Wire the indexing pipeline so dense + graph writes stay in lockstep (temporary integration lives in `IndexOperations` pending orchestrator swap).
4. Add rebuild commands and fallback flows that synchronize hybrid and dense-only indexes while keeping user messaging clear.

## Testing Checklist

- [ ] Peer review the updated documentation and assumptions with the core search maintainers.
- [x] Add Jest coverage for Neo4j ingestion helpers (tag + link Cypher operations).
- [ ] Verify hybrid retrieval happy path against a locally running Neo4j Desktop instance and existing Chroma index.
