import consola from 'consola'

export function handleError(error: unknown) {
  consola.error((error as Error).message)
  process.exitCode = 1
}
