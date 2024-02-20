import { execFileSync } from "child_process";
import { Options } from "./types";
import { readJson, readFile, writeFile, getIndexFromChangelog } from "./utilities";

const DELIMITER = "&";

function purgeCommit(commit: Commit[]) {
  const validChangelogRegex = /^(feat:|fix:)/;
  return commit.filter((com) => {
    if (validChangelogRegex.test(com.message)) return com;
  });
}

function decomposeVersion(version: string) {
  return version.replace("v", "").split(".");
}

function genToAddChangelog(version: string) {
  const command = [
    "log",
    `--pretty=format:%h${DELIMITER}%d${DELIMITER}%s`,
  ];
  const stdout = execFileSync("git", command, { encoding: "utf-8" }).split("\n");
  const v = decomposeVersion(version);

  const toAdd: Commit[] = [];
  stdout.find((commit) => {
    const [shortSha, tag, message] = commit.split(DELIMITER);
    if (tag.match(`origin/release/v${v[0]}\\.${v[1]}\\.${v[2]}`)) {
      return true;
    } else {
      toAdd.push({ shortSha, tag, message });
      return false;
    }
  });

  return purgeCommit(toAdd);
}

function getLatestRange(items: string[]) {
  const matchIdx: number[] = [];

  for (let i = 0; i < items.length; i++) {
    if (matchIdx.length === 2) break;
    if (items[i].match(/\* v\d+\.\d+\.\d+/g)) matchIdx.push(i - 1);
    if (matchIdx.length === 1 && i === items.length - 1) matchIdx.push(i); // new version only has "one version"
  }

  return { start: matchIdx[0], end: matchIdx[1] };
}

function genNewChangelog({ title, originLines, toAdd, commitLink }: { title: string, originLines: string[], toAdd: Commit[], commitLink: string }) {
  const { nextVersionIdx, releasedIdx } = getIndexFromChangelog(originLines);
  const nextVersionBlock = originLines.slice(nextVersionIdx, releasedIdx);
  const latestRange = getLatestRange(nextVersionBlock);

  const tempLine = new Map();
  nextVersionBlock.slice(latestRange.start + 1, latestRange.end).forEach((line) => {
    const shortSha = line.match(/\[#([a-zA-Z0-9]+)\]/)?.[1];
    if (shortSha) {
      if (!tempLine.has(shortSha)) tempLine.set(shortSha, line);
    } else {
      // to handle legacy case which don't have short hash in commit log
      tempLine.set(line, line);
    }
  });

  const validToAdd = toAdd.filter(({ shortSha }) => !tempLine.has(shortSha)).map(({ shortSha, message }) => `  - ${message} ([#${shortSha}](${commitLink}${shortSha}))`);
  const newNextVersion = ([] as string[])
    .concat(nextVersionBlock.slice(0, latestRange.end))
    .concat(validToAdd)
    .concat("")
    .concat(nextVersionBlock.slice(latestRange.end + 1))
    .join("\n");

  return `${title}

${newNextVersion}
${originLines.slice(releasedIdx).join("\n")}
  `;
}

async function executeGenChangelog(options: Options) {
  const {
    title,
    changelogFile,
    commitLink
  } = options;
  try {
    const { version } = await readJson("package.json");
    if (version.length < 0) throw new Error("There is no version field in package.json");
    const originLines = (await readFile(changelogFile)).split("\n");
    const newContent = genNewChangelog({
      title,
      originLines,
      toAdd: genToAddChangelog(version),
      commitLink,
    });
    await writeFile(changelogFile, newContent);
  } catch (e) {
    console.log(e);
    throw e;
  }

}

type Commit = { shortSha: string, tag: string, message: string };

export default executeGenChangelog;