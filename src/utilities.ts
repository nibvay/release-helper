import fs from "fs";

export const CHANGELOG_FILE_PATH = "./CHANGELOG.md";
export const PACKAGE_JSON_FILE_PATH = "./package.json";
export const PACKAGE_LOCK_JSON_FILE_PATH = "./package-lock.json";

export async function readJson(path: string) {
  return JSON.parse(await fs.promises.readFile(path, "utf-8"));
}

export async function readFile(path: string) {
  return await fs.readFileSync(path, "utf-8");
}

export async function writeFile(path: string, newContent: string) {
  await fs.writeFileSync(path, newContent, "utf-8");
}

export function formatNextVersion(items: string[]) {
  const formatted = {};
  let current: string;
  items.forEach((item) => {
    if (item.match(/v\d+\.\d+\.\d+/g)) {
      const v = item.match(/v\d+\.\d+\.\d+/g)?.[0] as string;
      current = v;
      formatted[v] = [];
    } else {
      if (current) {
        formatted[current] = formatted[current].concat(item);
      }
    }
  });
  return formatted;
}

export function getIndexFromChangelog(changelogLines: string[]) {
  return { 
    nextVersionIdx: changelogLines.findIndex((line) => line.includes("#### Next Version")), 
    releasedIdx: changelogLines.findIndex((line) => line.includes("## Released")),
  };
}

