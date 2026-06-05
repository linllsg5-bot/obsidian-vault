import { context } from "esbuild";

const watch = process.argv.includes("--watch");

const ctx = await context({
  entryPoints: ["src/main.ts"],
  bundle: true,
  outfile: "main.js",
  format: "cjs",
  platform: "browser",
  target: "es2020",
  external: ["obsidian"],
  sourcemap: watch,
  minify: false,
});

if (watch) {
  await ctx.watch();
  console.log("watching obsidian-ai-workbench");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}

export default ctx;
