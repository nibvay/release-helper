export const CHANGELOG_TITLE = "# Project Changelog";
export const COMMIT_ROUTES = "https://gitlab.gogoro.com/enop-plus/gnop-app/-/commit/";
export const CHANGELOG_FILE_PATH = "./CHANGELOG.md";
export const PACKAGE_JSON_FILE_PATH = "./package.json";
export const PACKAGE_LOCK_JSON_FILE_PATH = "./package-lock.json";
export const DELIMITER = "&";
// console.log(process.cwd());
// export const DEFAULT_OPTIONS = {
//   output: "CHANGELOG.md",
// };

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

