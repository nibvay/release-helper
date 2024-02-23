import { promises as fsp } from "fs";
import fs from "fs";

export async function readJson(path: string) {
  return JSON.parse(await fsp.readFile(path, "utf-8"));
}

export async function readFile(path: string) {
  return await fsp.readFile(path, "utf-8");
}

export async function writeFile(path: string, newContent: string) {
  await fsp.writeFile(path, newContent, "utf-8");
}

export async function checkFileExists(path: string) {
  try {
    await fsp.access(path, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
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
