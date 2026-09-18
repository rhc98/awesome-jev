import type { Metadata } from 'next'
import { EntryRow } from '@/components/EntryRow'
import { curated, entries, ISSUE_TEMPLATE_URL } from '@/lib/data'
import { openGraph } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Review queue',
  description: 'Repositories Jev was not confident enough about to list or exclude.',
  alternates: { canonical: '/review/' },
  openGraph: openGraph({ url: '/review/' }),
}

export default function ReviewPage() {
  const queue = entries
    .filter(entry => entry.status === 'review')
    .sort((a, b) => b.jev.genuine - a.jev.genuine)

  return (
    <div className="py-8">
      <h1 className="font-semibold text-[28px] leading-9 tracking-[-0.02em]">Review queue</h1>
      <p className="mt-2 max-w-2xl text-body">
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

      <p className="num mt-6 font-mono text-[13px] text-muted">
        {queue.length} of {curated.stats.total} judged repositories are awaiting review.
      </p>

      {queue.length === 0 ? (
        <p className="mt-4 rounded-md border border-line border-dashed p-8 text-center text-[13px] text-muted">
          The queue is empty. Every judged repository cleared a gate.
        </p>
      ) : (
        <ul className="mt-4 border-line border-t">
          {queue.map(entry => (
            <EntryRow key={entry.repo} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  )
}
