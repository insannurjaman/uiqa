# Architecture

UIQA is a deterministic TypeScript CLI. It scans source files, parses JSX/TSX with Babel, runs small rules, and formats a report.

## Pipeline

1. The CLI reads command flags with Commander.
2. Config is loaded from defaults, `uiqa.config.json`, and CLI overrides.
3. `fast-glob` discovers `.ts`, `.tsx`, `.js`, and `.jsx` files.
4. `@babel/parser` parses each file with TypeScript and JSX plugins.
5. Rules inspect the AST and return typed findings.
6. Reporters format findings as Markdown or JSON.

## Core Types

Rules return `Finding` objects with a rule id, title, severity, category, file path, optional location, message, and suggestion.

The scanner returns `ScanResult`, which includes resolved config, scanned file count, and findings.

## Rule Design

Rules are intentionally small and deterministic. They should be readable enough for contributors to understand the heuristic in one sitting.

UIQA favors useful static signals over broad inference. A rule should explain what it saw and how to improve the UI.

## GitHub Action

The GitHub Action runs the built CLI from `dist/cli/index.js`. The built files are committed so users can run a tagged action without installing UIQA dependencies inside their workflow.

## Non-Goals

UIQA v0.1 does not render pages, call paid services, use AI, run a database, or require a framework runtime.
