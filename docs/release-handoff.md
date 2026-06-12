# UIQA v0.1.0 Release Handoff

This document is the final operator handoff for publishing UIQA v0.1.0.

## Current State

- Current commit: `3a2c6f373409c7c985300641c333f07d589f12ad`
- Package: `@insannurjaman/uiqa`
- Version: `0.1.0`
- Local tag `v0.1.0`: not present at handoff time
- GitHub release: prepared only
- npm package: prepared only
- GitHub CLI status: `gh` was not installed in the release-prep environment
- npm auth status: `npm whoami` returned `ENEEDAUTH`
- npm registry status: `@insannurjaman/uiqa@0.1.0` returned `E404`, so it was not published at handoff time

## Verification Snapshot

- `pnpm typecheck`: passed
- `pnpm test`: passed, 34 tests
- `pnpm build`: passed and left git clean
- `pnpm uiqa scan --path ./examples --format markdown`: passed
- `pnpm uiqa scan --path ./examples --format json`: passed
- Parsed JSON scan: `filesScanned: 21`, `score: 0`, `findings: 32`
- `pnpm pack --dry-run`: passed
- Dry-run tarball: `insannurjaman-uiqa-0.1.0.tgz`

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
5. If GitHub says the tag does not exist, choose `Create new tag: v0.1.0 on publish`.
6. Release title: `UIQA v0.1.0 — Open-source UI/UX QA for pull requests`.
7. Paste the exact release body from this document.
8. Leave the release as a normal release, not a pre-release, unless you intentionally want to mark v0.1.0 as pre-release.
9. Click `Publish release`.
10. Confirm the release page shows tag `v0.1.0` and points to commit `3a2c6f373409c7c985300641c333f07d589f12ad` or a later intended release commit.

## npm Publish

Exact publish command:

```bash
npm publish --access public
```

Authentication and publish steps:

```bash
npm login
npm whoami
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm pack --dry-run
npm publish --access public
npm view @insannurjaman/uiqa@0.1.0 version
```

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
