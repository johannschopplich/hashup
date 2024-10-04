import { resolve } from 'node:path'
import process from 'node:process'
import { cac } from 'cac'
import { name, version } from '../package.json'
import { handleError } from './errors'
import { build } from './index'

async function main() {
  const cli = cac(name)

  cli
    .command('[path]', 'Path to "assets" directory')
    .option('--ext <extension>', 'Specify file extensions', {
      default: ['css', 'js'],
    })
    .action(async (path: string, flags) => {
      await build({
        assetsDir: resolve(process.cwd(), path || 'assets'),
        extensions: Array.isArray(flags.ext) ? flags.ext : [flags.ext],
      })
    })

  cli.help()

  cli.version(version)

  // Parse CLI args without running the command to
  // handle command errors globally
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}

main().catch(handleError)
