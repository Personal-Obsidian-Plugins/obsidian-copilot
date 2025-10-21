# Useful Commands

- `npm run build` → Production build (Tailwind minify + esbuild bundle, runs TypeScript check).
- `npm run lint` / `npm run lint:fix` → ESLint check and auto-fix.
- `npm run format` / `npm run format:check` → Prettier formatting.
- `npm run test` → Run Jest unit tests (excludes `src/integration_tests`).
- `npm run test:integration` → Integration tests (requires API keys in `.env.test`).
- `npm test -- -t "pattern"` → Target a specific test.
- `npm run prompt:debug` → Print current prompt debug info.
- `npm run build:tailwind` and `npm run build:esbuild` → Individual build steps if needed.

**Important**: Never execute `npm run dev`; the user manages dev builds manually.
