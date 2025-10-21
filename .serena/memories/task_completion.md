# Task Completion Checklist

- Keep `TODO.md` as the session plan: document goal, completed/pending tasks, architecture decisions, and testing checklist; update it as work progresses.
- Before handing work over, run `npm run format && npm run lint`; add targeted `npm run test` or `npm run test:integration` (when credentials available) for new logic.
- Ensure architectural consistency: preserve repository → manager → UI state flow and project chat isolation.
- Use logging utilities (`logInfo/logWarn/logError`) if instrumentation is needed; avoid `console.log`.
- Do not modify AI/system prompts unless explicitly asked; maintain generalized solutions without hardcoding project-specific values.
- Never run `npm run dev`; coordinate with the user for dev builds.
