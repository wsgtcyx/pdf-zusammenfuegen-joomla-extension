import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { releaseConfig } from "./release.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const releaseDir = resolve(rootDir, "artifacts", "release");
const packageZipName = `${releaseConfig.packageName}_v${releaseConfig.version}.zip`;
const packageZipPath = resolve(releaseDir, packageZipName);
const manifestPath = resolve(rootDir, "manifest.xml");
const releaseManifestPath = resolve(releaseDir, "manifest.xml");

const fileBuffer = readFileSync(packageZipPath);
const checksum = createHash("sha512").update(fileBuffer).digest("hex");
const downloadUrl = `https://github.com/${releaseConfig.githubRepository}/releases/download/${releaseConfig.releaseTag}/${packageZipName}`;
const infoUrl = `https://github.com/${releaseConfig.githubRepository}/releases/tag/${releaseConfig.releaseTag}`;

const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<updates>
  <update>
    <name>${releaseConfig.extensionName}</name>
    <description>Joomla-Paket fuer lokales PDF-Zusammenfuegen mit Frontend-Komponente und Content-Plugin.</description>
    <element>${releaseConfig.packageName}</element>
    <type>package</type>
    <version>${releaseConfig.version}</version>
    <client>site</client>
    <infourl title="${releaseConfig.extensionName}">${infoUrl}</infourl>
    <downloads>
      <downloadurl type="full" format="zip">${downloadUrl}</downloadurl>
    </downloads>
    <sha512>${checksum}</sha512>
    <targetplatform name="joomla" version="${releaseConfig.targetPlatformVersion}" />
  </update>
</updates>
`;

mkdirSync(releaseDir, { recursive: true });
writeFileSync(manifestPath, manifestContent);
copyFileSync(manifestPath, releaseManifestPath);

