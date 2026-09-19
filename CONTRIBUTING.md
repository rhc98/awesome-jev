# Contributing

This list is generated. Jev judges every repository; code applies the policy; `README.md` and the site are built from `data/curated.json`. Please do not edit `README.md` by hand.

## Add a project

Open an issue with the [submit template](https://github.com/rhc98/awesome-jev/issues/new?template=submit.yml). You only need the GitHub URL. What happens then:

1. Within a minute, a bot checks the link and either rejects it with a reason or adds the repository to `data/submissions.yaml`, which discovery reads as a source. It rejects forks, archived repositories, repositories that do not exist or are private, links that are not repository URLs, and this list itself.
2. The next daily run, which starts at 06:00 UTC, enriches and judges it.
3. The bot posts the verdict on your issue and closes it.

The verdict is one of three outcomes. **Listed** puts it on the site. **Review** holds it in the review queue, on the site with its scores. **Excluded** means Jev did not find it to be about Jev at all. The verdict comment gives the scores and the thresholds either way.

Listed is not the same as being in this README. The README carries only the top entries by composite score in each category; the site carries everything that passes the gate. The verdict comment says which side of that line your repository fell on, and by how much.

Submitting is only worth it when discovery would otherwise miss the repository — no mention of Jev or TypeSafe in the README, description, or topics, and no dependency on an official SDK. Everything else is found automatically.

## Disagree with a judgment

Open an issue with the [Jev got it wrong template](https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml). A bot transcribes it into a **draft** pull request against `data/overrides.yaml` with the regenerated files, and a maintainer verifies the evidence before anything is merged. Nothing is applied automatically.

Overrides can change only the **status** and the **category** of an entry. The usage pattern and the individual substance, docs, and novelty scores come from Jev and are never edited, so an issue about those gets an explanation rather than a pull request, and stays open as input for the next revision of the question set.

You can also write the override by hand. Jev's answers are stored in `data/judgments.jsonl` and never edited. Human decisions go in `data/overrides.yaml`:

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

An override only takes effect for a repository that has already been judged. `data/overrides.yaml` is applied while walking the stored judgments, so an entry for an unjudged repository changes nothing. Submit it first.

## What the bots do

| You open | The bot does | You get an answer |
| --- | --- | --- |
| Submit a project | Validates the URL, seeds `data/submissions.yaml` | A verdict comment after the next daily run |
| Jev got it wrong | Drafts the `data/overrides.yaml` entry in a draft pull request | A comment linking the draft, for a maintainer to review |

Both are keyed off the `submission` and `judgment` labels the issue forms apply. Comments come from `github-actions[bot]`.

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
