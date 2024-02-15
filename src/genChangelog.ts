import fs from "fs";
import { execFileSync } from "child_process";
import { CHANGELOG_TITLE, COMMIT_ROUTES, PACKAGE_JSON_FILE_PATH, CHANGELOG_FILE_PATH, DELIMITER } from "./utilities.js";

async function getLatestReleasedVersion(): Promise<string> {
  try {
    const packageRawData = await fs.readFileSync(PACKAGE_JSON_FILE_PATH, "utf-8");
    const { version } = JSON.parse(packageRawData);
    if (version.length < 0) throw new Error("There is no version field in package.json");
    return version;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

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

function genNewChangelog({ origin, toAdd }: { origin: string, toAdd: Commit[] }) {
  const originLines = origin.split("\n");
  const nextVersionStartIdx = originLines.findIndex((line) => line.includes("#### Next Version"));
  const releasedStartIdx = originLines.findIndex((line) => line.includes("## Released"));
  const nextVersionBlock = originLines.slice(nextVersionStartIdx, releasedStartIdx);
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

  const validToAdd = toAdd.filter(({ shortSha }) => !tempLine.has(shortSha)).map(({ shortSha, message }) => `  - ${message} ([#${shortSha}](${COMMIT_ROUTES}${shortSha}))`);
  const newNextVersion = ([] as string[])
    .concat(nextVersionBlock.slice(0, latestRange.end))
    .concat(validToAdd)
    .concat("")
    .concat(nextVersionBlock.slice(latestRange.end + 1))
    .join("\n");

  return `${CHANGELOG_TITLE}

${newNextVersion}
${originLines.slice(releasedStartIdx).join("\n")}
  `;
}

const latestReleasedVersion = await getLatestReleasedVersion();
const toAddChangelog = genToAddChangelog(latestReleasedVersion);
const origin = await fs.readFileSync(CHANGELOG_FILE_PATH, "utf-8");
const newContent = genNewChangelog({ origin, toAdd: toAddChangelog });
await fs.writeFileSync(CHANGELOG_FILE_PATH, newContent, "utf-8");
console.log("Add changelog success!");

type Commit = { shortSha: string, tag: string, message: string };
