import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Reachability gate for `src/utils/`.
 *
 * A helper in `src/utils/` only earns its place if shipped code calls it.
 * A module that is imported solely by its own test still compiles, still
 * passes CI and still counts toward the coverage figure, so nothing in the
 * suite distinguishes a live helper from an abandoned one. This gate makes
 * that distinction mechanical: every `src/utils/*.ts` module must have at
 * least one importer under `src/` that is not a test.
 */

const SRC_DIR = resolve(import.meta.dirname, '..')
const UTILS_DIR = join(SRC_DIR, 'utils')
const CONSUMER_EXTENSIONS = ['.ts', '.vue']

function collectFiles(dir: string): string[] {
  const found: string[] = []
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name)
    if (statSync(fullPath).isDirectory()) {
      found.push(...collectFiles(fullPath))
      continue
    }
    found.push(fullPath)
  }
  return found
}

function utilModuleNames(): string[] {
  return readdirSync(UTILS_DIR)
    .filter(name => name.endsWith('.ts') && !name.endsWith('.d.ts'))
    .map(name => name.slice(0, -'.ts'.length))
    .sort()
}

function consumerFiles(): string[] {
  return collectFiles(SRC_DIR).filter((fullPath) => {
    const rel = relative(SRC_DIR, fullPath)
    if (rel.startsWith('tests/') || rel.startsWith('utils/')) {
      return false
    }
    return CONSUMER_EXTENSIONS.some(extension => rel.endsWith(extension))
  })
}

describe('src/utils reachability', () => {
  it('has at least one module and at least one consumer to scan', () => {
    expect(utilModuleNames().length).toBeGreaterThan(0)
    expect(consumerFiles().length).toBeGreaterThan(0)
  })

  it('every src/utils module is imported by shipped code, not only by tests', () => {
    const consumers = consumerFiles().map(fullPath => ({
      path: relative(SRC_DIR, fullPath),
      source: readFileSync(fullPath, 'utf8'),
    }))

    const unreachable = utilModuleNames().filter((moduleName) => {
      // Matches both the '@/utils/x' alias and relative '../utils/x' forms,
      // and refuses a prefix match so 'lore' cannot satisfy 'loreRotation'.
      const importPattern = new RegExp(`utils/${moduleName}(?![\\w-])`)
      return !consumers.some(consumer => importPattern.test(consumer.source))
    })

    expect(
      unreachable,
      `Unreachable src/utils modules (imported by no shipped module under src/): ${unreachable.join(', ')}. `
      + 'Either wire the helper into the code that needs it, or delete it along with its test.',
    ).toEqual([])
  })
})
