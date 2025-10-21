# Copilot for Obsidian Overview

- **Purpose**: Obsidian plugin that delivers an AI copilot inside the vault, providing chat, autocomplete, semantic search, and agent workflows while letting users choose their own LLM providers and keep data local.
- **Tech stack**: TypeScript-based Obsidian plugin with React UI components (Radix + Tailwind), LangChain integrations for providers/tools, Jest for tests, Tailwind for styling, esbuild + Tailwind build pipeline.
- **Core architecture**: Clean layering from repositories and managers (e.g., MessageRepository, ChatManager, ContextManager) through UI state (ChatUIState) into React components, with chain factory abstractions, vector search, and provider integrations. Memory, caching, and streaming helpers live in `src/core`, `src/search`, `src/memory`, etc.
- **Key directories**: `src/LLMProviders` (provider integrations), `src/core` (repositories/managers), `src/state` (UI state), `src/components` (React UI), `src/search` (vector store + search), `src/commands` (Obsidian commands), `src/hooks`, `src/utils`, `docs/` (architecture notes), `scripts/` (build/version utilities).
- **Notable constraints**: Do not modify AI prompt content unless asked. Avoid hardcoding project-specific lists/patterns—prefer configurable, general solutions. Never run the `npm run dev` script; user handles dev builds manually.
