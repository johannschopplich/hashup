import { format, parse, relative } from 'node:path'
import { rename, writeFile } from 'node:fs/promises'
import consola from 'consola'
import { cyan, green } from 'picocolors'
import glob from 'tiny-glob'
import { name, version } from '../package.json'
import { getHash } from './utils'

export const hashedFilenameRE = /([.-])(\w{8})\.(\w+)$/

export interface CliOptions {
  assetsDir: string
  extensions: Array<string>
}

export async function generate(options: CliOptions) {
  const { assetsDir, extensions } = options
  const assetFiles = await glob(
    `${assetsDir}/{${extensions.join(',')}}/**/*.{${extensions.join(',')}}`,
  )

  let hashedFiles = 0
  const manifest = Object.create(null)

  for (const path of assetFiles) {
    const parsedPath = parse(path)
    const key = relativeToAssetsDir(path)

    // Make sure file hasn't been hashed already
    if (hashedFilenameRE.test(parsedPath.base)) {
      consola.info(
        `skipping ${cyan(
          relative(assetsDir, path),
        )}, seems to be hashed already`,
      )

      continue
    }

    const hash = await getHash(path)
    const newFilePath = format({
      ...parsedPath,
      base: undefined,
      ext: `.${hash}${parsedPath.ext}`,
    })

    await rename(path, newFilePath)

    manifest[key] = relativeToAssetsDir(newFilePath)
    hashedFiles++
  }

  if (Object.keys(manifest).length) {
    await writeFile(
      `${assetsDir}/manifest.json`,
      JSON.stringify(manifest, null, 2),
      'utf-8',
    )
  }

  consola.success(
    `${hashedFiles} asset files hashed in ${cyan(
      relative(process.cwd(), assetsDir),
    )}\n`,
  )
}

export async function build(options: CliOptions) {
  consola.log(green(`${name} v${version}`))
  consola.start('hashing build assets...')
  consola.info(
    `included file extensions: ${options.extensions
      .map(i => cyan(i))
      .join(', ')}`,
  )

  await generate(options)
}

function relativeToAssetsDir(path: string) {
  return path.substring(path.lastIndexOf('assets/'))
}
