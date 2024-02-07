import fs from "fs";
import {
  CHANGELOG_TITLE, PACKAGE_JSON_FILE_PATH, CHANGELOG_FILE_PATH,
  formatNextVersion, getIndexFromChangelog,
} from "./utilities.js";

function compareVersions(curVersion: string, inputVersion: string) {
  const v1 = curVersion.replace("v", "").split(".").map(Number);
  const v2 = inputVersion.replace("v", "").split(".").map(Number);
  if (v2[0] === v1[0] && v2[1] === v1[1] && v2[2] === v1[2]) throw new Error(`New version ${inputVersion} can not equal to current version ${curVersion}`);
  console.log({ v1, v2 });

  for (let i = 0; i < 3; i++) {
    if (v2[i] < v1[i]) throw new Error(`Invalid new version ${inputVersion}`);
    if (v2[i] > v1[i]) return true;
  }
  return true;
}

function checkVersion(version: string) {
  if (Object.keys(nextVersionObj).includes(version)) throw new Error(`New version ${version} is already existed.`);
  return true;
}

function genNewChangelog(version: string) {
  const newNextVersion = ([] as string[])
    .concat(`* ${version}`)
    .concat("")
    .concat(originLines.slice(nextVersionIdx + 1, releasedIdx))
    .join("\n");

  return `${CHANGELOG_TITLE}

#### Next Version
${newNextVersion}
${originLines.slice(releasedIdx).join("\n")}
  `;
}

const versionFromCmd = process.argv[2];
if (!versionFromCmd) throw new Error("Please provide your new version");
const { version: currentVersion } = JSON.parse(await fs.promises.readFile(PACKAGE_JSON_FILE_PATH, "utf-8"));
compareVersions(currentVersion, versionFromCmd);

const origin = await fs.readFileSync(CHANGELOG_FILE_PATH, "utf-8");
const originLines = origin.split("\n");

const { nextVersionIdx, releasedIdx } = getIndexFromChangelog(originLines);
const nextVersionObj = formatNextVersion(originLines.slice(nextVersionIdx, releasedIdx));

checkVersion(versionFromCmd);

const newContent = genNewChangelog(versionFromCmd);
await fs.writeFileSync(CHANGELOG_FILE_PATH, newContent, "utf-8");

