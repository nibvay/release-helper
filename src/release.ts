import fs from "fs";
import {
  CHANGELOG_FILE_PATH, CHANGELOG_TITLE, PACKAGE_JSON_FILE_PATH, PACKAGE_LOCK_JSON_FILE_PATH,
  formatNextVersion, getIndexFromChangelog,
} from "./utilities.js";

const origin = await fs.readFileSync(CHANGELOG_FILE_PATH, "utf-8");
const originLines = origin.split("\n");
const { nextVersionIdx, releasedIdx } = getIndexFromChangelog(originLines);
const nextVersionObj = formatNextVersion(originLines.slice(nextVersionIdx, releasedIdx));

function getReleaseVersion() {
  const versions = Object.keys(nextVersionObj);
  const versionFromCmd = process.argv[2];

  if (versionFromCmd) {
    if (!versions.includes(versionFromCmd)) throw new Error(`${versionFromCmd} is not in Next Version.`);
    return versionFromCmd;
  }

  return versions[0];
}

function genNewChangelog(version: string) {
  const newReleased = ([] as string[])
    .concat(`* ${version}`)
    .concat(nextVersionObj[version])
    .concat(originLines.slice(releasedIdx + 1))
    .join("\n");

  delete nextVersionObj[version];
  const newNextVersion: string[] = [];
  Object.keys(nextVersionObj).forEach((v) => {
    newNextVersion.push(`* ${v}`);
    newNextVersion.push(...nextVersionObj[v]);
  });

  return `${CHANGELOG_TITLE}

#### Next Version
${newNextVersion.join("\n")}
#### Released
${newReleased}
  `;
}

// 1. get the version to release
const version = getReleaseVersion();
console.log(`You are going to release ${version} ......`);

// 2. move "Next Version" release item to "Released"
const newContent = genNewChangelog(version);
await fs.writeFileSync(CHANGELOG_FILE_PATH, newContent, "utf-8");
console.log("* Update changelog success!");

// 3. bump package.json version
const packageJsonFile = JSON.parse(await fs.promises.readFile(PACKAGE_JSON_FILE_PATH, "utf-8"));
packageJsonFile.version = version.replace("v", "");
const newJson = JSON.stringify(packageJsonFile, null, 2);
await fs.writeFileSync(PACKAGE_JSON_FILE_PATH, newJson, "utf-8");
console.log("* Update the package.json file.");

// 4. bump package-lock.json version
const packageLockJsonFile = JSON.parse(await fs.promises.readFile(PACKAGE_LOCK_JSON_FILE_PATH, "utf-8"));
packageLockJsonFile.version = version.replace("v", "");
const newLockJson = JSON.stringify(packageLockJsonFile, null, 2);
await fs.writeFileSync(PACKAGE_LOCK_JSON_FILE_PATH, newLockJson, "utf-8");
console.log("* Update the package-lock.json file.");
