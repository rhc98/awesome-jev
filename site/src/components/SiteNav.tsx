import Link from 'next/link'
import { curated, REPO_URL } from '@/lib/data'

const LINKS = [
  { href: '/', label: 'Index' },
  { href: '/review', label: 'Review queue' },
  { href: '/how-it-works', label: 'How it works' },
]

export function SiteNav() {
  const reviewCount = curated.stats.review

  return (
    <header className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 border-line border-b py-3">
      <Link
        href="/"
        className="font-semibold text-[18px] text-fg tracking-[-0.01em] hover:text-accent"
      >
        Awesome Jev
      </Link>
      <nav className="flex items-center gap-4 text-[13px] text-muted">
        {LINKS.map(link => (
          <Link key={link.href} href={link.href} className="hover:text-fg">
            {link.label}
            {link.href === '/review' && reviewCount > 0 ? (
              <span className="ml-1 font-mono text-[12px] text-faint">{reviewCount}</span>
            ) : null}
          </Link>
        ))}
        <a href={REPO_URL} className="hover:text-fg" target="_blank" rel="noreferrer noopener">
          GitHub
        </a>
      </nav>
    </header>
  )
}
