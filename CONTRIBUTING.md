# Contributing

This list is generated. Jev judges every repository; code applies the policy; `README.md` and the site are built from `data/curated.json`. Please do not edit `README.md` by hand.

## Add a project

Open an issue with the [submit template](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml). You only need the GitHub URL. The daily pipeline discovers, enriches, and judges it. If it passes the gate it appears on the site the next day and in the README when it ranks inside its category.

You do not need to wait for the pipeline if the repository already mentions Jev or TypeSafe in its README, description, or topics, or depends on an official SDK. Discovery finds those on its own.

## Disagree with a judgment

Jev's answers are stored in `data/judgments.jsonl` and never edited. Human decisions go in `data/overrides.yaml`:

```yaml
owner/repo:
  status: listed          # listed | review | excluded
  category: integration   # optional
  reason: "README does not mention Jev, but src/eval.ts calls api.typesafe.ai"
  by: your-github-handle
```

Then run the policy locally and commit the regenerated files:

```bash
pnpm install
pnpm curate && pnpm readme
```

Open a pull request with the override and the regenerated `data/curated.json` and `README.md`. CI regenerates them and fails if the committed files differ. Community pull requests may touch only those three files; changes to `pipeline/`, `site/`, or `.github/` are maintainer-only and the PR scope check will fail otherwise. Open an issue instead if you want a code change. A reason is required; overrides are counted and reported on the calibration page as disagreements between Jev and humans.

## Inclusion criteria

Jev applies these; overrides should follow them too.

- The repository is public and substantively about Jev or TypeSafe's System One models: it calls the API, wraps or integrates it, evaluates it, or reimplements it.
- Generic type-safety libraries, keyword coincidences, and repositories that only mention Jev in passing are excluded.
- Forks and archived repositories are excluded at discovery.
- Other curated lists are welcome under Other Lists.

## Change the questions

`pipeline/questions.v2.ts` is the question set. Any change is a new version: bump `QSET`, re-judge everything with `pnpm judge --force`, run `pnpm calibrate` against `data/goldset.yaml`, and include the before and after metrics in the pull request.

## Run locally

```bash
pnpm install
export TYPESAFE_API_KEY=...    # console.typesafe.ai
gh auth login                  # or export GITHUB_TOKEN=...
pnpm discover --quick          # fast: skips code search and per-day windows
pnpm enrich --limit 30
pnpm judge --limit 30
pnpm curate && pnpm readme && pnpm inspect
```
