import type { MetadataRoute } from 'next'
import { curated, entries, entryHref } from '@/lib/data'

const BASE = 'https://awesome-jev.xyz'

// Static export: this renders once at build time to out/sitemap.xml.
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const generated = new Date(curated.generated_at)
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: generated, changeFrequency: 'daily', priority: 1 },
    {
      url: `${BASE}/how-it-works/`,
      lastModified: generated,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    { url: `${BASE}/review/`, lastModified: generated, changeFrequency: 'daily', priority: 0.4 },
  ]
  // Excluded repositories keep a page but are noindex; leave them out here too.
  const repos: MetadataRoute.Sitemap = entries
    .filter(e => e.status !== 'excluded')
    .map(e => ({
      url: `${BASE}${entryHref(e.repo)}/`,
      lastModified: new Date(e.pushed),
      changeFrequency: 'weekly',
      priority: e.status === 'listed' ? 0.6 : 0.3,
    }))
  return [...pages, ...repos]
}
