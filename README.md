# Release Helper
This CLI introduces a tool that automates changelog generation from "git log". It simplifies version release by organizing changelogs seamlessly.

## Installation

## Usage
```
Usage: release-helper [options]

A tool for release version and update changelog. You can customize some configurations by creating a ./release-helper.json file

Options:
  -n, --new <version>              Create a new version.
  -release, --release [version]    Release a version.
  -gen-changelog, --gen-changelog  Generate changelog based on organized commit messages.
  -V, --version                    output the version number
  -h, --help                       display help for command
```

## Configuration
You can customize some configurations by creating a ./release-helper.json file.

## Q&A
### Which type of commits will be added into changelog?
* Commits start with "fix:", "feat:", "JIRA-".
    ```
    feat: add user profile dashboard
    fix: format username
    JIRA-0001: ensure all file exists before execution
    ```

### How to generate changelog?
1. Finished your code change.
2. Execute `$ git commit`.
3. Execute `$ release-helper -gen-changelog`.
4. Auto generate changelog based on organized commit messages.

### How to use release a new version?
1. Checkout into the target commit and named this release branch in format `release/vx.x.x` (for example: release/v1.2.0)
2. Execute `$ release-helper -release [version]`.
    ```bash
    $ release-helper -release v1.2.0 # release v1.2.0
    $ release-helper release # release the latest version in "Next Version" block
    ```
3. The version to be released will be moved from the `Next Version` block to the `Released` block.
4. Bump version for `package.json` and `package-lock.json`.

## Reference
* https://github.com/cookpete/auto-changelog