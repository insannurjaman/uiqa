# UIQA Demo Script

This script is designed for a 60-90 second demo.

## Script

Frontend teams already run type checks, tests, and accessibility linters in pull requests. But product UX gaps still slip through: empty tables with no empty state, dashboards with no loading or error state, forms with no feedback, and checkout flows with no trust cues.

UIQA is an open-source CLI and GitHub Action that catches those repeatable UI/UX issues directly in implementation code.

Install it from npm:

```bash
npm install -D @insannurjaman/uiqa
```

Run a scan against your source directory:

```bash
npx uiqa scan --path ./src --format markdown
```

The Markdown report gives a score, files scanned, findings grouped by severity, category counts, exact file locations, and suggestions. For example, UIQA can flag a mapped list without an empty state, a query component without loading or error recovery, an icon-only button without an accessible label, or hardcoded values that bypass design tokens.

For pull requests, add the GitHub Action:

```yaml
- uses: actions/checkout@v4
- uses: insannurjaman/uiqa@v0.1.1
  with:
    path: ./src
    format: markdown
    fail-on: high
```

That lets teams keep low and medium findings visible while blocking only high-severity regressions.

UIQA v0.1.1 is deterministic and does not use AI. The roadmap for v0.2 is focused on rule configuration, SARIF output, GitHub annotations, PR comments, better framework-specific rules, and real-world fixture collection to reduce false positives.

The goal is simple: make product experience quality easier to review in every frontend pull request.
