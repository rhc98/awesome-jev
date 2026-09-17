import type { Metadata } from 'next'
import Link from 'next/link'
import { MiniMeter } from '@/components/Bars'
import { Chip } from '@/components/Chip'
import {
  categoryLabel,
  curated,
  entries,
  entryHref,
  githubUrl,
  ISSUE_TEMPLATE_URL,
  patternLabel,
} from '@/lib/data'
import { compactNumber } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Review queue',
  description: 'Repositories Jev was not confident enough about to list or exclude.',
}

export default function ReviewPage() {
  const queue = entries
    .filter(entry => entry.status === 'review')
    .sort((a, b) => b.jev.genuine - a.jev.genuine)

  return (
    <div className="py-8">
      <h1 className="font-semibold text-2xl tracking-tight">Review queue</h1>
      <p className="mt-2 max-w-2xl text-muted">
        These repositories fell between the gates: Jev was confident enough not to drop them, but
        not confident enough to list them. The policy leaves them here rather than guessing. A human
        reading one repository for thirty seconds usually settles it.
      </p>
      <p className="mt-3 max-w-2xl text-muted">
        If you can tell which way a row should go — or if you spot a wrong call anywhere in the
        index — open an issue with the{' '}
        <a
          href={ISSUE_TEMPLATE_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent hover:underline"
        >
          Jev got it wrong
        </a>{' '}
        template. Corrections become overrides in the data, and overrides feed the calibration set.
      </p>

      <p className="mt-6 text-[13px] text-muted">
        {queue.length} of {curated.stats.total} judged repositories are awaiting review.
      </p>

      {queue.length === 0 ? (
        <p className="mt-4 rounded-md border border-line border-dashed p-8 text-center text-[13px] text-muted">
          The queue is empty. Every judged repository cleared a gate.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {queue.map(entry => (
            <li
              key={entry.repo}
              className="flex flex-col gap-2 rounded-md border border-line bg-panel p-3.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-medium">
                  <a
                    href={githubUrl(entry.repo)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-accent"
                  >
                    {entry.repo}
                  </a>
                </h2>
                <span className="font-mono text-[12px] text-muted tabular-nums">
                  ★ {compactNumber(entry.stars)}
                </span>
              </div>

              <p className="text-[13px] text-muted leading-snug">
                {entry.description?.trim() || 'No description provided.'}
              </p>

              <p className="font-mono text-[12px] text-muted">
                held because: {entry.status_reason}
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <Chip tone="accent">{categoryLabel(entry.category)}</Chip>
                <Chip>{patternLabel(entry.pattern)}</Chip>
                {entry.language ? <Chip>{entry.language}</Chip> : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-line border-t pt-2">
                <MiniMeter label="genuine" value={entry.jev.genuine} />
                <Link
                  href={entryHref(entry.repo)}
                  className="text-[12px] text-accent hover:underline"
                >
                  Full judgment
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
