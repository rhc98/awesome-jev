import Link from 'next/link'
import { VerdictCell } from '@/components/Bars'
import { Chip } from '@/components/Chip'
import { categoryLabel, entryHref, githubUrl, splitRepo } from '@/lib/data'
import { compactNumber } from '@/lib/format'
import type { Entry } from '@/lib/types'

/** One repository per hairline row. Status is typographic: ink, muted + dashed, faint. */
export function EntryRow({ entry }: { entry: Entry }) {
  const { owner } = splitRepo(entry.repo)
  const review = entry.status === 'review'
  const excluded = entry.status === 'excluded'
  const nameColor = excluded ? 'text-faint' : review ? 'text-muted' : 'text-fg'
  const bodyColor = excluded ? 'text-faint' : 'text-body'

  return (
    <li
      className={`group border-line border-b py-3.5 transition-colors hover:border-line-strong ${
        review ? 'border-dashed' : ''
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className={`min-w-0 text-[18px] leading-[26px] font-semibold ${nameColor}`}>
          <Link href={entryHref(entry.repo)} className="hover:text-accent">
            <span className="font-mono text-[13px] font-normal text-muted">{owner}/</span>
            {entry.name}
          </Link>
        </h3>
        <span className="flex shrink-0 items-baseline gap-3 font-mono text-[13px] text-muted">
          <span className="num">★ {compactNumber(entry.stars)}</span>
          <a
            href={githubUrl(entry.repo)}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden text-faint hover:text-fg sm:inline"
          >
            github ↗
          </a>
        </span>
      </div>

      <p className={`mt-0.5 line-clamp-2 text-[13px] leading-5 ${bodyColor}`}>
        {entry.description?.trim() || 'No description provided.'}
      </p>

      {excluded ? null : (
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
          <VerdictCell label="genuine" value={entry.jev.genuine} />
          <VerdictCell label="cat" value={entry.jev.category_conf} kind="category" />
          <VerdictCell label="subst" value={entry.jev.substance} kind="scale" />
          <span className="flex items-center gap-2.5">
            <Chip tone="outline">{categoryLabel(entry.category)}</Chip>
            {entry.language ? (
              <span className="font-mono text-[12px] text-muted">{entry.language}</span>
            ) : null}
            {entry.readme_pick ? <span className="cap text-accent">readme pick</span> : null}
          </span>
        </div>
      )}

      {review ? (
        <p className="mt-1.5 font-mono text-[12px] text-review">
          held because: {entry.status_reason}
        </p>
      ) : null}
      {excluded ? (
        <p className="mt-1.5 font-mono text-[12px] text-faint">excluded: {entry.status_reason}</p>
      ) : null}
    </li>
  )
}
