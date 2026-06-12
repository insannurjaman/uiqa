import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseSource } from "../src/core/parser.js";
import type { RuleContext } from "../src/core/types.js";

export async function createTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "uiqa-"));
}

export async function writeFixture(root: string, relativePath: string, content: string): Promise<string> {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}

export function createRuleContext(filePath: string, source: string): RuleContext {
  return {
    filePath,
    source,
    ast: parseSource(source, filePath)
  };
}
