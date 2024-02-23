import { Command } from "commander";
import { readJson, checkFileExists } from "./utilities";
import { Options } from "./types";
import executeNewVersion from "./newVersion";
import executeGenChangelog from "./genChangelog";
import executeRelease from "./release";

const USER_CONFIG_FILE = ".release-helper.json";
const DEFAULT_OPTIONS = {
  title: "# Project Changelog",
  changelogFile: "CHANGELOG.md",
  commitRegex: /^(feat:|fix:|JIRA-)/,
};

async function constructOptions(argv: string[], appVersion: string): Promise<Options> {
  const program = new Command();
  program
    .option("-n, --new <version>", "Create a new version.")
    .option("-release, --release [version]", "Release a version.")
    .option("-gen-changelog, --gen-changelog", "Generate changelog based on organized commit messages.")
    .description("A tool for release version and update changelog. You can customize some configurations by creating a ./release-helper.json file")
    .version(appVersion)
    .parse(argv);
  const options = program.opts();
  const userConfig = await checkFileExists(USER_CONFIG_FILE) ? await readJson(USER_CONFIG_FILE) : {};
  return {
    ...options,
    ...DEFAULT_OPTIONS,
    ...userConfig,
  };
}

async function run(argv: string[]) {
  // preCheck
  const { version } = await readJson("package.json");
  const options = await constructOptions(argv, version);
  // console.log(options);
  if (!checkFileExists(options.changelogFile)) throw new Error("Please create a CHANGELOG.md file.");

  if (options.new) {
    await executeNewVersion(options);
  } else if (options.genChangelog) {
    await executeGenChangelog(options);
  } else if (options.release) {
    await executeRelease(options);
  }
}

export default run;