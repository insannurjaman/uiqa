# UIQA Project Impact

UIQA is an open-source UI/UX QA CLI and GitHub Action for pull requests. It helps frontend teams catch product experience issues in implementation code before those issues reach users.

## The Problem

Most frontend projects already have tools for syntax, formatting, type safety, unit tests, and some accessibility checks. Those tools are necessary, but they do not consistently catch common product UX gaps:

- Lists, tables, and dashboards without empty states.
- Data fetching flows without loading or error recovery.
- Forms without validation or helper feedback.
- Search experiences without no-result messaging.
- Destructive actions without confirmation or undo.
- Checkout and payment screens without trust or recovery cues.
- Layout choices that are likely to break on small screens.

These problems are often noticed late, during manual review, QA, design review, or after release.

## Why Existing Linters Are Not Enough

Accessibility linters focus on accessibility semantics. Design token validators focus on visual consistency. ESLint focuses on code correctness and style. UIQA sits next to those tools and checks a different layer: deterministic product experience patterns visible in JSX and TSX.

UIQA is not a generic design linter. It does not try to judge taste or visual polish. It looks for repeatable omissions that reviewers already ask about in pull requests.

## Why Pull Request Workflow Matters

Pull requests are where implementation decisions become product behavior. A lightweight CLI and GitHub Action can surface UX risks while the code is still fresh, before the issue becomes a follow-up ticket.

UIQA is designed for this workflow:

- It runs locally or in CI.
- It outputs readable Markdown for humans.
- It outputs JSON for automation.
- It can fail CI only on chosen severity thresholds.
- It works without a browser, paid service, or AI dependency.

## How UIQA Helps Open-Source Frontend Projects

Open-source maintainers often review frontend contributions without the same QA support available inside a company. UIQA gives maintainers a small deterministic review assistant that can flag missing states, weak recovery paths, and design-system drift.

For contributors, the report is educational: every finding includes a severity, location, message, and suggestion.

## What Shipped In v0.1.1

- npm package `@insannurjaman/uiqa@0.1.1`.
- Working `uiqa` CLI binary after npm install.
- GitHub Action support with configurable path, format, output, config, and fail threshold.
- Markdown and JSON reports.
- Deterministic TS/JS/JSX/TSX scanning.
- Starter UX, accessibility, and design-system rule packs.
- Documentation, examples, release handoff, and contributor scaffolding.

## Planned For v0.2

- Per-rule configuration and severity overrides.
- SARIF and GitHub annotation support.
- PR summary comments.
- More framework-specific detection for Next.js and common data libraries.
- Lower-noise rules based on real-world fixtures.
- Optional AI-assisted review adapters after the deterministic core is useful on its own.

## How Contributors Can Help

- Add real-world fixtures that reduce false positives.
- Improve rule documentation with passing and failing examples.
- Build integrations such as SARIF or PR comments.
- Add framework-specific examples for Next.js, Remix, Astro, Vue, and Svelte.
- Contribute rule packs for design systems such as shadcn/ui, MUI, Radix, or Chakra UI.
