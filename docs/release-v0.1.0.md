# UIQA v0.1.0 — Open-source UI/UX QA for pull requests

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

## Release Checklist

- Tag: `v0.1.0`
- Package: `@insannurjaman/uiqa@0.1.0`
- Publish command: `npm publish --access public`
