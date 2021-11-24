import { cac } from "cac";
import { name, version } from "../package.json";
import { build, assetsDir } from "./index";
import { handleError } from "./errors";
import { arraify } from "./utils";

async function main() {
  const cli = cac(name);

  cli
    .command("[dir]", "Assets directory")
    .option("--ext <extension>", "Specify file extensions", {
      default: ["css", "js"],
    })
    .action(async (dir: string, flags) => {
      await build({
        assetsDir: dir ?? assetsDir,
        extensions: arraify(flags.ext),
      });
    });

  cli.help();

  cli.version(version);

  // Parse CLI args without running the command to
  // handle command errors globally
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
}

main().catch(handleError);
