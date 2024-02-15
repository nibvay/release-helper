# Release Helper

## Which type of commits will be added into changelog?
1. Commits start with "fix:" or "feat:".
    ```
    feat: add battery dashboard
    fix: battery count
    ```
2. Commits contain the keyword "ENOP-".
    ```
    [ENOP-4238] add success popup in transfer action completed
    ```

## Suggestion workflow for changelog generator
1. Finished your code change.
2. Execute `$ git commit`.
3. Execute `$ npm run gen-changelog`.
4. Auto generate changelog based on organized commit messages.

## Suggestion workflow for release
1. Checkout into the target commit and named this release branch in format `release/vx.x.x` (for example: release/v1.35.1)
2. Execute `$ npm run release <specific_version>`.
    ```bash
    $ npm run release v1.35.1 # release v1.35.1
    $ npm run release # release the latest version in "Next Version" block
    ```
3. The version to be released will be moved from the `Next Version` block to the `Released` block.
4. Bump version for `package.json` and `package-lock.json`.