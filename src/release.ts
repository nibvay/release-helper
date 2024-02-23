import { Options } from "./types";
import { readFile, writeFile, readJson, formatNextVersion, getIndexFromChangelog } from "./utilities";

function genNewChangelog({
  version,
  nextVersionObj,
  originLines,
  releasedIdx,
  title,
}: { version: string, nextVersionObj: formattedObj, originLines: string[], releasedIdx: number, title: string }) {
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

  return `${title}

#### Next Version
${newNextVersion.join("\n")}
#### Released
${newReleased}
`;
}

async function executeRelease(options: Options) {
  const {
    title,
    changelogFile,
    release,
  } = options;
  const originLines = (await readFile(changelogFile)).split("\n");
  const { nextVersionIdx, releasedIdx } = getIndexFromChangelog(originLines);
  const nextVersionObj = formatNextVersion(originLines.slice(nextVersionIdx, releasedIdx));

  // 1. get the version to release
  let releaseVersion: string;
  if (typeof release === "boolean") {
    releaseVersion = Object.keys(nextVersionObj)[0];
  } else {
    if (!Object.keys(nextVersionObj).includes(release)) throw new Error(`${release} is not in Next Version.`);
    releaseVersion = release;
  }
  console.log(`You are going to release ${releaseVersion} 📝📝📝`);

  // 2. move "Next Version" release item to "Released"
  const newContent = genNewChangelog({
    version: releaseVersion,
    nextVersionObj,
    originLines,
    releasedIdx,
    title,
  });
  await writeFile(changelogFile, newContent);
  console.log(`* Update ${changelogFile}.`);

  // 3. bump package.json version
  const packageJsonFile = await readJson("package.json");
  packageJsonFile.version = releaseVersion.replace("v", "");
  const newJson = JSON.stringify(packageJsonFile, null, 2);
  await writeFile("package.json", newJson);
  console.log("* Update the package.json file.");

  // 4. bump package-lock.json version
  const packageLockJsonFile = await readJson("package-lock.json");
  packageLockJsonFile.version = releaseVersion.replace("v", "");
  const newLockJson = JSON.stringify(packageLockJsonFile, null, 2);
  await writeFile("package-lock.json", newLockJson);
  console.log("* Update the package-lock.json file.");
  console.log("Done 🎉");
}

type formattedObj = {
  [index: string]: string[];
}

export default executeRelease;