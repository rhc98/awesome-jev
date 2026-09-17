export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toISOString().slice(0, 10)
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toISOString().replace('T', ' ').slice(0, 16).concat(' UTC')
}

export function pct(value: number, digits = 0): string {
  return `${(value * 100).toFixed(digits)}%`
}

export function num(value: number, digits = 2): string {
  return value.toFixed(digits)
}

export function compactNumber(value: number): string {
  if (value < 1000) return String(value)
  if (value < 10000) return `${(value / 1000).toFixed(1)}k`
  return `${Math.round(value / 1000)}k`
}

/** Flattens a nested policy object into dotted key / value rows for a table. */
export function flattenObject(input: unknown, prefix = ''): { key: string; value: string }[] {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return [{ key: prefix, value: stringifyValue(input) }]
  }
  const rows: { key: string; value: string }[] = []
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      rows.push(...flattenObject(value, path))
    } else {
      rows.push({ key: path, value: stringifyValue(value) })
    }
  }
  return rows
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (Array.isArray(value)) return value.map(stringifyValue).join(', ')
  return String(value)
}
