# UIQA

[![CI](https://github.com/insannurjaman/uiqa/actions/workflows/ci.yml/badge.svg)](https://github.com/insannurjaman/uiqa/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@insannurjaman/uiqa.svg)](https://www.npmjs.com/package/@insannurjaman/uiqa)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

UIQA is an open-source UI/UX QA CLI and GitHub Action for modern front-end teams.

It reviews product experience quality in code changes. The core engine is deterministic, testable, and useful without AI.

## Quick Start In 60 Seconds

```bash
pnpm add -D @insannurjaman/uiqa
pnpm exec uiqa scan --path ./src --format markdown
```

Fail CI only when high severity findings are present:

```bash
pnpm exec uiqa scan --path ./src --fail-on high
```

Generate a Markdown report:

```bash
pnpm exec uiqa scan --path ./src --format markdown --output uiqa-report.md
```

Generate a JSON report:

```bash
pnpm exec uiqa scan --path ./src --format json --output uiqa-report.json
```

## GitHub Action

Use UIQA in pull requests:

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

Write Markdown and JSON reports from separate jobs or steps:

```yaml
- uses: insannurjaman/uiqa@v0.1.0
  with:
    path: ./src
    format: markdown
    output: uiqa-report.md

- uses: insannurjaman/uiqa@v0.1.0
  with:
    path: ./src
    format: json
    output: uiqa-report.json
```

Supported Action inputs:

- `path`: path to scan. Defaults to `.`.
- `format`: `markdown` or `json`. Defaults to `markdown`.
- `output`: optional report file path.
- `fail-on`: optional severity threshold: `low`, `medium`, or `high`.
- `config`: optional path to `uiqa.config.json`.

## Why UIQA Exists

Many teams catch syntax, accessibility, and visual token issues in CI, but product experience problems still slip through pull requests: missing empty states, no loading affordance, weak form recovery, checkout flows without trust cues, and mobile layouts that look fine on a desktop preview.

UIQA is built for those review gaps. It is not a generic design linter. It checks deterministic UI/UX patterns that are practical to review in code.

## Who UIQA Is For

UIQA is for front-end teams building product interfaces in TypeScript, JavaScript, JSX, and TSX. It is especially useful for teams that:

- Review product UI in pull requests.
- Maintain a design system.
- Ship dashboards, checkout flows, forms, search, and data-heavy screens.
- Want deterministic checks before adding optional AI review.

## How UIQA Differs

- Accessibility linters focus on accessibility rules. UIQA includes basic accessibility checks but also reviews product states and recovery paths.
- Design token validators catch raw visual values. UIQA includes that signal, then goes further into UX states.
- Figma lint plugins inspect design files. UIQA inspects implementation code in pull requests.
- Generic ESLint rules enforce code style and correctness. UIQA focuses on user experience risks visible in UI code.

## What UIQA Checks

Current v0.1 rules include:

- Missing image alt text.
- Hardcoded hex colors that bypass design tokens.
- Missing empty, loading, error, no-result, validation, confirmation, checkout recovery, and responsive layout states.

See [docs/rules.md](docs/rules.md) for the current rule reference.

## What UIQA Does Not Do Yet

- It does not use AI.
- It does not render pages in a browser.
- It does not compare screenshots or Figma files.
- It does not understand every framework-specific data loading API.
- It does not replace accessibility testing, design reviews, product QA, or usability testing.

## Configuration

Create `uiqa.config.json` in your project root:

```json
{
  "path": "./src",
  "format": "markdown",
  "failOn": "high",
  "ignore": ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.next/**", "**/coverage/**"]
}
```

CLI flags override config values.

## Examples

Run UIQA against the included examples:

```bash
pnpm build
pnpm uiqa scan --path ./examples --format markdown
pnpm uiqa scan --path ./examples/next-tailwind/src --format markdown
```

See [docs/examples.md](docs/examples.md) for details.

## Roadmap To v0.2

- Rule configuration and per-rule enable/disable controls.
- Better framework-specific detection for Next.js and common data libraries.
- GitHub Action annotations and PR summary comments.
- More design-system consistency rules.
- Lower-noise heuristics based on real project fixtures.
- Optional AI adapters after the deterministic core is useful on its own.

## Local Development

```bash
pnpm install
pnpm test
pnpm build
pnpm uiqa scan --path ./examples --format markdown
```
