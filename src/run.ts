import { Command } from "commander";
import { readJson } from "./utilities";
import { Options } from "./types";
import executeNewVersion from "./newVersion";
import executeGenChangelog from "./genChangelog";

const DEFAULT_OPTIONS = {
  userConfig: ".release-helper.json"
};

async function constructOptions(argv): Promise<Options> {
  const program = new Command();
  program
    .option("-n, --new <version>", "New version")
    .option("-release, --release [version]", "Release version")
    .option("-gen-changelog, --gen-changelog", "Auto generate changelog based on organized commit messages")
    .description("A tool for release version and update changelog")
    .version("1.0.0")
    .parse(argv);
  const options = program.opts();
  const userConfig = await readJson(DEFAULT_OPTIONS.userConfig);
  return {
    ...options,
    ...userConfig,
  };
}

async function run(argv) {
  const options = await constructOptions(argv);
  console.log(options);

  if (options.new) {
    await executeNewVersion(options);
  } else if (options.genChangelog) {
    await executeGenChangelog(options);
  }
}

export default run;