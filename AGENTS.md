# AGENTS.md — Tong Class Website

## Critical constraints

- **Do NOT modify `convex/`**. The backend is considered finished. Contact maintainers (@Prince-cjml, @PhotonYan) if a backend change is unavoidable.
- **Do NOT call Convex directly from components.** Always use the React hooks in `src/lib/api.ts`. These wrap `useQuery`/`useMutation` with proper types and argument normalization.
- **Convex `_generated/` is gitignored.** It must be regenerated after any Convex function changes via `npx convex codegen`. The `npm run build` script runs this automatically.

## Setup & dev commands (in order)

```bash
npm ci                          # NOT npm install
npx convex dev                  # separate terminal — local Convex backend at :3001
npm run dev                     # Next.js dev server at :3000
```

- Node >= 24.14.0, npm >= 11.9.0 (see `engines` in package.json)
- For local Convex auth: choose **LOGIN WITHOUT EMAIL** when prompted.
- `npm run dev` runs `predev` first (clears `.next` cache via `scripts/clean-next-cache.mjs`).

## Lint, typecheck, build

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (`next` config), `--max-warnings=0` |
| `npm run build` | Runs `npx convex codegen` then `next build` |
| `npm run start` | Production server (after build) |

- TypeScript errors are **ignored in production builds** (`next.config.js: ignoreBuildErrors: true`). Lint is the primary quality gate.
- There are **no tests** in this repo.

## Architecture

```
convex/          — Backend (schema, queries, mutations). READ-ONLY for frontend.
src/app/         — Next.js App Router pages & layouts
src/components/  — Shared UI components
  ui/            — shadcn/ui primitives (scaffold with `npx shadcn-ui@latest add`)
  layout/        — AppShell, header, footer
  auth/          — Login/register forms
src/lib/         — Client & server utilities
  api.ts         — **Canonical Convex client hooks** (use these, not raw Convex)
  convex.ts       — ConvexReactClient initialization
  hooks/          — Feature-specific hooks (news, users, etc.)
  server/         — Next.js server-only: mailer, verification, Turnstile
src/styles/      — Design tokens (`design-system.ts`), global CSS
documents/api.md — Backend API reference (Convex functions, endpoints, env vars)
```

- Path alias: `@/*` → `./src/*` (configured in `tsconfig.json`)
- Next.js `output: 'standalone'` — used for Docker builds.

## Design & styling conventions

- **Tailwind CSS + shadcn/ui**. Colors use HSL CSS variables (e.g. `hsl(var(--primary))`), defined in `src/styles/globals.css`.
- Design tokens live in `src/styles/design-system.ts` and as CSS custom properties.
- Fonts: `Inter` (body sans), `Playfair Display` (headings serif), `JetBrains Mono` (code).
- Dark mode: `next-themes` with `class` strategy.
- Icons: `lucide-react` (already in dependencies).
- Math rendering: MathJax CDN (configured in root layout).

## CI/CD

- Workflow: `.github/workflows/ci-cd.yml`
- Runs on push/PR to `main` and `develop`.
- Steps: lint & build → Docker image (push to ghcr.io) → deploy to production (main only, via SSH).

## Shadcn/ui scaffolding

```bash
npx shadcn-ui@latest add <component>
```

Components land in `src/components/ui/`. They already use the project's CSS variable color system.
