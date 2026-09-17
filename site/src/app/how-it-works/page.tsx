import type { Metadata } from 'next'
import { calibration, curated, ISSUE_TEMPLATE_URL, REPO_URL } from '@/lib/data'
import { flattenObject, formatDateTime, num, pct } from '@/lib/format'

export const metadata: Metadata = {
  title: 'How it works',
  description: 'The five-stage pipeline behind Awesome Jev, its policy, and its calibration.',
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
      <h2 className="mb-4 font-medium text-[13px] text-muted uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}

export default function HowItWorksPage() {
  const policyRows = flattenObject(curated.policy).map(row => [row.key, row.value])

  return (
    <div className="py-8">
      <h1 className="font-semibold text-2xl tracking-tight">How it works</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Awesome Jev is a list that judges itself. Five stages run end to end; the only place a model
        is called is stage three, and the only place a human decides anything is an override with a
        written reason.
      </p>

      <Section title="Pipeline">
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
                <dd className="font-mono tabular-nums">{pct(calibration.category_agreement, 1)}</dd>
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
        <div className="rounded-md border border-line border-dashed p-6">
          <p className="font-mono text-[12px] text-muted uppercase tracking-wide">
            Placeholder — to be filled
          </p>
          <p className="mt-2 max-w-2xl text-[14px] text-muted">
            The written report goes here: how the gold set was labelled, where Jev and the human
            labels disagreed and why, which threshold was chosen and what it costs, and what the
            confusion cases say about the question set. Nothing below this line is generated from
            data.
          </p>
        </div>
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
