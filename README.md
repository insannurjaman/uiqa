# UIQA

[![CI](https://github.com/insannurjaman/uiqa/actions/workflows/ci.yml/badge.svg)](https://github.com/insannurjaman/uiqa/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@insannurjaman/uiqa.svg)](https://www.npmjs.com/package/@insannurjaman/uiqa)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

UIQA catches product UX issues in pull requests before users do.

UIQA is an open-source UI/UX QA CLI and GitHub Action for modern front-end teams. It reviews implementation code for missing empty states, loading states, error recovery, form feedback, checkout trust cues, mobile layout risks, hardcoded visual values, and basic accessibility gaps.

It is not a generic design linter. The core engine is deterministic, testable, and useful without AI.

## Project Status

UIQA is early v0.1 software. The latest public release is `v0.1.1`, published on npm as `@insannurjaman/uiqa`. The CLI, rule API, and GitHub Action are ready to try in pull requests, while rule heuristics will keep improving with real project fixtures.

## Quick Start In 60 Seconds

Install UIQA:

```bash
npm install -D @insannurjaman/uiqa
```

Run a scan:

```bash
npx uiqa scan --path ./src --format markdown
```

Or with pnpm:

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

Use it in GitHub Actions:

```yaml
- uses: actions/checkout@v4
- uses: insannurjaman/uiqa@v0.1.1
  with:
    path: ./src
    format: markdown
    fail-on: high
```

## CLI Usage

```bash
uiqa scan
uiqa scan --path ./src
uiqa scan --path ./examples
uiqa scan --format markdown
uiqa scan --format json
uiqa scan --output uiqa-report.md
uiqa scan --fail-on high
uiqa scan --config uiqa.config.json
```

Default behavior:

- Scans the current working directory.
- Includes `.ts`, `.tsx`, `.js`, and `.jsx` files.
- Ignores `node_modules`, `dist`, `build`, `.next`, and `coverage`.
- Prints a Markdown report to the terminal.
- Exits `0` unless `--fail-on` is provided and matching findings are present.

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
      - uses: insannurjaman/uiqa@v0.1.1
        with:
          path: ./src
          format: markdown
          fail-on: high
```

Write Markdown and JSON reports from separate jobs or steps:

```yaml
- uses: insannurjaman/uiqa@v0.1.1
  with:
    path: ./src
    format: markdown
    output: uiqa-report.md

- uses: insannurjaman/uiqa@v0.1.1
  with:
    path: ./src
    format: json
    output: uiqa-report.json
```

Fail CI only on high severity findings:

```yaml
- uses: insannurjaman/uiqa@v0.1.1
  with:
    path: ./src
    format: markdown
    fail-on: high
```

Supported Action inputs:

- `path`: path to scan. Defaults to `.`.
- `format`: `markdown` or `json`. Defaults to `markdown`.
- `output`: optional report file path.
- `fail-on`: optional severity threshold: `low`, `medium`, or `high`.
- `config`: optional path to `uiqa.config.json`.

## Why UIQA Exists

Most CI checks answer code questions: does it compile, does it format, does it violate an accessibility rule, did tests pass? Product teams still lose time on a different class of issues: a table has no empty state, a dashboard fetches data without loading or error recovery, a destructive action has no confirmation, a payment flow has no trust cue, or a layout only works on a desktop-sized review screen.

UIQA exists for that pull request gap. It checks deterministic UI/UX patterns that are practical to review in code, before the issue reaches a designer, QA pass, or user report.

## Who UIQA Is For

UIQA is for people who review and maintain product UI, especially in open-source and fast-moving frontend teams:

- Frontend engineers who want actionable UX checks in CI.
- Design-system maintainers who want implementation drift surfaced early.
- OSS maintainers who need lightweight review help without paid services.
- Teams shipping dashboards, checkout flows, forms, search, and data-heavy screens.
- Teams that want deterministic checks before adding optional AI review.

## How UIQA Differs

UIQA is not a generic design linter, and it is not trying to replace existing tools.

- Accessibility linters focus on accessibility rule coverage. UIQA includes basic accessibility checks, then also reviews product states and recovery paths.
- Design token validators catch raw visual values. UIQA includes that signal, then connects it to broader product quality risks.
- Figma lint plugins inspect design files. UIQA inspects implementation code where pull requests actually change user behavior.
- Generic ESLint rules enforce code style and correctness. UIQA focuses on user experience risks visible in JSX/TSX.
- Manual design review catches nuance. UIQA catches repeatable omissions so reviewers can spend attention on the hard parts.

## What UIQA Checks

Current v0.1 rules include:

- `A11Y001`: image missing alt text.
- `A11Y002`: interactive element missing accessible label.
- `DS001`: hardcoded hex colors that bypass design tokens.
- `DS002`: inconsistent spacing token usage.
- Missing empty, loading, error, no-result, validation, confirmation, checkout recovery, and responsive layout states.

See [docs/rules.md](docs/rules.md) for the current rule reference.

## Sample Report

```markdown
# UIQA Report

Score: 84/100
Scanned files: 12
Findings: 2

Severity: 1 high, 1 medium, 0 low

## Categories

- ux: 1
- accessibility: 1

## Findings By Severity

### High (1)

#### A11Y002: Interactive element missing accessible label

- Category: accessibility
- Location: src/components/IconButton.tsx:4:5
- Message: Interactive elements need an accessible name so assistive technology can describe the action.
- Suggestion: Add visible text, aria-label, aria-labelledby, or a title that clearly names the action.
```

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

## OSS Project Context

- [Project impact](docs/project-impact.md)
- [Demo script](docs/demo-script.md)
- [Good first issues](docs/good-first-issues.md)
- [Maintainer notes](docs/maintainer-notes.md)

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
