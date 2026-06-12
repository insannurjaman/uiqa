import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { traverse } from "../core/traverse.js";
import type { Finding, Rule } from "../core/types.js";

const HEX_COLOR_PATTERN = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;

export const hardcodedHexColorRule: Rule = {
  id: "DS001",
  title: "Hardcoded hex color",
  category: "design-system",
  severity: "medium",
  run(context) {
    const findings: Finding[] = [];
    const seenLocations = new Set<string>();

    traverse(context.ast, {
      StringLiteral(path: NodePath<t.StringLiteral>) {
        reportIfHexColor(path.node, path.node.value);
      },
      TemplateElement(path: NodePath<t.TemplateElement>) {
        reportIfHexColor(path.node, path.node.value.raw);
      },
      JSXText(path: NodePath<t.JSXText>) {
        reportIfHexColor(path.node, path.node.value);
      }
    });

    function reportIfHexColor(node: t.Node, value: string): void {
      if (!HEX_COLOR_PATTERN.test(value)) {
        return;
      }

      const line = node.loc?.start.line;
      const column = node.loc ? node.loc.start.column + 1 : undefined;
      const locationKey = `${line ?? "unknown"}:${column ?? "unknown"}:${value}`;
      if (seenLocations.has(locationKey)) {
        return;
      }
      seenLocations.add(locationKey);

      findings.push({
        ruleId: hardcodedHexColorRule.id,
        title: hardcodedHexColorRule.title,
        severity: hardcodedHexColorRule.severity,
        filePath: context.filePath,
        line,
        column,
        message: "Hardcoded hex colors make design-system updates harder to apply consistently.",
        suggestion: "Use a design token, CSS variable, or shared theme value instead of a raw hex color.",
        category: hardcodedHexColorRule.category
      });
    }

    return findings;
  }
};
