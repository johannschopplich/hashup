import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

/**
 * Returns a 8-digit hash for a given file
 */
export async function getHash(path: string) {
  const buffer = await readFile(path)
  const sum = createHash('sha256').update(buffer)
  const hex = sum.digest('hex')
  return hex.slice(0, 8)
}
