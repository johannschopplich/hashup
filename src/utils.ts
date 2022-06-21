import { readFile } from 'fs/promises'
import { createHash } from 'crypto'

export function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target]
}

/**
 * Returns a 8-digit hash for a given file
 */
export async function getHash(path: string) {
  const buffer = await readFile(path)
  const sum = createHash('sha256').update(buffer)
  const hex = sum.digest('hex')
  return hex.slice(0, 8)
}
