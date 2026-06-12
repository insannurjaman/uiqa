# UIQA Release Handoff

This document tracks UIQA release operations.

## v0.1.1 Current State

- Release commit: `6dfadac9dd051109bc8269c701791436ac2452cf`
- Package: `@insannurjaman/uiqa`
- Version: `0.1.1`
- Release purpose: patch npm package metadata so the `uiqa` binary is preserved during publish
- GitHub release title: `UIQA v0.1.1 — npm package metadata fix`
- GitHub release body: see `docs/release-v0.1.1.md`
- Local tag `v0.1.1`: created
- Remote tag `v0.1.1`: pushed to `origin`
- GitHub release status: published and marked as the latest public release
- npm publish status: published
- npm auth status: `npm whoami` returns `insannurjaman`
- npm package verification: `npm view @insannurjaman/uiqa@0.1.1 version` returns `0.1.1`
- npm package metadata: `npm view @insannurjaman/uiqa name version bin` returns name `@insannurjaman/uiqa`, version `0.1.1`, and bin `{ uiqa: "dist/cli/index.js" }`
- Package source: published from tag `v0.1.1`
- Package smoke test: passed from the public npm package; `npm install @insannurjaman/uiqa@0.1.1` and `npx uiqa --help` both worked
- Repeated publish result: npm rejects another `npm publish --access public` for `0.1.1` because published versions cannot be overwritten
- Latest public release: `v0.1.1`
- Product behavior: no rule, scanner, reporter, or GitHub Action behavior changes from v0.1.0

## v0.1.1 Verification Snapshot

- `pnpm install`: passed
- `pnpm typecheck`: passed
- `pnpm test`: passed, 34 tests
- `pnpm build`: passed
- `pnpm uiqa scan --path ./examples --format markdown`: passed
- `pnpm uiqa scan --path ./examples --format json`: passed
- `pnpm pack --dry-run`: passed
- `npm publish --dry-run --access public`: passed without the previous `bin[uiqa]` warning
- `npm view @insannurjaman/uiqa@0.1.1 version`: passed with `0.1.1`
- Public install smoke test: passed with `npm install @insannurjaman/uiqa@0.1.1` and `npx uiqa --help`
- Dry-run tarball: `insannurjaman-uiqa-0.1.1.tgz`
- Packed manifest bin: `{ "uiqa": "dist/cli/index.js" }`

## v0.1.1 Published Package Checks

```bash
npm whoami
npm view @insannurjaman/uiqa@0.1.1 version
npm view @insannurjaman/uiqa name version bin
```

Expected version output:

```txt
0.1.1
```

Fresh install smoke test:

```bash
tmpdir="$(mktemp -d)"
cd "$tmpdir"
npm init -y
npm install @insannurjaman/uiqa@0.1.1
npx uiqa --help
```

## v0.1.1 GitHub Release

GitHub Release `v0.1.1` has been published and marked as the latest release.

- Release URL: `https://github.com/insannurjaman/uiqa/releases/tag/v0.1.1`
- Release title: `UIQA v0.1.1 — npm package metadata fix`
- Release body source: `docs/release-v0.1.1.md`

## v0.1.0 Historical State

This section preserves the final operator handoff for UIQA v0.1.0.

## Current State

- Current release commit: `60f1e4bc1bf7262466b9ca199970944f05bf730f`
- Package: `@insannurjaman/uiqa`
- Version: `0.1.0`
- Local tag `v0.1.0`: created
- Remote tag `v0.1.0`: pushed to `origin`
- GitHub release: published manually by the maintainer
- npm package: publish attempted from tag `v0.1.0`, blocked by npm 2FA
- GitHub CLI status: `gh` is not installed in this environment
- npm auth status: `npm whoami` returns `insannurjaman`
- npm registry status: `@insannurjaman/uiqa@0.1.0` returns `E404`, so it is not published yet

## Release Links

- Tag URL: `https://github.com/insannurjaman/uiqa/releases/tag/v0.1.0`
- New release URL: `https://github.com/insannurjaman/uiqa/releases/new`
- npm package URL after publish: `https://www.npmjs.com/package/@insannurjaman/uiqa/v/0.1.0`

## Verification Snapshot

- `pnpm typecheck`: passed
- `pnpm test`: passed, 34 tests
- `pnpm build`: passed and left git clean
- `pnpm uiqa scan --path ./examples --format markdown`: passed
- `pnpm uiqa scan --path ./examples --format json`: passed
- Parsed JSON scan: `filesScanned: 21`, `score: 0`, `findings: 32`
- `pnpm pack --dry-run`: passed
- Dry-run tarball: `insannurjaman-uiqa-0.1.0.tgz`
- Tag push: `v0.1.0` pushed to `origin`
- Publish attempt: `npm publish --access public` from tag `v0.1.0` was blocked by npm 2FA
- npm package verification: `npm view @insannurjaman/uiqa@0.1.0 version` still returns `E404`

The dry-run package includes `dist`, docs, examples, `action.yml`, README, LICENSE, CHANGELOG, and `package.json`.

## GitHub Release

Exact release title:

```txt
UIQA v0.1.0 — Open-source UI/UX QA for pull requests
```

