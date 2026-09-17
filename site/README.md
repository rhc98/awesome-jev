# Awesome Jev — site

The static read layer over `data/curated.json`. No server logic, no API keys: every number is
computed at build time and shipped as HTML.

This is a **separate package** from the pipeline at the repository root. Install and build from
inside `site/`.

## Stack

- Next.js 15 (App Router) with `output: 'export'` — a fully static build
- TypeScript, Tailwind CSS v4
- Client-side filtering only; filter state lives in URL search params so views are shareable
- No UI kit, no runtime data fetching

## Data

`scripts/sync-data.mjs` copies `../data/curated.json` and `../data/calibration.json` into
`src/generated/` before every dev and build run, so application code only ever imports from inside
`site/`. The copies are gitignored. `pnpm dev` and `pnpm build` run the script for you; run
`pnpm sync-data` by hand if you regenerate the pipeline output while a dev server is up.

If `data/calibration.json` is absent the script writes `null`, and the calibration tables on
`/how-it-works` degrade to a short "not published yet" note.

`data/curated.json` must exist before building — generate it at the repository root with
`pnpm curate`.

## Run

```bash
cd site
pnpm install
pnpm dev        # http://localhost:3000
```

## Build

```bash
cd site
pnpm build      # static export lands in site/out/
```

Serve the output with any static file server, for example `npx serve out`.

## Lint and format

Biome, with the same rules as the repository root (single quotes, semicolons as needed, line width
100):

```bash
cd site
pnpm lint       # biome check .
pnpm format     # biome check --write .
```

## Deploy (Vercel)

| Setting            | Value                             |
| ------------------ | --------------------------------- |
| Framework preset   | Next.js                           |
| Root directory     | `site`                            |
| Install command    | `pnpm install` (default)          |
| Build command      | `pnpm build` (default)            |
| Output directory   | default (Next.js export detected) |
| Node.js version    | 24.x                              |

Leave "Include files outside the root directory in the Build Step" enabled — the build reads
`../data/` during `sync-data`.

The domain is `awesome-jev.xyz`. Republishing is just a rebuild: the pipeline commits a new
`data/curated.json`, and the deploy picks it up.

## Pages

| Route                | Contents                                                                        |
| -------------------- | ------------------------------------------------------------------------------- |
| `/`                  | Stats strip, card grid, search + category/pattern/language/status/sort controls   |
| `/r/[owner]/[name]`  | Full judgment for one repository, statically generated for every curated entry    |
| `/review`            | The review queue, sorted by `jev.genuine` descending, with correction links       |
| `/how-it-works`      | Five-stage pipeline, the live policy table, calibration sweep, report placeholder |
