import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { releaseConfig } from "./release.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const tmpDir = resolve(rootDir, "tmp");
const releaseDir = resolve(rootDir, "artifacts", "release");
const componentSourceDir = resolve(rootDir, "extension", "packages", "com_pdfzusmerge");
const pluginSourceDir = resolve(rootDir, "extension", "packages", "plg_content_pdfzusmerge");
const packageSourceDir = resolve(rootDir, "extension", "package");
const packagedComponentDir = resolve(packageSourceDir, "packages", "com_pdfzusmerge");
const packagedPluginDir = resolve(packageSourceDir, "packages", "plg_content_pdfzusmerge");
const componentZipName = `${releaseConfig.componentName}_v${releaseConfig.version}.zip`;
const pluginZipName = `${releaseConfig.pluginName}_v${releaseConfig.version}.zip`;
const packageZipName = `${releaseConfig.packageName}_v${releaseConfig.version}.zip`;
const componentZipPath = resolve(releaseDir, componentZipName);
const pluginZipPath = resolve(releaseDir, pluginZipName);
const packageZipPath = resolve(releaseDir, packageZipName);

const runZip = (cwd, outputPath) => {
  rmSync(outputPath, { force: true });
  execFileSync("zip", ["-rq", outputPath, "."], { cwd, stdio: "inherit" });
};

mkdirSync(tmpDir, { recursive: true });
mkdirSync(releaseDir, { recursive: true });
mkdirSync(packagedComponentDir, { recursive: true });
mkdirSync(packagedPluginDir, { recursive: true });

if (!existsSync(resolve(componentSourceDir, "media", "com_pdfzusmerge", "app.js"))) {
  throw new Error("Frontend-Assets fehlen im Komponentenpaket. Bitte zuerst pnpm build:assets ausfuehren.");
}

runZip(componentSourceDir, componentZipPath);
runZip(pluginSourceDir, pluginZipPath);

copyFileSync(componentZipPath, resolve(packagedComponentDir, componentZipName));
copyFileSync(pluginZipPath, resolve(packagedPluginDir, pluginZipName));

runZip(packageSourceDir, packageZipPath);

