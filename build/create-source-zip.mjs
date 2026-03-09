import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, rmSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const outputDir = resolve(rootDir, "artifacts", "source");
const outputFile = resolve(outputDir, "joomla-extension-pdf-zusammenfuegen-source.zip");

mkdirSync(outputDir, { recursive: true });
rmSync(outputFile, { force: true });

execFileSync(
  "zip",
  [
    "-rq",
    outputFile,
    ".",
    "-x",
    "node_modules/*",
    "dist/*",
    "tmp/*",
    "artifacts/release/*",
    "artifacts/source/*",
    ".git/*",
    ".DS_Store"
  ],
  {
    cwd: rootDir,
    stdio: "inherit"
  }
);

