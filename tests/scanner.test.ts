import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/core/config.js";
import { discoverFiles } from "../src/core/files.js";
import { scan } from "../src/core/scanner.js";
import { rules } from "../src/rules/index.js";
import { createTempDir, writeFixture } from "./helpers.js";

describe("scanner", () => {
  it("finds supported JavaScript and TypeScript files only", async () => {
    const root = await createTempDir();
    await writeFixture(root, "src/a.ts", "export const a = 1;");
    await writeFixture(root, "src/b.tsx", "export const b = <div />;");
    await writeFixture(root, "src/c.js", "export const c = 1;");
    await writeFixture(root, "src/d.jsx", "export const d = <div />;");
    await writeFixture(root, "src/readme.md", "# ignored");

    const files = await discoverFiles(DEFAULT_CONFIG, root);

    expect(files.map((file) => file.split("/").pop()).sort()).toEqual(["a.ts", "b.tsx", "c.js", "d.jsx"]);
  });

  it("ignores default build and dependency directories", async () => {
    const root = await createTempDir();
    await writeFixture(root, "src/a.tsx", "export const a = <img />;");
    await writeFixture(root, "node_modules/pkg/a.tsx", "export const a = <img />;");
    await writeFixture(root, "dist/a.tsx", "export const a = <img />;");
    await writeFixture(root, ".next/a.tsx", "export const a = <img />;");
    await writeFixture(root, "coverage/a.tsx", "export const a = <img />;");

    const files = await discoverFiles(DEFAULT_CONFIG, root);

    expect(files).toHaveLength(1);
    expect(files[0]).toContain("src/a.tsx");
  });

  it("runs multiple rules and returns combined findings", async () => {
    const root = await createTempDir();
    await writeFixture(root, "src/Card.tsx", "export const Card = () => <section style={{ color: '#123456' }}><img src=\"/card.png\" /></section>;");

    const result = await scan(DEFAULT_CONFIG, undefined, root);

    expect(result.scannedFiles).toBe(1);
    expect(result.findings.map((finding) => finding.ruleId).sort()).toEqual(["A11Y001", "DS001"]);
  });

  it("includes the UX rule pack in the default registry", () => {
    expect(rules.map((rule) => rule.id)).toEqual(expect.arrayContaining(["UX001", "UX002", "UX003", "UX004", "UX005", "UX006", "UX007", "UX008"]));
  });
});
