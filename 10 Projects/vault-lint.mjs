import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectsDir = path.dirname(fileURLToPath(import.meta.url));
const vaultRoot = path.dirname(projectsDir);
const errors = [];
const warnings = [];
const exists = (relative) => fs.existsSync(path.join(vaultRoot, relative));
const read = (relative) => fs.readFileSync(path.join(vaultRoot, relative), "utf8");

console.log(`Vault lint: ${vaultRoot}`);

// 1. 根目录只保留导航与 runtime 入口。密钥便笺是用户暂缓处理的例外。
const allowedRootMarkdown = new Set(["AGENTS.md", "AI.md", "CLAUDE.md", "HOME.md"]);
const temporaryRootExceptions = new Set(["未命名 1.md"]);
for (const entry of fs.readdirSync(vaultRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".md") || allowedRootMarkdown.has(entry.name)) continue;
  if (temporaryRootExceptions.has(entry.name)) {
    warnings.push(`根目录暂留例外：${entry.name}（用户选择本轮不处理）`);
  } else {
    errors.push(`根目录出现非入口 Markdown：${entry.name}`);
  }
}

// 2. 已归档的 ex.1—3 不应重新产生根目录副本。
for (const name of [
  "ex.1-框架的雏形的思考与讨论阶段.md",
  "ex.2 雏形的设计阶段的尝试与思考和讨论.md",
  "ex3-雏形的设计改进.md",
]) {
  if (exists(name)) errors.push(`已归档会话重新出现根目录副本：${name}`);
}

// 3. HOME 与 Projects README 只导航，不复制项目状态。
for (const relative of ["HOME.md", path.join("10 Projects", "README.md")]) {
  const content = read(relative);
  if (/^\s*-?\s*(状态|当前推进|下一步|卡点)[:：]/mu.test(content)) {
    errors.push(`导航入口复制了项目状态：${relative}`);
  }
  if (/Phase\s+[0-9]/u.test(content)) errors.push(`导航入口写入了易漂移的 Phase：${relative}`);
}

// 4. 默认加载文件保持短；完整推导放旁挂全史。
for (const relative of [
  path.join("AI", "当前主线.md"),
  path.join("AI", "信念谱系.md"),
  path.join("AI", "认识论-框架.md"),
]) {
  if (!exists(relative)) {
    errors.push(`缺少默认加载文件：${relative}`);
    continue;
  }
  const size = fs.statSync(path.join(vaultRoot, relative)).size;
  if (size > 16 * 1024) errors.push(`默认加载文件重新变厚（${(size / 1024).toFixed(1)} KB）：${relative}`);
}

for (const relative of [
  path.join("AI", "主线谱系.md"),
  path.join("AI", "信念谱系-全史.md"),
  path.join("AI", "认识论-框架-全史.md"),
]) {
  if (!exists(relative)) errors.push(`缺少默认短版对应的全史旁挂：${relative}`);
}

// 5. 每个会话目录必须有当前入口；raw/标注缺失只报告，不能伪造补齐。
const conversationsRoot = path.join(vaultRoot, "10 Projects", "ai-conversations");
for (const directory of fs.readdirSync(conversationsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const directoryPath = path.join(conversationsRoot, directory.name);
  const names = fs.readdirSync(directoryPath);
  const indexContent = names.includes("index.md") ? fs.readFileSync(path.join(directoryPath, "index.md"), "utf8") : "";
  if (!names.includes("index.md")) errors.push(`会话目录缺少 index：${directory.name}`);
  if (!names.some((name) => /^raw.*\.(md|txt)$/u.test(name)) && !/^source_state:\s*(source-missing|index-only)/mu.test(indexContent)) {
    warnings.push(`会话来源待说明（无 raw）：${directory.name}`);
  }
  if (!names.some((name) => /^标注.*\.md$/u.test(name)) && !/^annotation_state:\s*(annotation-pending|annotation-unavailable-without-raw)/mu.test(indexContent)) {
    warnings.push(`会话认识层待说明（无标注）：${directory.name}`);
  }
}

// 6. 只报告受 Git 跟踪内容里的密钥样式，不显示实际值。本轮不清理历史。
const secretPatterns = [
  /fe_oa_[A-Za-z0-9]{20,}/gu,
  /AIza[0-9A-Za-z_-]{20,}/gu,
  /gh[pousr]_[A-Za-z0-9]{20,}/gu,
  /sk-[A-Za-z0-9_-]{20,}/gu,
];
const readableExtensions = new Set([".md", ".json", ".jsonl", ".yaml", ".yml", ".toml", ".py", ".js", ".ts", ".ps1", ".txt"]);
try {
  const tracked = execFileSync("git", ["-C", vaultRoot, "-c", "core.quotepath=false", "ls-files"], { encoding: "utf8" })
    .split(/\r?\n/u)
    .filter(Boolean);
  for (const relative of tracked) {
    if (!/^(AI\/|10 Projects\/|HOME\.md$|AI\.md$|AGENTS\.md$|CLAUDE\.md$)/u.test(relative)) continue;
    const absolute = path.join(vaultRoot, ...relative.split("/"));
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || !readableExtensions.has(path.extname(absolute).toLowerCase())) continue;
    let content;
    try { content = fs.readFileSync(absolute, "utf8"); } catch { continue; }
    const count = secretPatterns.reduce((total, pattern) => total + [...content.matchAll(pattern)].length, 0);
    if (count > 0) warnings.push(`Git 跟踪文件含 ${count} 个密钥样式（未显示内容）：${relative}`);
  }
} catch (error) {
  warnings.push(`无法执行 Git 跟踪文件检查：${error.message}`);
}

console.log(`\nErrors: ${errors.length}`);
for (const message of errors) console.log(`  [ERROR] ${message}`);
console.log(`Warnings: ${warnings.length}`);
for (const message of warnings) console.log(`  [WARN]  ${message}`);

if (errors.length > 0) process.exit(1);
console.log("Vault structure checks passed.");
