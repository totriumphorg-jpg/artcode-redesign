import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) =>
  fs.readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("public presentation safety", () => {
  it("does not inject the editor runtime into the application HTML", () => {
    const viteConfig = readProjectFile("vite.config.ts");

    expect(viteConfig).not.toMatch(/from\s+["']vite-plugin-manus-runtime["']/);
    expect(viteConfig).not.toMatch(/vitePluginManusRuntime\s*\(/);
    expect(viteConfig).not.toContain("manus-content-root");
  });

  it("uses non-cropping image presentation for public competition and jury photos", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const contestPage = readProjectFile("client/src/pages/ContestPage.tsx");

    expect(home).toContain("object-contain");
    expect(contestPage).toContain("object-contain");
    expect(home).not.toContain("object-cover");
    expect(contestPage).not.toContain("object-cover");
  });

  it("keeps visual asset URLs on the production storage proxy", () => {
    const assets = readProjectFile("client/src/assets.ts");
    const assetUrls = [...assets.matchAll(/'([^']+\.(?:jpg|png|svg))'/g)].map((match) => match[1]);

    expect(assetUrls.length).toBeGreaterThan(10);
    expect(assetUrls.every((url) => url.startsWith("/manus-storage/"))).toBe(true);
  });
});
