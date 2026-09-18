import Link from 'next/link'
import { VerdictCell } from '@/components/Bars'
import { CategoryChip } from '@/components/Chip'
import { entryHref, githubUrl, splitRepo } from '@/lib/data'
import { compactNumber } from '@/lib/format'
import type { Entry } from '@/lib/types'

/** Optional grid view. Same content as EntryRow, in a white card. */
export function EntryCard({ entry }: { entry: Entry }) {
  const { owner } = splitRepo(entry.repo)
  const review = entry.status === 'review'
  const excluded = entry.status === 'excluded'
  const nameColor = excluded ? 'text-faint' : review ? 'text-muted' : 'text-fg'

  return (
    <article
      className={`flex flex-col gap-2 rounded-md border bg-panel p-4 transition-colors hover:border-line-strong ${
        review ? 'border-line border-dashed' : 'border-line'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`min-w-0 text-[16px] leading-6 font-semibold ${nameColor}`}>
          <Link href={entryHref(entry.repo)} className="break-words hover:text-accent">
            <span className="font-mono text-[12px] font-normal text-muted">{owner}/</span>
            {entry.name}
          </Link>
        </h3>
        <span className="num shrink-0 font-mono text-[12px] text-muted">
          ★ {compactNumber(entry.stars)}
        </span>
      </div>

      <p className={`line-clamp-3 text-[13px] leading-5 ${excluded ? 'text-faint' : 'text-body'}`}>
        {entry.description?.trim() || 'No description provided.'}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <CategoryChip category={entry.category} uncertain={entry.category_uncertain} />
        {entry.language ? (
          <span className="font-mono text-[12px] text-muted">{entry.language}</span>
        ) : null}
        {entry.readme_pick ? <span className="cap text-accent">readme pick</span> : null}
      </div>

      <div className="mt-auto flex flex-col gap-1.5 border-line border-t pt-2.5">
        {excluded ? (
          <span className="font-mono text-[12px] text-faint">excluded: {entry.status_reason}</span>
        ) : (
          <>
            <VerdictCell label="genuine" value={entry.jev.genuine} />
            <VerdictCell label="subst" value={entry.jev.substance} kind="scale" />
          </>
        )}
        {review ? (
          <span className="font-mono text-[12px] text-review">
            held because: {entry.status_reason}
          </span>
        ) : null}
        <span className="flex justify-between font-mono text-[11px] text-faint">
          <a
            href={githubUrl(entry.repo)}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-fg"
          >
            github ↗
          </a>
          <span className="num">score {entry.jev.composite.toFixed(3)}</span>
        </span>
      </div>
    </article>
  )
}
