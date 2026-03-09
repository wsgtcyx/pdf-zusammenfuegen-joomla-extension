import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const distDir = resolve(rootDir, "dist", "frontend");
const targetDir = resolve(
  rootDir,
  "extension",
  "packages",
  "com_pdfzusmerge",
  "media",
  "com_pdfzusmerge"
);

const requiredFiles = ["app.js", "app.css"];

mkdirSync(targetDir, { recursive: true });

for (const fileName of requiredFiles) {
  const sourcePath = resolve(distDir, fileName);

  if (!existsSync(sourcePath)) {
    throw new Error(`Frontend-Datei fehlt: ${sourcePath}`);
  }

  rmSync(resolve(targetDir, fileName), { force: true });
  copyFileSync(sourcePath, resolve(targetDir, fileName));
}

