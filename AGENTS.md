# Repository Guidelines

## Project Structure & Module Organization
- Root contains multiple Vite + React apps: `painel-admin/`, `painel-funcionario/`, `painel-login/`, `painel-medico/`, `painel-secretaria/`.
- Each app uses: `src/` (code), `public/` (static assets), `tools/` (build helpers), `plugins/` (Vite/Tailwind plugins), `index.html`, `vite.config.js`.
- Shared library lives at `painel-medico/packages/shared` (`@portal/shared`). Build it before apps that import it.
- Environment files per app: `.nvmrc` (Node 20.19.1), `.env` (local secrets). An example exists at `painel-medico/.env.example`.

## Build, Test, and Development Commands
- Install deps per app directory: `npm install`.
- Start dev server: `npm run dev` (Vite on localhost).
- Production build: `npm run build`. For doctors app: `npm run build:all` (builds `@portal/shared` then the app).
- Preview build locally: `npm run preview`.
- Lint/format (where available): `npm run lint`, `npm run format` (e.g., in `painel-funcionario`).
- Env check: `npm run lint:env` (available in medico, admin, funcionario, login, secretaria).

## Local Dev Setup
- Prereq: Node `20.19.1` (see `.nvmrc`). In each panel, run `npm install` once.
- Quick start: `bash scripts/dev.sh <admin|funcionario|login|medico|secretaria>` runs env check and starts Vite.
- `painel-medico`: `npm run build:shared` (or `npm -w @portal/shared run build`), then `npm run dev`. Copy `.env.example` → `.env`.
- `painel-admin`: `cp .env.example .env` and set `VITE_API_BASE_URL` + `VITE_PORTAL_*`; run `npm run dev`.
- `painel-funcionario`: `cp .env.example .env` and set `VITE_API_BASE_URL` + `VITE_PORTAL_*`; run `npm run dev`.
- `painel-login`: `cp .env.example .env` and set `VITE_API_BASE_URL` + `VITE_PORTAL_*`; run `npm run dev`.
- `painel-secretaria`: `cp .env.example .env` and set Supabase keys + `VITE_PORTAL_*`; run `npm run dev`.

## Per-Panel Notes
- `painel-medico`: Monorepo root for the shared lib. Prefer `npm run build:all`. Validate env with `npm run lint:env`; see `.env.example`.
- `painel-admin`: Uses `@portal/shared` via a file dependency. Ensure the shared package is built first; then `npm run build` or `npm run dev`.
- `painel-funcionario`: Has `lint`, `format`, and `lint:env`. Build tolerates LLM generation failure and proceeds.
- `painel-login`: Standard Vite app; run `npm run dev`, `npm run build`, `npm run preview`.
- `painel-admin`: Now includes `lint:env`; ensure `.env` has `VITE_API_BASE_URL`.
- `painel-login`: Includes `lint:env`; ensure `.env` has `VITE_API_BASE_URL`.
- `painel-secretaria`: Vite app scaffolded. Use `npm run lint:env` then `npm run dev`. Copy `.env.example` and set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Coding Style & Naming Conventions
- Language: React (JS/JSX); shared package uses TypeScript.
- Indentation: 2 spaces; max line length ~100–120 chars.
- Components: PascalCase files in `src/components/...` (e.g., `StageCard.jsx`). Utilities in `src/lib/`.
- Variables/functions: camelCase; constants UPPER_SNAKE_CASE.
- Linting: ESLint with `eslint-config-react-app`. Prefer Tailwind utility classes; keep class lists readable.

## Testing Guidelines
- No repository-wide test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Place tests near sources as `*.test.jsx` or under `src/__tests__/`.
- Keep tests fast and deterministic; avoid network calls—mock with test doubles.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject (e.g., `fix(auth): prevent token leak`). Group related changes.
- PRs: include summary, screenshots for UI, reproduction/verification steps, and reference issues.
- For shared library changes, run `npm -w @portal/shared run build` and update dependent apps if interfaces change.

## Security & Configuration Tips
- Never commit `.env`. Copy from `painel-medico/.env.example` and document new keys.
- Store API base URLs in config files, not components. Validate sensitive flows manually before merging.
- Portal URLs used by `@portal/shared`: set `VITE_PORTAL_LOGIN_URL`, `VITE_PORTAL_ADMIN_URL`, `VITE_PORTAL_MEDICO_URL`, `VITE_PORTAL_ORCAMENTO_URL`, `VITE_PORTAL_SECRETARIA_URL`, `VITE_PORTAL_BOT_URL` per panel.
