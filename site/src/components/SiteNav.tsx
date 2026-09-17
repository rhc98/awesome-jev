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
    <header className="flex flex-wrap items-center justify-between gap-3 border-line border-b py-4">
      <Link href="/" className="font-semibold tracking-tight hover:text-accent">
        Awesome Jev
      </Link>
      <nav className="flex items-center gap-4 text-[13px] text-muted">
        {LINKS.map(link => (
          <Link key={link.href} href={link.href} className="hover:text-accent">
            {link.label}
            {link.href === '/review' && reviewCount > 0 ? (
              <span className="ml-1 text-muted/70">({reviewCount})</span>
            ) : null}
          </Link>
        ))}
        <a href={REPO_URL} className="hover:text-accent" target="_blank" rel="noreferrer noopener">
          GitHub
        </a>
      </nav>
    </header>
  )
}
