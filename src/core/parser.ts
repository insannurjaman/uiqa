import { parse } from "@babel/parser";
import type { File } from "@babel/types";

export function parseSource(source: string, filePath: string): File {
  return parse(source, {
    sourceType: "module",
    sourceFilename: filePath,
    errorRecovery: true,
    plugins: ["jsx", "typescript"]
  });
}
