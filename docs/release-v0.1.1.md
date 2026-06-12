# UIQA v0.1.1 - npm package metadata fix

## Release Title

UIQA v0.1.1 — npm package metadata fix

## Release Body

- Fixes npm CLI binary metadata.
- Ensures `uiqa` command is correctly exposed from the package.
- Publishes the first npm-ready UIQA package.
- No product rule behavior changes from v0.1.0.

## Notes

The v0.1.0 GitHub release remains unchanged. v0.1.1 exists because the v0.1.0 npm publish attempt was blocked by npm 2FA and npm publish validation removed the package `bin` entry. This patch keeps the same product behavior while correcting the package metadata before npm publication.
