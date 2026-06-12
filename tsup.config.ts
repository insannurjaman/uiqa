import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli/index.ts"],
  format: ["esm"],
  target: "node18",
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false
});
