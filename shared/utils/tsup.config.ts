import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true,
  minify: !options.watch,
  sourcemap: options.watch ? true : false,
  clean: true,
  watch: options.watch,
}));
