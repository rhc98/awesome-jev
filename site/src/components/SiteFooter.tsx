import { curated, ISSUE_TEMPLATE_URL, REPO_URL } from '@/lib/data'
import { formatDateTime } from '@/lib/format'

export function SiteFooter() {
  return (
    <footer className="border-line border-t py-6 text-[13px] text-muted">
      <p>
        An independent community project, not affiliated with TypeSafe AI. Jev and System One are
        TypeSafe AI product names.
      </p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span>Data generated {formatDateTime(curated.generated_at)}</span>
        <a href={REPO_URL} className="hover:text-accent" target="_blank" rel="noreferrer noopener">
          Source
        </a>
        <a
          href={ISSUE_TEMPLATE_URL}
          className="hover:text-accent"
          target="_blank"
          rel="noreferrer noopener"
        >
          Jev got it wrong
        </a>
      </p>
    </footer>
  )
}
