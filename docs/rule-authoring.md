# Rule Authoring

Rules live in `src/rules`. UX rules live in `src/rules/ux`.

## Rule Shape

Each rule implements:

```ts
type Rule = {
  id: string;
  title: string;
  category: "ux" | "design-system" | "accessibility";
  severity: "low" | "medium" | "high";
  run(context: RuleContext): Finding[];
};
```

## Guidelines

- Keep the heuristic deterministic.
- Prefer AST checks over raw string checks when practical.
- Return a clear message and a practical suggestion.
- Include the rule id, severity, category, file path, message, and suggestion in every finding.
- Include a line number when the AST node has location data.
- Avoid reporting many duplicate findings from the same root cause.
- Add focused tests with one bad fixture and one good fixture.
- Update `docs/rules.md` when behavior is user-facing.

## Testing A Rule

Use `createRuleContext` from `tests/helpers.ts` to parse a small fixture string and call the rule directly.

Bad fixtures should demonstrate the risk. Good fixtures should show the preferred UI pattern and protect against noisy reporting.

## Severity

- `high`: likely to block a user from recovering, trusting, or safely completing a flow.
- `medium`: likely to create a degraded experience or review risk.
- `low`: useful guidance that should rarely fail CI by default.
