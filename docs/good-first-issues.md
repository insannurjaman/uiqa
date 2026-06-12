# Good First Issues

These issues are designed to be contributor-friendly while still moving UIQA toward a stronger v0.2 release.

## 1. Add SARIF Output

Add a reporter that converts UIQA findings into SARIF so GitHub code scanning can display results inline. Start with the existing `Finding` shape and map rule id, severity, message, file, line, and suggestion.

## 2. Add A PR Comment Bot Example

Document a GitHub Actions workflow that posts the Markdown report as a pull request comment. This can start as documentation using `actions/github-script` before becoming a first-class action feature.

## 3. Add shadcn/ui Rule Examples

Create examples and rule ideas for common shadcn/ui usage patterns, such as dialogs without accessible titles, destructive buttons without confirmation, or forms without field messages.

## 4. Add MUI Rule Examples

Create examples and rule ideas for Material UI projects, such as icon buttons without labels, data grids without empty states, and alerts without recovery actions.

## 5. Explore Screenshot Review Support

Research a deterministic screenshot review workflow that could complement static analysis. The first contribution can be a short proposal comparing Playwright screenshots, visual diffing, and report attachment options.

## 6. Reduce False Positives In UX Rules

Collect small real-world fixtures where a current UX rule reports too aggressively. Add tests that capture the desired behavior, then tune the rule conservatively.

## 7. Add Rule Severity Configuration

Extend `uiqa.config.json` so teams can override rule severity or disable specific rules. Keep the schema simple and update tests and docs.

## 8. Build A Real-World Fixture Collection

Add anonymized fixtures that represent common frontend patterns from dashboards, settings pages, search flows, checkout, onboarding, and forms. Each fixture should explain expected findings.

## 9. Improve Documentation Examples

Add more passing and failing examples to rule docs. Focus on making each rule easy to understand for contributors who are new to UI/UX QA.

## 10. Add Framework-Specific Examples

Add example folders for frameworks such as Remix, Astro, Vue, and Svelte. Start with static example components and document which UIQA rules should or should not apply.
