import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  // The repository root carries its own lockfile for the pipeline package; pin
  // tracing to site/ so Next does not infer the parent directory as the root.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
