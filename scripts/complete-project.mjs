import { execSync } from "node:child_process";
import { existsSync, appendFileSync } from "node:fs";

const run = (name, command) => {
  console.log(`\n=== ${name} ===`);
  try {
    execSync(command, { stdio: "inherit", shell: true });
    return true;
  } catch {
    console.log(`FAILED: ${name}`);
    return false;
  }
};

const parallel = async (jobs) => {
  await Promise.all(
    jobs.map(
      ({ name, command }) =>
        new Promise((resolve) => resolve(run(name, command)))
    )
  );
};

console.log("VidoAI Project Completion Orchestrator");

await parallel([
  {
    name: "TypeScript source inventory",
    command: "find src -type f \\( -name '*.ts' -o -name '*.tsx' \\) | sort > /tmp/vidoai-ts-files.txt"
  },
  {
    name: "Documentation inventory",
    command: "find docs -type f 2>/dev/null | sort > /tmp/vidoai-doc-files.txt || true"
  },
  {
    name: "Git status",
    command: "git status --short"
  }
]);

const lintOK = run("TypeScript validation", "npm run lint");
const buildOK = lintOK && run("Production build", "npm run build");

if (!lintOK || !buildOK) {
  appendFileSync(
    "docs/PROJECT_COMPLETION_STATUS.md",
    `\n${new Date().toISOString()} — Validation failed. Manual/code-assisted repair required before completion.\n`
  );
  process.exitCode = 1;
  process.exit();
}

run(
  "Project health summary",
  "node -e \"console.log(JSON.stringify({status:'VALIDATED',time:new Date().toISOString(),lint:true,build:true},null,2))\""
);

appendFileSync(
  "docs/PROJECT_COMPLETION_STATUS.md",
  `\n${new Date().toISOString()} — Lint and production build passed.\n`
);

console.log("\nPROJECT VALIDATION COMPLETE.");
