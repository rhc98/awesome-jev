import { execSync } from 'node:child_process'

const API = 'https://api.github.com'

function token(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    throw new Error('No GITHUB_TOKEN and `gh auth token` failed')
  }
}
const TOKEN = token()

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export type GhOpts = { accept?: string; raw?: boolean; allow404?: boolean }

/** GET with rate-limit aware retry. Returns parsed JSON (or text when raw). */
export async function gh<T = any>(
  path: string,
  params: Record<string, string | number> = {},
  opts: GhOpts = {},
): Promise<T | null> {
  const url = new URL(path.startsWith('http') ? path : API + path)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: opts.accept ?? 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'awesome-jev-pipeline',
      },
    })
    if ((res.status === 404 || res.status === 409 || res.status === 422) && opts.allow404)
      return null
    if (res.status === 403 || res.status === 429) {
      const reset = Number(res.headers.get('x-ratelimit-reset') ?? 0) * 1000
      const retryAfter = Number(res.headers.get('retry-after') ?? 0) * 1000
      const wait = Math.max(retryAfter, reset ? reset - Date.now() + 1000 : 0, 15000)
      console.error(`  rate limited on ${url.pathname}, waiting ${Math.round(wait / 1000)}s`)
      await sleep(Math.min(wait, 90000))
      continue
    }
    if (res.status >= 500) {
      await sleep(2000 * (attempt + 1))
      continue
    }
    if (!res.ok) throw new Error(`GitHub ${res.status} ${url}: ${(await res.text()).slice(0, 200)}`)
    return (opts.raw ? await res.text() : await res.json()) as T
  }
  throw new Error(`GitHub retries exhausted: ${url}`)
}

export type RepoLite = {
  full_name: string
  description: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  pushed_at: string
  fork: boolean
  archived: boolean
  homepage: string | null
  owner: { login: string; type: string }
  license: { spdx_id: string } | null
}

/** Repo search, paginated up to `maxPages` (100/page, API caps at 1000 results). */
export async function searchRepos(q: string, maxPages = 10): Promise<RepoLite[]> {
  const out: RepoLite[] = []
  for (let page = 1; page <= maxPages; page++) {
    const j = await gh<{ items: RepoLite[]; total_count: number }>('/search/repositories', {
      q,
      per_page: 100,
      page,
    })
    if (!j) break
    out.push(...j.items)
    if (page === 1) console.error(`  search "${q}" total=${j.total_count}`)
    if (j.items.length < 100) break
    await sleep(2100) // search: 30 req/min
  }
  return out
}

/** Code search → distinct repo full_names. 10 req/min limit → slow. */
export async function searchCodeRepos(q: string, maxPages = 3): Promise<string[]> {
  const names = new Set<string>()
  for (let page = 1; page <= maxPages; page++) {
    const j = await gh<{ items: { repository: { full_name: string } }[]; total_count: number }>(
      '/search/code',
      { q, per_page: 100, page },
    )
    if (!j) break
    for (const it of j.items) names.add(it.repository.full_name)
    if (page === 1) console.error(`  code "${q}" total=${j.total_count}`)
    if (j.items.length < 100) break
    await sleep(6500) // code search: 10 req/min
  }
  await sleep(6500)
  return [...names]
}
