# Repository Guidelines

## Project Structure & Module Organization
- `src/`: application code.
  - `components/` (UI and settings), `screens/` (route views), `contexts/` (auth, data, theme), `hooks/`, `lib/`, `data/`, `index.css`, `main.jsx`, `App.jsx`.
- `plugins/visual-editor/`: dev‑only Vite helpers for inline editing.
- `tools/generate-llms.js`: utility script.
- Root configs: `vite.config.js` (alias `@` → `src`), `tailwind.config.js`, `postcss.config.js`, `index.html`, `package.json`.

## Build, Test, and Development Commands
- Install: `npm install` — installs dependencies.
- Develop: `npm run dev` — starts Vite dev server.
- Build: `npm run build` — creates production bundle.
- Preview: `npm run preview` — serves built app.
- Lint (no script): `npx eslint src` — run ESLint on sources.

## Coding Style & Naming Conventions
- JavaScript/JSX, 2‑space indentation, semicolons, single quotes.
- Components: PascalCase `.jsx` in `src/components` or `src/screens`.
- Hooks: `useX` names in `src/hooks` (e.g., `useLocalStorage`).
- Imports: prefer alias `@` (e.g., `import Button from '@/components/ui/button.jsx'`).
- Styling: Tailwind utility classes; keep styles colocated with components.

## Testing Guidelines
- No tests configured yet. When adding tests: colocate as `ComponentName.test.jsx` or use `src/__tests__/`.
- Recommend Vitest + React Testing Library for component tests; unit‑test pure functions in `src/lib`.
- Keep tests fast and focused; mock network (axios) and `import.meta.env` as needed.
- Example script (if added): `"test": "vitest"` → run with `npm test`.

## Commit & Pull Request Guidelines
- Use descriptive commits; Conventional Commits are encouraged (`feat:`, `fix:`, `docs:`).
- PRs must include: purpose/summary, linked issue, screenshots for UI changes, test plan (steps to verify), and notes on env/config changes.

## Security & Configuration Tips
- Env vars: `VITE_API_BASE_URL`, `VITE_AUTH_DISABLED`. Create `.env.local` (git‑ignored):
  
  `VITE_API_BASE_URL=https://api.example.com/api`
  
  `VITE_AUTH_DISABLED=false`
- Do not commit secrets. Avoid editing Vite build settings in feature PRs unless required.
