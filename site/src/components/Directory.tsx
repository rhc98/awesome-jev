'use client'

import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EntryCard } from '@/components/EntryCard'
import { EntryRow } from '@/components/EntryRow'
import { categories, categoryLabel, entries, languages, patternLabel, patterns } from '@/lib/data'
import type { Entry, Status } from '@/lib/types'

type StatusFilter = Status | 'all'
type SortKey = 'score' | 'stars' | 'created' | 'pushed'
type View = 'rows' | 'cards'

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

const DEFAULTS = {
  status: 'listed' as StatusFilter,
  sort: 'score' as SortKey,
  view: 'rows' as View,
}

// The virtualizer has nothing to measure during `output: export` prerender, so the
// first slice is rendered plainly and swapped for the virtual window after mount.
// That keeps real entries in the static HTML — an empty scroll spacer would drop
// the default grid the page is built to ship — while capping the hydrated DOM.
const STATIC_ITEMS = 24

// Matches the sm:grid-cols-2 / lg:grid-cols-3 breakpoints on the card grid.
const CARD_BREAKPOINTS = [
  { query: '(min-width: 1024px)', lanes: 3 },
  { query: '(min-width: 640px)', lanes: 2 },
]

// Fallback heights until a row reports its own; over-estimating is cheaper than
// under-estimating, which makes the scrollbar jump as real sizes come in.
const ESTIMATE = { rows: 132, cards: 196 }
const CARD_GAP = 12 // gap-3

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
  const view = (params.view === 'cards' ? 'cards' : DEFAULTS.view) as View

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

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of entries) {
      if (status !== 'all' && entry.status !== status) continue
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1)
    }
    return counts
  }, [status])

  const listEl = useRef<HTMLElement | null>(null)
  const [listTop, setListTop] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [cardLanes, setCardLanes] = useState(1)

  useEffect(() => setMounted(true), [])

  // A callback ref rather than useRef: the virtualizer needs the list's document
  // offset as an option at render time, so the measurement has to reach state the
  // moment the element attaches. Works for both the <ul> and the card <div>.
  const attachList = useCallback((el: HTMLElement | null) => {
    listEl.current = el
    setListTop(el?.offsetTop ?? 0)
  }, [])

  useEffect(() => {
    const remeasure = () => setListTop(listEl.current?.offsetTop ?? 0)
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [])

  useEffect(() => {
    if (view !== 'cards') return
    const lists = CARD_BREAKPOINTS.map(b => window.matchMedia(b.query))
    const sync = () => {
      const hit = lists.findIndex(l => l.matches)
      setCardLanes(hit === -1 ? 1 : CARD_BREAKPOINTS[hit].lanes)
    }
    sync()
    for (const l of lists) l.addEventListener('change', sync)
    return () => {
      for (const l of lists) l.removeEventListener('change', sync)
    }
  }, [view])

  const lanes = view === 'cards' ? cardLanes : 1
  const virtualizer = useWindowVirtualizer({
    count: results.length,
    estimateSize: () => (view === 'cards' ? ESTIMATE.cards : ESTIMATE.rows),
    overscan: 6,
    lanes,
    // getTotalSize() is measured from the document top, so the list has to declare
    // where it starts or every row sits one header's worth too low.
    scrollMargin: listTop,
  })

  // Row heights depend on the filtered set (descriptions wrap differently), so drop
  // stale measurements when the results or the column count change.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure on result/lane change
  useEffect(() => {
    virtualizer.measure()
  }, [results, lanes, virtualizer])

  const hasFilters =
    Boolean(query || pattern || language || selectedCategories.length) ||
    status !== DEFAULTS.status ||
    sort !== DEFAULTS.sort ||
    view !== DEFAULTS.view

  const controlClass =
    'h-9 rounded-md border border-line bg-panel px-3 text-[14px] outline-none focus:border-accent'
  const segClass = (active: boolean) =>
    `px-3 py-1.5 text-[13px] leading-5 ${
      active ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:text-fg'
    }`

  return (
    <section className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
      <aside className="hidden lg:block">
        <p className="cap border-line border-t pt-6 pb-3">Category</p>
        <ul className="flex flex-col">
          <li>
            <button
              type="button"
              onClick={() => setParam('cat', '')}
              aria-pressed={selectedCategories.length === 0}
              className={`flex w-full items-baseline justify-between py-1 text-left text-[13px] ${
                selectedCategories.length === 0 ? 'text-fg' : 'text-muted hover:text-fg'
              }`}
            >
              <span>All</span>
              <span className="num font-mono text-[12px] text-faint">
                {[...categoryCounts.values()].reduce((a, b) => a + b, 0)}
              </span>
            </button>
          </li>
          {categories.map(value => {
            const active = selectedCategories.includes(value)
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => toggleCategory(value)}
                  aria-pressed={active}
                  className={`flex w-full items-baseline justify-between py-1 text-left text-[13px] ${
                    active ? 'text-accent' : 'text-muted hover:text-fg'
                  }`}
                >
                  <span>{categoryLabel(value)}</span>
                  <span className="num font-mono text-[12px] text-faint">
                    {categoryCounts.get(value) ?? 0}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-col gap-3 border-line border-t pt-4 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={event => setParam('q', event.target.value)}
              placeholder="Search name, description, or owner/repo"
              aria-label="Search entries"
              className={`${controlClass} min-w-[14rem] flex-1 placeholder:font-mono placeholder:text-[13px] placeholder:text-faint`}
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

          <div className="flex flex-wrap items-center justify-between gap-2">
            <fieldset className="inline-flex overflow-hidden rounded-full border border-line">
              <legend className="sr-only">Status</legend>
              {STATUS_TABS.map(tab => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setParam('status', tab.value === DEFAULTS.status ? '' : tab.value)}
                  aria-pressed={status === tab.value}
                  className={`${segClass(status === tab.value)} border-line border-r last:border-r-0`}
                >
                  {tab.label}
                </button>
              ))}
            </fieldset>
            <fieldset className="inline-flex overflow-hidden rounded-full border border-line">
              <legend className="sr-only">View</legend>
              <button
                type="button"
                onClick={() => setParam('view', '')}
                aria-pressed={view === 'rows'}
                className={`${segClass(view === 'rows')} border-line border-r`}
              >
                Rows
              </button>
              <button
                type="button"
                onClick={() => setParam('view', 'cards')}
                aria-pressed={view === 'cards'}
                className={segClass(view === 'cards')}
              >
                Cards
              </button>
            </fieldset>
          </div>

          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden">
            {categories.map(value => {
              const active = selectedCategories.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleCategory(value)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[12px] leading-4 ${
                    active
                      ? 'border-accent bg-accent-soft text-accent'
                      : 'border-transparent bg-chip text-body'
                  }`}
                >
                  {categoryLabel(value)}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 py-2 text-[13px] text-muted">
          <span className="num font-mono">
            {results.length} {results.length === 1 ? 'entry' : 'entries'}
          </span>
          {hasFilters ? (
            <button type="button" onClick={reset} className="text-accent hover:underline">
              Reset filters
            </button>
          ) : null}
        </div>

        {results.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-muted">
            No entries match these filters.
          </p>
        ) : !mounted ? (
          // Prerender and first hydration pass: a plain slice, so the markup the
          // client starts from is identical to the exported HTML.
          view === 'cards' ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, STATIC_ITEMS).map(entry => (
                <EntryCard key={entry.repo} entry={entry} />
              ))}
            </div>
          ) : (
            <ul className="border-line border-t">
              {results.slice(0, STATIC_ITEMS).map(entry => (
                <EntryRow key={entry.repo} entry={entry} />
              ))}
            </ul>
          )
        ) : view === 'cards' ? (
          <div ref={attachList} className="relative" style={{ height: virtualizer.getTotalSize() }}>
            {virtualizer.getVirtualItems().map(item => {
              const entry = results[item.index]
              return (
                <div
                  key={entry.repo}
                  data-index={item.index}
                  ref={virtualizer.measureElement}
                  className="absolute top-0 pb-3"
                  style={{
                    left: `${(item.lane * 100) / lanes}%`,
                    width: `${100 / lanes}%`,
                    paddingLeft: item.lane === 0 ? 0 : CARD_GAP / 2,
                    paddingRight: item.lane === lanes - 1 ? 0 : CARD_GAP / 2,
                    transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
                  }}
                >
                  <EntryCard entry={entry} />
                </div>
              )
            })}
          </div>
        ) : (
          <ul
            ref={attachList}
            className="relative border-line border-t"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map(item => {
              const entry = results[item.index]
              return (
                <EntryRow
                  key={entry.repo}
                  entry={entry}
                  index={item.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
                  }}
                />
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
