import type { ReactNode } from 'react'
import { categoryLabel } from '@/lib/data'

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'outline' | 'accent' | 'uncertain'
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-accent bg-accent-soft text-accent'
      : tone === 'uncertain'
        ? 'border-line-strong border-dashed bg-transparent text-body'
        : tone === 'outline'
          ? 'border-line bg-transparent text-body'
          : 'border-transparent bg-chip text-body'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] leading-4 ${toneClass}`}
    >
      {children}
    </span>
  )
}

/**
 * The assigned category. A dashed chip with a trailing question mark means Jev picked a
 * shelf without being confident about it — the same dashed-hairline idiom the review rows
 * use for "unsettled". It is not a gate: the entry is listed on genuine and substance
 * regardless, and the exact confidence is on the entry page.
 */
export function CategoryChip({ category, uncertain }: { category: string; uncertain: boolean }) {
  return (
    <Chip tone={uncertain ? 'uncertain' : 'outline'}>
      <span title={uncertain ? 'Jev was not confident which category fits' : undefined}>
        {categoryLabel(category)}
        {uncertain ? <span className="text-muted">?</span> : null}
      </span>
    </Chip>
  )
}
