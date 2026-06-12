# UIQA Codex Instructions

You are building UIQA, an open-source UI/UX QA CLI and GitHub Action for modern front-end teams.

## Product Positioning

UIQA is not a generic design linter. UIQA reviews product experience quality in pull requests.

It helps teams catch:

* missing empty states
* missing loading states
* missing error states
* weak form recovery
* weak checkout/payment trust signals
* mobile layout risks
* hardcoded visual values
* design-system consistency issues
* basic accessibility issues

The project must be useful without AI. AI integrations can be added later as optional adapters, but the core engine must be deterministic, testable, and open-source.

## Technical Direction

Use:

* TypeScript
* Node.js
* pnpm
* Vitest
* tsup
* Commander for CLI
* fast-glob for file discovery
* @babel/parser and @babel/traverse for TSX/JSX analysis
* zod for config validation

Avoid:

* unnecessary frameworks
* database dependencies
* paid APIs
* AI dependencies in v0.1
* overengineering

## Code Quality Requirements

Every feature must include:

* clear types
* unit tests
* simple examples
* readable error messages
* documentation updates where relevant

The CLI should be friendly for beginners but structured enough for open-source contributors.

## CLI Requirements

The main command should be:

```bash
uiqa scan
```

Supported options:

```bash
uiqa scan --path ./src
uiqa scan --format markdown
uiqa scan --format json
uiqa scan --output uiqa-report.md
uiqa scan --fail-on high
uiqa scan --config uiqa.config.json
```

Default behavior:

* scan current working directory
* include ts, tsx, js, jsx files
* ignore node_modules, dist, build, .next, coverage
* output markdown summary to terminal
* exit 0 unless --fail-on is provided

## Rule Design

Each rule should return findings with this shape:

```ts
type Finding = {
  ruleId: string;
  title: string;
  severity: "low" | "medium" | "high";
  filePath: string;
  line?: number;
  column?: number;
  message: string;
  suggestion: string;
  category: "ux" | "design-system" | "accessibility";
};
```

Each rule should be small, readable, and individually tested.

## Documentation Tone

Documentation should sound like a serious open-source developer tool:

* direct
* practical
* clear examples
* no marketing hype
* explain why each rule matters
