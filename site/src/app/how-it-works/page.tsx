import type { Metadata } from 'next'
import {
  calibration,
  categoryLabel,
  curated,
  entryHref,
  ISSUE_TEMPLATE_URL,
  REPO_URL,
} from '@/lib/data'
import { flattenObject, formatDateTime, num, pct } from '@/lib/format'
import { openGraph } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'How it works',
  description: 'The five-stage pipeline behind Awesome Jev, its policy, and its calibration.',
  alternates: { canonical: '/how-it-works/' },
  openGraph: openGraph({ url: '/how-it-works/' }),
}

const STEPS = [
  {
    name: 'Discover',
    body: 'Candidates come from the GitHub API: code and repository search for Jev and TypeSafe System One, plus the repositories other Jev lists already link to. Forks are dropped. Everything is appended to a candidate file, so discovery is repeatable and auditable.',
  },
  {
    name: 'Enrich',
    body: 'For each candidate the pipeline pulls the material a judgment needs: README excerpt, package manifests, declared dependencies, and repository metadata. Results are cached per repository so a rerun does not re-fetch what has not changed.',
  },
  {
    name: 'Judge',
    body: 'One Jev call per repository answers the whole question set at once: is this genuinely about Jev, does it use Jev at runtime, is it a meta list, is it a reimplementation, which category and decision pattern, and how substantial, documented, and novel it is. Raw judgments are immutable and append-only, tagged with model id and question set.',
  },
  {
    name: 'Curate',
    body: 'Policy lives in code, not in the model. Thresholds turn probabilities into listed, review, or excluded; weights turn the 0-3 scales into a composite score. Changing a threshold regenerates the index without re-running inference.',
  },
  {
    name: 'Publish',
    body: 'The curated file is the single source for both the README and this site. The site is a static export with no server logic and no API keys: every number you see here was computed at build time.',
  },
]

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-[13px]">
        <thead>
          <tr className="border-line border-b text-left text-muted">
            {head.map(cell => (
              <th key={cell} className="py-1.5 pr-4 font-medium">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={String(row[0])} className="border-line border-b last:border-b-0">
              {row.map((cell, index) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: column position is the identity here
                  key={index}
                  className={
                    index === 0 ? 'py-1.5 pr-4 font-mono' : 'py-1.5 pr-4 font-mono tabular-nums'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t py-6">
      <h2 className="cap mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function HowItWorksPage() {
  const policyRows = flattenObject(curated.policy).map(row => [row.key, row.value])

  return (
    <div className="py-8">
      <h1 className="font-semibold text-[28px] leading-9 tracking-[-0.02em]">How it works</h1>
      <p className="mt-2 max-w-2xl text-body">
        Awesome Jev is a list that judges itself. Five stages run end to end; the only place a model
        is called is stage three, and the only place a human decides anything is an override with a
        written reason.
      </p>

      <Section title="Pipeline">
        <img
          src="/pipeline.png"
          alt="Data-flow diagram: GitHub search and community lists feed candidates into pipeline code, Jev judges each repository in one call, code applies the policy with human overrides, and the README and site are published daily."
          width={1456}
          height={872}
          className="mb-6 w-full max-w-3xl rounded border border-line"
        />
        <ol className="flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step.name} className="flex gap-4">
              <span className="w-6 shrink-0 font-mono text-[13px] text-muted tabular-nums">
                {index + 1}
              </span>
              <div>
                <h3 className="font-medium">{step.name}</h3>
                <p className="mt-1 max-w-2xl text-[14px] text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Policy in force">
        <p className="mb-4 max-w-2xl text-[14px] text-muted">
          These are the exact values applied to the current index, read straight from the curated
          data generated {formatDateTime(curated.generated_at)}.
        </p>
        <Table head={['Key', 'Value']} rows={policyRows} />
      </Section>

      <Section title="Calibration">
        {calibration ? (
          <>
            <p className="mb-4 max-w-2xl text-[14px] text-muted">
              A hand-labelled gold set is the test suite for the judgments. The sweep below moves
              the genuine-probability gate and reports how the resulting listing decision compares
              to the human labels on {calibration.n} repositories, question set {calibration.qset}.
            </p>
            <Table
              head={['Threshold', 'TP', 'FP', 'FN', 'TN', 'Precision', 'Recall', 'F1']}
              rows={calibration.gate_sweep.map(row => [
                num(row.thr, 2),
                row.TP,
                row.FP,
                row.FN,
                row.TN,
                num(row.prec, 3),
                num(row.rec, 3),
                num(row.f1, 3),
              ])}
            />
            <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-[13px]">
              <div>
                <dt className="text-muted">Category agreement</dt>
                <dd className="font-mono tabular-nums">
                  {calibration.category_agreement === null
                    ? '—'
                    : pct(calibration.category_agreement, 1)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Gold set size</dt>
                <dd className="font-mono tabular-nums">{calibration.n}</dd>
              </div>
              <div>
                <dt className="text-muted">Question set</dt>
                <dd className="font-mono">{calibration.qset}</dd>
              </div>
              {calibration.computed_at ? (
                <div>
                  <dt className="text-muted">Computed</dt>
                  <dd className="font-mono">{formatDateTime(calibration.computed_at)}</dd>
                </div>
              ) : null}
            </dl>
          </>
        ) : (
          <p className="text-[14px] text-muted">
            No calibration run has been published yet. Once a gold set is scored, the gate sweep and
            category agreement appear here.
          </p>
        )}
      </Section>

      <Section title="Calibration report">
        {calibration ? (
          <div className="max-w-2xl space-y-8 text-[14px]">
            <div className="space-y-3">
              <p>
                The gold set is {calibration.n} repositories labelled by hand from README, manifests
                and code-search evidence: a first pass by an assistant, every label reviewed by the
                maintainer. It was sampled in strata so the interesting cases are over-represented:
                noise that keyword search drags in, repositories Jev scored near the gate, and
                genuine projects spread across category, stars and language. Two fields are labelled
                separately on purpose: <em>genuine</em> asks whether the repository is about Jev at
                all, <em>substance</em> how real it is. A one-line scaffold with a TypeSafe
                dependency is genuine and empty.
              </p>
              <p>
                The full write-up, including every gate disagreement and what each one says about
                the evidence or the question set, is in{' '}
                <a
                  href={`${REPO_URL}/blob/main/docs/calibration.md`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent hover:underline"
                >
                  docs/calibration.md
                </a>
                .
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Threshold</h3>
              <p>
                The listed gate is genuine ≥ {num(calibration.gate_listed_min ?? 0.6, 1)} with a
                substance floor beside it, and those two are the whole gate. The sweep above
                over-states the miss rate: repositories near the gate were deliberately
                over-sampled.
              </p>
              <p>
                Two repositories a human called noise now score above the gate — one whose entire
                content is a 117-character README, one with no files at all — so precision on the
                gold set reads 0.97 where an earlier run read 1.00. Both are empty repositories that
                the substance floor exists to hold back and no longer does; that is a problem with
                the substance score, not with the gate, and moving the gate to cover for it would
                cost real projects. The working through is in docs/calibration.md §3.
              </p>
              <p>
                Category confidence used to be a third condition and is not one any more: it answers
                which shelf an entry belongs on, not whether it belongs on any, and the two are
                independent enough that a personal blog with no Jev in it scores 0.96. A repository
                Jev is sure about is now listed with its category marked uncertain rather than held
                back.
              </p>
            </div>

            {calibration.category ? (
              <div className="space-y-3">
                <h3 className="font-medium">Category</h3>
                <p>
                  Jev and the human label agree on{' '}
                  {calibration.category.agreement !== null
                    ? pct(calibration.category.agreement, 0)
                    : '—'}{' '}
                  of {calibration.category.n} categorised repositories. Where they disagree:
                </p>
                <Table
                  head={['Human', 'Jev', 'Count']}
                  rows={calibration.category.confusion
                    .filter(c => c.human !== c.jev)
                    .map(c => [categoryLabel(c.human), categoryLabel(c.jev), c.count])}
                />
                <p className="text-muted">
                  Three quarters of judgments come back at 0.9 or above and every one of those is
                  right; below that the cells are small and the curve is not monotonic. The
                  uncertainty threshold reads this: under it the category is shown with a question
                  mark instead of stated plainly. Listing is unaffected either way.
                </p>
                <Table
                  head={['Confidence', 'n', 'Accuracy']}
                  rows={calibration.category.reliability.map(r => [
                    `${num(r.lo, 1)} – ${num(r.hi, 1)}`,
                    r.n,
                    pct(r.acc, 0),
                  ])}
                />
              </div>
            ) : null}

            {calibration.substance ? (
              <div className="space-y-3">
                <h3 className="font-medium">Substance</h3>
                <p>
                  Jev's 0–3 substance score against the human one: Spearman{' '}
                  {num(calibration.substance.spearman, 2)}, mean absolute error{' '}
                  {num(calibration.substance.mae, 2)} (n={calibration.substance.n}). Good enough to
                  rank within a category, not to be read as a grade.
                </p>
              </div>
            ) : null}

            {calibration.disagreements?.length ? (
              <div className="space-y-3">
                <h3 className="font-medium">Where Jev and the humans disagree on the gate</h3>
                <p className="text-muted">
                  Every disagreement at the current gate. Most are repositories whose README says
                  nothing about Jev while the code uses it; README-only evidence cannot see those.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[32rem] border-collapse text-[13px]">
                    <thead>
                      <tr className="border-line border-b text-left text-muted">
                        <th className="py-1.5 pr-4 font-medium">Repository</th>
                        <th className="py-1.5 pr-4 font-medium">Jev</th>
                        <th className="py-1.5 pr-4 font-medium">Human</th>
                        <th className="py-1.5 pr-4 font-medium">Why</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calibration.disagreements.map(d => (
                        <tr key={d.repo} className="border-line border-b last:border-b-0 align-top">
                          <td className="py-1.5 pr-4 font-mono">
                            <a href={entryHref(d.repo)} className="text-accent hover:underline">
                              {d.repo}
                            </a>
                          </td>
                          <td className="py-1.5 pr-4 font-mono tabular-nums">{num(d.jev, 2)}</td>
                          <td className="py-1.5 pr-4 font-mono">{d.human ? 'genuine' : 'noise'}</td>
                          <td className="py-1.5 pr-4 text-muted">{d.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {calibration.qset_diff ? (
              <div className="space-y-3">
                <h3 className="font-medium">
                  Question set {calibration.qset_diff.prev} → {calibration.qset}
                </h3>
                <p className="text-muted">
                  Measured on the {calibration.qset_diff.n} gold repositories judged under both
                  sets. {calibration.qset} removed the "official" category (now an owner flag in
                  code) and rewrote the gate question to name what counts: uses, wraps, evaluates or
                  reimplements Jev.
                </p>
                <Table
                  head={['Metric', calibration.qset_diff.prev, calibration.qset]}
                  rows={calibration.qset_diff.rows.map(r => [
                    r.metric,
                    r.prev === null ? '—' : num(r.prev, 2),
                    r.current === null ? '—' : num(r.current, 2),
                  ])}
                />
              </div>
            ) : null}

            {calibration.cost ? (
              <div className="space-y-3">
                <h3 className="font-medium">Cost and latency</h3>
                <dl className="flex flex-wrap gap-x-10 gap-y-2 text-[13px]">
                  <div>
                    <dt className="text-muted">Calls stored</dt>
                    <dd className="font-mono tabular-nums">{calibration.cost.calls}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Input tokens per call</dt>
                    <dd className="font-mono tabular-nums">{calibration.cost.input_tokens_mean}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Latency p50 / p90</dt>
                    <dd className="font-mono tabular-nums">
                      {calibration.cost.latency_p50_ms ?? '—'} /{' '}
                      {calibration.cost.latency_p90_ms ?? '—'} ms
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">Estimated spend to date</dt>
                    <dd className="font-mono tabular-nums">
                      ${num(calibration.cost.usd_est, 2)} at ${calibration.cost.usd_per_1m_input}/1M
                      input
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-[14px] text-muted">
            The written report appears once a gold set is scored.
          </p>
        )}
      </Section>

      <Section title="Corrections">
        <p className="max-w-2xl text-[14px] text-muted">
          Judgments are wrong sometimes, and the wrong ones are the interesting ones. Open an issue
          with the{' '}
          <a
            href={ISSUE_TEMPLATE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            Jev got it wrong
          </a>{' '}
          template, or read the pipeline yourself in the{' '}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            repository
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
