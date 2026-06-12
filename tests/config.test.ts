import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, loadConfig } from "../src/core/config.js";
import { createTempDir } from "./helpers.js";

describe("loadConfig", () => {
  it("uses defaults when no config exists", async () => {
    const root = await createTempDir();

    expect(loadConfig(root)).toEqual(DEFAULT_CONFIG);
  });

  it("loads a valid uiqa.config.json", async () => {
    const root = await createTempDir();
    await fs.writeFile(
      path.join(root, "uiqa.config.json"),
      JSON.stringify({ path: "src", format: "json", failOn: "medium", ignore: ["**/generated/**"] }),
      "utf8"
    );

    expect(loadConfig(root)).toMatchObject({
      path: "src",
      format: "json",
      failOn: "medium",
      ignore: ["**/generated/**"]
    });
  });

  it("rejects invalid config with a readable error", async () => {
    const root = await createTempDir();
    await fs.writeFile(path.join(root, "uiqa.config.json"), JSON.stringify({ format: "xml" }), "utf8");

    expect(() => loadConfig(root)).toThrow(/Invalid UIQA config/);
  });

  it("lets CLI options override config values", async () => {
    const root = await createTempDir();
    await fs.writeFile(path.join(root, "uiqa.config.json"), JSON.stringify({ path: "src", format: "json" }), "utf8");

    expect(loadConfig(root, { path: "examples", format: "markdown" })).toMatchObject({
      path: "examples",
      format: "markdown"
    });
  });
});
