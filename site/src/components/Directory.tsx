'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EntryCard } from '@/components/EntryCard'
import { categories, categoryLabel, entries, languages, patternLabel, patterns } from '@/lib/data'
import type { Entry, Status } from '@/lib/types'

type StatusFilter = Status | 'all'
type SortKey = 'score' | 'stars' | 'created' | 'pushed'

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'listed', label: 'Listed' },
  { value: 'review', label: 'Review' },
  { value: 'excluded', label: 'Excluded' },
  { value: 'all', label: 'All' },
]

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'score', label: 'Jev score' },
  { value: 'stars', label: 'Stars' },
  { value: 'created', label: 'Newest' },
  { value: 'pushed', label: 'Recently pushed' },
]

const DEFAULTS = { status: 'listed' as StatusFilter, sort: 'score' as SortKey }

function matchesQuery(entry: Entry, query: string): boolean {
  if (!query) return true
  const haystack = `${entry.name} ${entry.repo} ${entry.description ?? ''}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every(token => haystack.includes(token))
}

function compare(a: Entry, b: Entry, sort: SortKey): number {
  switch (sort) {
    case 'stars':
      return b.stars - a.stars || b.jev.composite - a.jev.composite
    case 'created':
      return b.created.localeCompare(a.created) || b.jev.composite - a.jev.composite
    case 'pushed':
      return b.pushed.localeCompare(a.pushed) || b.jev.composite - a.jev.composite
    default:
      return b.jev.composite - a.jev.composite || b.stars - a.stars
  }
}

export function Directory() {
  // Filter state lives in the URL, but it is read after mount rather than through
  // useSearchParams: that keeps the default (listed, by score) grid in the static
  // HTML instead of bailing the whole subtree out to a client-only render.
  const [params, setParams] = useState<Record<string, string>>({})

  useEffect(() => {
    const read = () =>
      setParams(Object.fromEntries(new URLSearchParams(window.location.search).entries()))
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const query = params.q ?? ''
  const selectedCategories = useMemo(
    () => (params.cat ?? '').split(',').filter(Boolean),
    [params.cat],
  )
  const pattern = params.pattern ?? ''
  const language = params.lang ?? ''
  const status = (params.status ?? DEFAULTS.status) as StatusFilter
  const sort = (params.sort ?? DEFAULTS.sort) as SortKey

  const commit = useCallback((next: URLSearchParams) => {
    const qs = next.toString()
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
    setParams(Object.fromEntries(next.entries()))
  }, [])

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params)
      if (!value) next.delete(key)
      else next.set(key, value)
      commit(next)
    },
    [commit, params],
  )

  const reset = useCallback(() => commit(new URLSearchParams()), [commit])

  const toggleCategory = useCallback(
    (value: string) => {
      const next = selectedCategories.includes(value)
        ? selectedCategories.filter(c => c !== value)
        : [...selectedCategories, value]
      setParam('cat', next.join(','))
    },
    [selectedCategories, setParam],
  )

  const results = useMemo(() => {
    const catSet = new Set(selectedCategories)
    return entries
      .filter(entry => {
        if (status !== 'all' && entry.status !== status) return false
        if (catSet.size > 0 && !catSet.has(entry.category)) return false
        if (pattern && entry.pattern !== pattern) return false
        if (language && entry.language !== language) return false
        return matchesQuery(entry, query)
      })
      .sort((a, b) => compare(a, b, sort))
  }, [language, pattern, query, selectedCategories, sort, status])

  const hasFilters =
    Boolean(query || pattern || language || selectedCategories.length) ||
    status !== DEFAULTS.status ||
    sort !== DEFAULTS.sort

  const controlClass =
    'rounded border border-line bg-panel px-2.5 py-1.5 text-[13px] outline-none focus:border-accent'

  return (
    <section>
      <div className="flex flex-col gap-3 border-line border-b py-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={event => setParam('q', event.target.value)}
            placeholder="Search name, description, or owner/repo"
            aria-label="Search entries"
            className={`${controlClass} min-w-[14rem] flex-1`}
          />
          <select
            value={pattern}
            onChange={event => setParam('pattern', event.target.value)}
            aria-label="Filter by pattern"
            className={controlClass}
          >
            <option value="">All patterns</option>
            {patterns.map(value => (
              <option key={value} value={value}>
                {patternLabel(value)}
              </option>
            ))}
          </select>
          <select
            value={language}
            onChange={event => setParam('lang', event.target.value)}
            aria-label="Filter by language"
            className={controlClass}
          >
            <option value="">All languages</option>
            {languages.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={event => setParam('sort', event.target.value)}
            aria-label="Sort entries"
            className={controlClass}
          >
            {SORTS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setParam('status', tab.value === DEFAULTS.status ? '' : tab.value)}
              aria-pressed={status === tab.value}
              className={`rounded border px-2.5 py-1 text-[13px] ${
                status === tab.value
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-panel text-muted hover:border-accent/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(value => {
            const active = selectedCategories.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleCategory(value)}
                aria-pressed={active}
                className={`rounded-full border px-2.5 py-0.5 text-[12px] ${
                  active
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-line bg-chip text-muted hover:border-accent/50'
                }`}
              >
                {categoryLabel(value)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 py-3 text-[13px] text-muted">
        <span>
          {results.length} {results.length === 1 ? 'entry' : 'entries'}
        </span>
        {hasFilters ? (
          <button type="button" onClick={reset} className="text-accent hover:underline">
            Reset filters
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="rounded-md border border-line border-dashed p-8 text-center text-[13px] text-muted">
          No entries match these filters.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(entry => (
            <EntryCard key={entry.repo} entry={entry} />
          ))}
        </div>
      )}
    </section>
  )
}
