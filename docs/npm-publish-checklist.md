# npm Publish Checklist

Package: `@insannurjaman/uiqa@0.1.1`

## Authentication

This environment is authenticated with npm, but publishing may require npm 2FA or a granular token that can bypass 2FA for publish.

Before publishing:

```bash
npm login
npm whoami
```

## Verify Package Contents

Run:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
```

The dry run should include:

- `dist`
- `action.yml`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `docs`
- TypeScript/JSX examples
- `package.json`

The package `files` field intentionally excludes generated Markdown reports under `examples/reports`.

Latest local dry-run result:

```txt
package: @insannurjaman/uiqa@0.1.1
Tarball Contents
action.yml
CHANGELOG.md
dist/cli/index.js
dist/index.js
docs/
examples/
LICENSE
package.json
README.md
Tarball Details
insannurjaman-uiqa-0.1.1.tgz
```

## Publish

```bash
npm publish --access public
```

## After Publish

Confirm the published version:

```bash
npm view @insannurjaman/uiqa@0.1.1 version
```
