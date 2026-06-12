# Changelog

## v0.1.0

Initial public release.

### Added

- `uiqa scan` CLI with Markdown and JSON reporters.
- Deterministic scanner for `.ts`, `.tsx`, `.js`, and `.jsx` files.
- Config loading from `uiqa.config.json`.
- Accessibility starter rule for missing image alt text.
- Accessibility rule for icon-only interactive elements missing accessible labels.
- Design-system rules for hardcoded hex colors and inconsistent spacing token usage.
- UX rule pack for empty, loading, error, no-result, form feedback, destructive confirmation, checkout trust, and mobile layout risks.
- Markdown report scoring and JSON output with `filesScanned`, `score`, and `findings`.
- GitHub Action support through `action.yml`.
- Open-source docs, examples, issue templates, and release notes.

### Notes

- UIQA v0.1 does not use AI.
- Rule heuristics are intentionally conservative and will improve with real-world fixtures.
