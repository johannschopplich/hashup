import { relative, parse, format } from "pathe";
import { existsSync } from "fs";
import { writeFile, rename } from "fs/promises";
import { getHash } from "./utils";
import consola from "consola";
import { cyan, green } from "colorette";
import { name, version } from "../package.json";
import glob from "tiny-glob";

export const indexPath = existsSync("public") ? "public/" : "";
export const assetsDir = `${indexPath}assets`;
export const hashedFilenameRE = /([.-])(\w{8})\.(\w+)$/;

export type CliOptions = {
  assetsDir: string;
};

export async function generate(options: CliOptions) {
  const assetFiles = await glob(`${options.assetsDir}/{css,js}/**/*.{css,js}`);
  let hashedFiles = 0;

  const manifest = Object.create(null);

  for (const filePath of assetFiles) {
    const key = filePath.slice(indexPath.length);
    const parsedPath = parse(filePath);

    // Make sure file hasn't been hashed already
    if (hashedFilenameRE.test(parsedPath.base)) {
      consola.info(`skipping ${cyan(filePath)}, seems to be hashed already`);
      continue;
    }

    const hash = await getHash(filePath);
    const newFilePath = format({
      ...parsedPath,
      base: undefined,
      ext: `.${hash}${parsedPath.ext}`,
    });

    await rename(filePath, newFilePath);

    manifest[key] = newFilePath.slice(indexPath.length);
    hashedFiles++;
  }

  await writeFile(
    `${assetsDir}/manifest.json`,
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  consola.success(
    `${hashedFiles} asset files hashed in ${cyan(
      relative(process.cwd(), assetsDir)
    )}\n`
  );
}

export async function build(options: CliOptions) {
  consola.log(green(`${name} v${version}`));
  consola.start("hashing build assets...");

  await generate(options);
}
