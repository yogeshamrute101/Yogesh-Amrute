import fs from "fs";

const required = [
  "src/core/universal",
  "src/core/autonomous",
  "src/core/VidoAIControlPlane.ts",
  "src/components/MasterCommandCenter.tsx",
  "server.ts",
  "package.json"
];

let failed = false;

for (const item of required) {
  if (fs.existsSync(item)) {
    console.log(`PASS ${item}`);
  } else {
    console.log(`FAIL ${item}`);
    failed = true;
  }
}

const pkg = JSON.parse(
  fs.readFileSync("package.json", "utf8")
);

for (const script of ["build", "lint"]) {
  if (pkg.scripts?.[script]) {
    console.log(`PASS npm script: ${script}`);
  } else {
    console.log(`FAIL npm script: ${script}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
