import { formatNextVersion, getIndexFromChangelog, readJson, readFile, writeFile } from "./utilities";
import { Options } from "./types";

function compareVersions(curVersion: string, inputVersion: string) {
  const v1 = curVersion.replace("v", "").split(".").map(Number);
  const v2 = inputVersion.replace("v", "").split(".").map(Number);
  if (v2[0] === v1[0] && v2[1] === v1[1] && v2[2] === v1[2]) throw new Error(`New version ${inputVersion} can not equal to current version ${curVersion}`);

  for (let i = 0; i < 3; i++) {
    if (v2[i] < v1[i]) throw new Error(`Invalid new version ${inputVersion}`);
    if (v2[i] > v1[i]) return true;
  }
  return true;
}

function genNewChangelog({
  originLines,
  version,
  nextVersionIdx,
  releasedIdx,
  title,
}: {
  originLines: string[],
  version: string,
  nextVersionIdx: number,
  releasedIdx: number,
  title: string,
}) {
  const newNextVersion = ([] as string[])
    .concat(`* ${version}`)
    .concat("")
    .concat(originLines.slice(nextVersionIdx + 1, releasedIdx))
    .join("\n");

  return `${title}

#### Next Version
${newNextVersion}
${originLines.slice(releasedIdx).join("\n")}
  `;
}

async function executeNewVersion(options: Options) {
  const { 
    new: inputVersion,
    title,
    changelogFile,
  } = options;
  try {
    const { version: currentVersion } = await readJson("package.json");
    compareVersions(currentVersion, inputVersion);

    const originLines = (await readFile(changelogFile)).split("\n");
    console.log(originLines);
    const { nextVersionIdx, releasedIdx } = getIndexFromChangelog(originLines);
    const nextVersionObj = formatNextVersion(originLines.slice(nextVersionIdx, releasedIdx));
    if (Object.keys(nextVersionObj).includes(inputVersion)) throw new Error(`New version ${inputVersion} is already existed.`);

    const newContent = genNewChangelog({
      originLines,
      version: inputVersion,
      nextVersionIdx,
      releasedIdx,
      title,
    });

    await writeFile(changelogFile, newContent);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export default executeNewVersion;

