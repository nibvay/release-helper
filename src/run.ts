import { Command } from "commander";
import executeNewVersion from "./newVersion";


function initCommand(argv) {
  const program = new Command();
  program
    .option("-n, --new <version>", "New version")
    .option("-release, --release [version]", "Release version")
    .option("-gen-changelog, --gen-changelog", "Auto generate changelog based on organized commit messages")
    .description("A tool for release version and update changelog")
    .version("1.0.0")
    .parse(argv);
  const options = program.opts();
  return {
    ...options
  };
}

async function run(argv) {
  const cmdOptions = initCommand(argv);
  console.log(cmdOptions);

  if (cmdOptions.new) {
    await executeNewVersion();
  }

}

export default run;