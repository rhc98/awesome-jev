import Link from 'next/link'
import { MiniMeter } from '@/components/Bars'
import { Chip } from '@/components/Chip'
import { categoryLabel, entryHref, githubUrl, patternLabel } from '@/lib/data'
import { compactNumber } from '@/lib/format'
import type { Entry } from '@/lib/types'

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-line bg-panel p-3.5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 font-medium leading-snug">
          <a
            href={githubUrl(entry.repo)}
            target="_blank"
            rel="noreferrer noopener"
            className="break-words hover:text-accent"
          >
            {entry.name}
          </a>
        </h3>
        <span className="shrink-0 font-mono text-[12px] text-muted tabular-nums">
          ★ {compactNumber(entry.stars)}
        </span>
      </div>

      <p className="text-[13px] text-muted leading-snug">
        {entry.description?.trim() || 'No description provided.'}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip tone="accent">{categoryLabel(entry.category)}</Chip>
        <Chip>{patternLabel(entry.pattern)}</Chip>
        {entry.language ? <Chip>{entry.language}</Chip> : null}
        {entry.readme_pick ? <Chip tone="accent">README pick</Chip> : null}
        {entry.status !== 'listed' ? <Chip>{entry.status}</Chip> : null}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-line border-t pt-2">
        <MiniMeter label="genuine" value={entry.jev.genuine} />
        <span className="font-mono text-[11px] text-muted tabular-nums">
          score {entry.jev.composite.toFixed(3)}
        </span>
        <Link href={entryHref(entry.repo)} className="text-[12px] text-accent hover:underline">
          Judgment
        </Link>
      </div>
    </article>
  )
}
