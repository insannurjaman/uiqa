import { describe, expect, it } from "vitest";
import { hardcodedHexColorRule } from "../src/rules/hardcoded-hex-color.js";
import { imageMissingAltRule } from "../src/rules/image-missing-alt.js";
import { inconsistentSpacingTokenRule } from "../src/rules/inconsistent-spacing-token.js";
import { interactiveMissingAccessibleLabelRule } from "../src/rules/interactive-missing-accessible-label.js";
import { createRuleContext } from "./helpers.js";

describe("A11Y001 image missing alt text", () => {
  it("reports an img without alt text", () => {
    const context = createRuleContext("Component.tsx", "export function Component() { return <img src=\"/hero.png\" />; }");

    const findings = imageMissingAltRule.run(context);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ ruleId: "A11Y001", severity: "high", category: "accessibility" });
  });

  it("does not report an img with meaningful alt text", () => {
    const context = createRuleContext("Component.tsx", "export function Component() { return <img src=\"/hero.png\" alt=\"Dashboard\" />; }");

    expect(imageMissingAltRule.run(context)).toHaveLength(0);
  });
});

describe("A11Y002 interactive element missing accessible label", () => {
  it("reports icon-only buttons without an accessible label", () => {
    const context = createRuleContext("IconButton.tsx", "export const IconButton = () => <button><TrashIcon /></button>;");

    const findings = interactiveMissingAccessibleLabelRule.run(context);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ ruleId: "A11Y002", severity: "high", category: "accessibility" });
  });

  it("allows interactive elements with visible text or aria labels", () => {
    const labeledIcon = createRuleContext("IconButton.tsx", "export const IconButton = () => <button aria-label=\"Delete project\"><TrashIcon /></button>;");
    const textButton = createRuleContext("Button.tsx", "export const Button = () => <button>Delete project</button>;");

    expect(interactiveMissingAccessibleLabelRule.run(labeledIcon)).toHaveLength(0);
    expect(interactiveMissingAccessibleLabelRule.run(textButton)).toHaveLength(0);
  });
});

describe("DS001 hardcoded hex color", () => {
  it("reports hardcoded hex colors", () => {
    const context = createRuleContext("Button.tsx", "export const Button = () => <button style={{ color: '#ff00aa' }}>Buy</button>;");

    const findings = hardcodedHexColorRule.run(context);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ ruleId: "DS001", severity: "medium", category: "design-system" });
  });

  it("ignores files without hex color literals", () => {
    const context = createRuleContext("Button.tsx", "export const Button = () => <button className=\"primary\">Buy</button>;");

    expect(hardcodedHexColorRule.run(context)).toHaveLength(0);
  });
});

describe("DS002 inconsistent spacing token usage", () => {
  it("reports raw pixel spacing values", () => {
    const context = createRuleContext("Card.tsx", "export const Card = () => <section style={{ padding: 18, marginTop: '12px' }}>Content</section>;");

    const findings = inconsistentSpacingTokenRule.run(context);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ ruleId: "DS002", severity: "medium", category: "design-system" });
  });

  it("allows tokenized spacing classes", () => {
    const context = createRuleContext("Card.tsx", "export const Card = () => <section className=\"p-4 mt-3 gap-2\">Content</section>;");

    expect(inconsistentSpacingTokenRule.run(context)).toHaveLength(0);
  });
});
