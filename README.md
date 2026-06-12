# UIQA

UIQA is an open-source UI/UX QA CLI and GitHub Action for modern front-end teams.

It reviews product experience quality in code changes. The core engine is deterministic, testable, and useful without AI.

## Project Status

UIQA is in early v0.1 development. Expect the rule set and config shape to evolve while the project finds its first stable release.

## Installation

Installation instructions will be finalized once the package is published.

```bash
pnpm add -D uiqa
```

## Usage

Run a scan from the current directory:

```bash
uiqa scan
```

Scan a specific path:

```bash
uiqa scan --path ./src
```

Print JSON instead of Markdown:

```bash
uiqa scan --format json
```

Write a report to disk:

```bash
uiqa scan --output uiqa-report.md
```

Fail CI when medium or high severity findings are present:

```bash
uiqa scan --fail-on medium
```

Use a config file:

```bash
uiqa scan --config uiqa.config.json
```

## What UIQA Checks

The first rules focus on small, practical product-experience issues:

- Missing image alt text.
- Hardcoded hex colors that bypass design tokens.
- Missing empty, loading, error, no-result, validation, confirmation, checkout recovery, and responsive layout states.

See [docs/rules.md](docs/rules.md) for the current rule reference.

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

## Local Development

```bash
pnpm install
pnpm test
pnpm build
pnpm uiqa scan --path ./examples --format markdown
```
