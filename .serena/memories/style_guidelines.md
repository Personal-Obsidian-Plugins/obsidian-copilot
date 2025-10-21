# Style & Conventions

- TypeScript in strict mode; prefer type inference, `interface` for object shapes, `type` for unions; absolute imports via `@/` prefix.
- React code uses functional components with props interfaces declared above; leverage custom hooks; use Tailwind (with CVA) rather than inline styles.
- Always add succinct JSDoc for every function/method. Keep solutions generalized; avoid hardcoded folder names, stopword lists, or scenario-specific logic.
- Maintain clean architecture layering: Repository → Manager → UIState → UI. MessageRepository is the single source of truth; ensure project chat isolation.
- Logging via `logInfo/logWarn/logError` from `@/logger`; never use `console.log`.
- Default to ASCII for new edits; only add comments when needed for complex logic.
- Respect Obsidian context: global `app` is available; prompts and system prompt files should not be edited unless explicitly instructed.
