import { describe, expect, it } from "vitest";
import { hardcodedHexColorRule } from "../src/rules/hardcoded-hex-color.js";
import { imageMissingAltRule } from "../src/rules/image-missing-alt.js";
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