Exact release body:

```markdown
UIQA v0.1.0 is the first public release of UIQA, a deterministic UI/UX QA CLI and GitHub Action for modern front-end pull requests.

## Highlights

- CLI scanner for `.ts`, `.tsx`, `.js`, and `.jsx` files.
- UX QA rules for empty states, loading states, error states, no-result states, form feedback, destructive action confirmation, checkout trust cues, and mobile layout risks.
- Design-system rules for hardcoded hex colors and inconsistent spacing token usage.
- Accessibility starter rules for missing image alt text and icon-only interactive controls without accessible labels.
- Markdown reports with score, severity grouping, category summary, readable file locations, suggestions, and next-step recommendations.
- JSON reports with `filesScanned`, `score`, and `findings`.
- GitHub Action support through `action.yml`.
- Next/Tailwind examples, rule docs, architecture docs, and rule-authoring guidance.

## Known Limitations

- UIQA v0.1.0 uses deterministic static heuristics and does not render pages in a browser.
- It does not use AI, inspect Figma files, compare screenshots, or replace accessibility testing.
- Some framework-specific data loading patterns may need future tuning.
- Rule configuration and GitHub PR annotations are planned but not included in v0.1.0.

## v0.2 Roadmap

- Per-rule configuration and enable/disable controls.
- Better Next.js and data-library detection.
- GitHub Action annotations and PR summary comments.
- More design-system consistency rules.
- Lower-noise heuristics based on real project fixtures.
- Optional AI adapters after the deterministic core is useful on its own.
```

## Manual GitHub UI Steps

Use these steps if GitHub CLI is unavailable or unauthenticated.

1. Open `https://github.com/insannurjaman/uiqa/releases/new`.
2. Click `Choose a tag`.
3. Enter `v0.1.0`.
4. Target branch: `main`.
5. Select existing tag `v0.1.0`.
6. Release title: `UIQA v0.1.0 — Open-source UI/UX QA for pull requests`.
7. Paste the exact release body from this document.
8. Leave the release as a normal release, not a pre-release, unless you intentionally want to mark v0.1.0 as pre-release.
9. Click `Publish release`.
10. Confirm the release page shows tag `v0.1.0` and points to commit `60f1e4bc1bf7262466b9ca199970944f05bf730f`.

## npm Publish

Exact publish command:

```bash
npm publish --access public
```

Authentication and publish steps:

```bash
npm whoami
git checkout v0.1.0
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
npm publish --access public
npm view @insannurjaman/uiqa@0.1.0 version
git checkout main
```

Current publish blocker:

```txt
npm error 403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

To complete publishing, rerun `npm publish --access public` from tag `v0.1.0` and provide the required npm OTP when prompted, or use a granular npm access token configured to bypass 2FA for publish.

The publish attempt also emitted this warning:

```txt
npm auto-corrected some errors in your package.json when publishing.
"bin[uiqa]" script name dist/cli/index.js was invalid and removed
```

Before retrying publish, consider running `npm pkg fix` on a branch and publishing a corrected patch release if the npm-packed bin metadata is not acceptable. Do not move the existing `v0.1.0` tag.

Expected post-publish `npm view` output:

```txt
0.1.0
```

## Post-Publish Verification

Verify npm install and CLI behavior in a temporary directory:

```bash
tmpdir="$(mktemp -d)"
cd "$tmpdir"
pnpm init
pnpm add -D @insannurjaman/uiqa@0.1.0
pnpm exec uiqa scan --path . --format markdown
```

Verify package metadata:

```bash
npm view @insannurjaman/uiqa@0.1.0 name version license bin repository --json
```

Verify GitHub tag and release:

```bash
git ls-remote --tags https://github.com/insannurjaman/uiqa.git v0.1.0
```

Verify GitHub Action usage in a downstream workflow:

```yaml
name: UIQA

on:
  pull_request:

jobs:
  uiqa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: insannurjaman/uiqa@v0.1.0
        with:
          path: ./src
          format: markdown
          fail-on: high
```

## Known Limitations

- UIQA v0.1.0 uses deterministic static heuristics and does not render pages in a browser.
- UIQA v0.1.0 does not use AI, inspect Figma files, compare screenshots, or replace accessibility testing.
- Some framework-specific data loading patterns may need future tuning.
- Rule configuration and GitHub PR annotations are planned for later releases.

## Rollback Notes

npm stable package versions cannot be safely overwritten. Treat `0.1.0` as immutable once it is published.

If publish fails before completion:

1. Read the npm error.
2. Fix the package, auth, or registry issue.
3. Re-run `pnpm pack --dry-run`.
4. Re-run `npm publish --access public`.

If a bad `0.1.0` package is published:

1. Do not try to overwrite `0.1.0`.
2. Deprecate the bad version:

```bash
npm deprecate @insannurjaman/uiqa@0.1.0 "Deprecated: use @insannurjaman/uiqa@0.1.1 or newer."
```

3. Fix the issue.
4. Bump to `0.1.1`.
5. Publish the patch release:

```bash
npm publish --access public
```

6. Update the GitHub release notes with the deprecation and patch-release guidance.
