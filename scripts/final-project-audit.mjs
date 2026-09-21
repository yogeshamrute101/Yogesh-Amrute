import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const results = [];

function check(name, command) {
  try {
    execSync(command, { stdio: "pipe", shell: true });
    results.push({ name, status: "PASS" });
  } catch (e) {
    results.push({
      name,
      status: "FAIL",
      detail: String(e.stdout || e.stderr || e.message).slice(0, 1500)
    });
  }
}

check("Git repository", "git rev-parse --is-inside-work-tree");
check("Dependencies", "npm ls --depth=0");
check("TypeScript", "npm run lint");
check("Production build", "npm run build");
check("TypeScript direct check", "npx tsc --noEmit --pretty false");

const sourceCount = Number(
  execSync(
    "find src server -type f \\( -name '*.ts' -o -name '*.tsx' \\) 2>/dev/null | wc -l",
    { encoding: "utf8", shell: true }
  ).trim()
) || 0;

const coreCount = Number(
  execSync(
    "find src/core -type f 2>/dev/null | wc -l",
    { encoding: "utf8", shell: true }
  ).trim()
) || 0;

const report = {
  generatedAt: new Date().toISOString(),
  sourceFiles: sourceCount,
  coreFiles: coreCount,
  checks: results,
  releaseGate: results.every((r) => r.status === "PASS")
    ? "PASS"
    : "BLOCKED",
  requiredNextActions: results
    .filter((r) => r.status === "FAIL")
    .map((r) => r.name)
};

writeFileSync(
  "docs/project-health/FINAL_PROJECT_AUDIT.json",
  JSON.stringify(report, null, 2)
);

writeFileSync(
  "docs/project-health/FINAL_PROJECT_AUDIT.md",
  `# Final Project Audit

Generated: ${report.generatedAt}

## Release Gate

**${report.releaseGate}**

## Checks

${results.map((r) =>
  `- ${r.status === "PASS" ? "✅" : "❌"} ${r.name}`
).join("\n")}

## Project Size

- Source files: ${sourceCount}
- Core files: ${coreCount}

## Required Next Actions

${
  report.requiredNextActions.length
    ? report.requiredNextActions.map((x) => `- ${x}`).join("\n")
    : "- None detected by automated checks."
}

## Architecture Goal

Human Command
→ Frontline
→ MasterMind
→ Multi-Tasking
→ Capability/Resource Control
→ Execution
→ Safety/Security
→ Verification
→ Recovery
→ Learning
→ 24×7 Monitoring
`
);

console.log("");
console.log("======================================");
console.log("       VIDOAI FINAL PROJECT AUDIT");
console.log("======================================");
console.log(`Release Gate: ${report.releaseGate}`);
console.log(`Source files: ${sourceCount}`);
console.log(`Core files: ${coreCount}`);
console.log("");

for (const result of results) {
  console.log(
    `${result.status === "PASS" ? "PASS" : "FAIL"}  ${result.name}`
  );
}

console.log("");
console.log("Report:");
console.log("docs/project-health/FINAL_PROJECT_AUDIT.md");
