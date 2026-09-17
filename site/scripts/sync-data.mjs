// Copies the pipeline output into the site source tree so Next can embed it at
// build time. Keeps the site a self-contained package: nothing outside site/ is
// imported by application code.
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const repoData = join(siteRoot, '..', 'data')
const outDir = join(siteRoot, 'src', 'generated')

mkdirSync(outDir, { recursive: true })

const curatedSrc = join(repoData, 'curated.json')
if (!existsSync(curatedSrc)) {
  console.error(
    `sync-data: missing ${curatedSrc}. Run the pipeline first (pnpm curate at the repo root).`,
  )
  process.exit(1)
}
copyFileSync(curatedSrc, join(outDir, 'curated.json'))

const calibrationSrc = join(repoData, 'calibration.json')
const calibrationOut = join(outDir, 'calibration.json')
if (existsSync(calibrationSrc)) {
  copyFileSync(calibrationSrc, calibrationOut)
} else {
  // Keep the import resolvable when calibration has not been computed yet.
  writeFileSync(calibrationOut, 'null\n')
}

console.log(`sync-data: wrote ${outDir}`)
