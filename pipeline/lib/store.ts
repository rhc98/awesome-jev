import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const ROOT = new URL('../../', import.meta.url).pathname
export const DATA = join(ROOT, 'data')

export function readJsonl<T = any>(file: string): T[] {
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l))
}

export function appendJsonl(file: string, rows: any[]) {
  mkdirSync(dirname(file), { recursive: true })
  appendFileSync(file, rows.map(r => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''))
}

export function writeJsonl(file: string, rows: any[]) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, rows.map(r => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : ''))
}

export function readJson<T = any>(file: string, fallback: T): T {
  if (!existsSync(file)) return fallback
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function writeJson(file: string, obj: any) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, JSON.stringify(obj, null, 2) + '\n')
}

export const repoKey = (fullName: string) => fullName.replace('/', '__')

export function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  if (i === -1) return undefined
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : 'true'
}
