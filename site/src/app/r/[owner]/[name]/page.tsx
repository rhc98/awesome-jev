import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProbBar, ScaleBar } from '@/components/Bars'
import { Chip } from '@/components/Chip'
import {
  categoryLabel,
  entries,
  findEntry,
  githubUrl,
  homepageUrl,
  patternLabel,
  STATUS_LABELS,
  splitRepo,
} from '@/lib/data'
import { formatDate, formatDateTime, num } from '@/lib/format'
import type { Entry } from '@/lib/types'

type Params = { owner: string; name: string }

export function generateStaticParams(): Params[] {
  return entries.map(entry => splitRepo(entry.repo))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { owner, name } = await params
  const entry = findEntry(owner, name)
  if (!entry) return { title: 'Not found' }
  return {
    title: entry.name,
    description: entry.description ?? `Jev judgment for ${entry.repo}.`,
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t py-6">
      <h2 className="mb-4 font-medium text-[13px] text-muted uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-line border-b py-1.5 text-[13px] last:border-b-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-mono tabular-nums">{value}</span>
    </div>
  )
}

function sourceHref(source: string): string | null {
  const match = source.match(/^list:([\w.-]+\/[\w.-]+)$/)
  return match ? githubUrl(match[1]) : null
}

function CategoryProbs({ entry }: { entry: Entry }) {
  const rows = Object.entries(entry.jev.category_probs).sort((a, b) => b[1] - a[1])
  if (rows.length === 0) {
    return <p className="text-[13px] text-muted">No category distribution recorded.</p>
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map(([key, value]) => (
        <ProbBar key={key} label={categoryLabel(key)} value={value} />
      ))}
    </div>
  )
}

export default async function EntryPage({ params }: { params: Promise<Params> }) {
  const { owner, name } = await params
  const entry = findEntry(owner, name)
  if (!entry) notFound()

  const homepage = homepageUrl(entry.site)

  return (
    <article className="py-8">
      <p className="text-[13px] text-muted">
        <Link href="/" className="hover:text-accent">
          Index
        </Link>{' '}
        / {entry.repo}
      </p>

      <h1 className="mt-2 font-semibold text-2xl tracking-tight">{entry.name}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {entry.description?.trim() || 'No description provided.'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <Chip tone="accent">{categoryLabel(entry.category)}</Chip>
        <Chip>{patternLabel(entry.pattern)}</Chip>
        {entry.language ? <Chip>{entry.language}</Chip> : null}
        <Chip>{STATUS_LABELS[entry.status] ?? entry.status}</Chip>
        {entry.readme_pick ? <Chip tone="accent">README pick</Chip> : null}
        {entry.is_official ? <Chip tone="accent">Official</Chip> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
        <a
          href={githubUrl(entry.repo)}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent hover:underline"
        >
          GitHub
        </a>
        {homepage ? (
          <a
            href={homepage}
            target="_blank"
            rel="noreferrer noopener"
            className="text-accent hover:underline"
          >
            Homepage
          </a>
        ) : null}
      </div>

      <Section title="Repository">
        <div className="grid gap-x-10 sm:grid-cols-2">
          <div>
            <Field label="Stars" value={entry.stars.toLocaleString('en-US')} />
            <Field label="Language" value={entry.language ?? '—'} />
            <Field label="License" value={entry.license ?? '—'} />
          </div>
          <div>
            <Field label="Created" value={formatDate(entry.created)} />
            <Field label="Last pushed" value={formatDate(entry.pushed)} />
            <Field label="Official" value={entry.is_official ? 'yes' : 'no'} />
          </div>
        </div>
      </Section>

      <Section title="Judgment">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProbBar label="Genuine Jev project" value={entry.jev.genuine} />
          <ProbBar label="Uses Jev at runtime" value={entry.jev.runtime_use} />
          <ProbBar label="Is a meta list" value={entry.jev.is_meta_list} />
          <ProbBar label="Is a reimplementation" value={entry.jev.is_reimpl} />
        </div>
      </Section>

      <Section title="Quality scales">
        <div className="grid gap-4 sm:grid-cols-3">
          <ScaleBar label="Substance" value={entry.jev.substance} />
          <ScaleBar label="Docs" value={entry.jev.docs} />
          <ScaleBar label="Novelty" value={entry.jev.novelty} />
        </div>
        <div className="mt-4 max-w-sm">
          <ProbBar label="Composite score" value={entry.jev.composite} />
        </div>
      </Section>

      <Section title="Category distribution">
        <CategoryProbs entry={entry} />
        <div className="mt-4 grid gap-x-10 sm:grid-cols-2">
          <div>
            <Field label="Assigned category" value={categoryLabel(entry.category)} />
            <Field label="Category probability" value={num(entry.jev.category_p)} />
            <Field label="Category confidence" value={num(entry.jev.category_conf)} />
          </div>
          <div>
            <Field label="Pattern" value={patternLabel(entry.pattern)} />
            <Field label="Pattern confidence" value={num(entry.jev.pattern_conf)} />
          </div>
        </div>
      </Section>

      <Section title="Curation">
        <Field label="Status" value={STATUS_LABELS[entry.status] ?? entry.status} />
        <Field label="Reason" value={entry.status_reason} />
        <Field label="README pick" value={entry.readme_pick ? 'yes' : 'no'} />
        <Field label="Override" value={entry.override ? JSON.stringify(entry.override) : 'none'} />
      </Section>

      <Section title="Sources">
        {entry.sources.length === 0 ? (
          <p className="text-[13px] text-muted">No discovery sources recorded.</p>
        ) : (
          <ul className="flex flex-col gap-1 font-mono text-[12px]">
            {entry.sources.map(source => {
              const href = sourceHref(source)
              return (
                <li key={source}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-muted hover:text-accent"
                    >
                      {source}
                    </a>
                  ) : (
                    <span className="text-muted">{source}</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      <Section title="Provenance">
        <div className="grid gap-x-10 sm:grid-cols-2">
          <div>
            <Field label="Model" value={entry.jev.model} />
            <Field label="Question set" value={entry.jev.qset} />
          </div>
          <div>
            <Field label="Judged at" value={formatDateTime(entry.jev.judged_at)} />
          </div>
        </div>
      </Section>
    </article>
  )
}
