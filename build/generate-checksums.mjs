import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const releaseDir = resolve(rootDir, "artifacts", "release");
const checksumPath = resolve(releaseDir, "SHA512SUMS");

mkdirSync(releaseDir, { recursive: true });

const files = readdirSync(releaseDir)
  .filter((fileName) => !fileName.endsWith("SHA512SUMS"))
  .sort();

const lines = files.map((fileName) => {
  const filePath = resolve(releaseDir, fileName);
  const hash = createHash("sha512").update(readFileSync(filePath)).digest("hex");

  return `${hash}  ${fileName}`;
});

writeFileSync(checksumPath, `${lines.join("\n")}\n`, "utf8");
