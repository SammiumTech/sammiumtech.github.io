import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const registryPath = resolve(root, "apps/portfolio/src/data/flagshipProjects.ts");
const cardsPath = resolve(root, "apps/portfolio/src/components/FlagshipProjects.tsx");
const experiencePath = resolve(root, "apps/portfolio/src/components/FlagshipProjectExperience.tsx");
const previewPath = resolve(root, "apps/portfolio/public/previews/aetherverse.webp");
const aetherGridPreviewPath = resolve(root, "apps/portfolio/public/previews/aether-grid-beta.webp");

const [registry, cards, experience, preview, aetherGridPreview] = await Promise.all([
  readFile(registryPath, "utf8"),
  readFile(cardsPath, "utf8"),
  readFile(experiencePath, "utf8"),
  stat(previewPath),
  stat(aetherGridPreviewPath),
]);

const assertions = [
  [registry.includes('slug: "aetherverse"'), "AetherVerse registry entry exists"],
  [registry.includes('https://sammium-aetherverse.onrender.com'), "Live Render URL is registered"],
  [registry.includes('https://github.com/zelop301/sammium-aetherverse'), "GitHub source URL is registered"],
  [registry.includes('slug: "aether-grid"'), "Aether Grid registry entry exists"],
  [registry.includes("https://zelop301.github.io/aether-grid-phase23/"), "Aether Grid live beta URL is registered"],
  [registry.includes("https://github.com/zelop301/aether-grid-phase23"), "Aether Grid GitHub source URL is registered"],
  [registry.includes('status: "Public Beta"'), "Public Beta status is supported"],
  [(registry.match(/slug:\s*"/g) ?? []).length === 10, "Ten flagship project entries are present"],
  [cards.includes("flagshipProjects.length"), "Project heading uses the dynamic registry count"],
  [cards.includes('padStart(2, "0")'), "Project numbering supports Project 09 and beyond"],
  [cards.includes("project.sourcePath"), "Project cards expose source-code links"],
  [experience.includes("project.deploymentNote"), "Live deployment messaging is supported"],
  [experience.includes("project.sourcePath"), "Full-screen experience exposes the GitHub source link"],
  [preview.size > 0 && preview.size < 250_000, "AetherVerse preview exists and is below 250 KB"],
  [aetherGridPreview.size > 0 && aetherGridPreview.size < 250_000, "Aether Grid preview exists and is below 250 KB"],
];

const failed = assertions.filter(([passed]) => !passed);
for (const [passed, label] of assertions) {
  console.log(`${passed ? "PASS" : "FAIL"} ${label}`);
}

if (failed.length) {
  process.exitCode = 1;
} else {
  console.log("AetherVerse and Aether Grid portfolio integration validation passed.");
}
