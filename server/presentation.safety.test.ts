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

  it("resolves visual assets to portable public images bundled in client/public/images", () => {
    const assets = readProjectFile("client/src/assets.ts");
    const assetFiles = [...assets.matchAll(/images\/([^`'"]+\.(?:jpg|png|svg))/g)].map((m) => m[1]);

    expect(assetFiles.length).toBeGreaterThan(15);
    for (const filename of assetFiles) {
      const exists = fs.existsSync(path.join(projectRoot, "client/public/images", filename));
      expect(exists).toBe(true);
    }
  });

  it("uses a trimmed GitHub Pages router base and generates an SPA fallback", () => {
    const app = readProjectFile("client/src/App.tsx");
    const packageJson = readProjectFile("package.json");

    expect(app).toContain('import.meta.env.BASE_URL.replace(/\\/+$/, "")');
    expect(packageJson).toContain('cp dist/public/index.html dist/public/404.html');
  });

  it("renders static contest and report data when GitHub Pages has no server API", () => {
    const contestPage = readProjectFile("client/src/pages/ContestPage.tsx");
    const reportPage = readProjectFile("client/src/pages/ReportPage.tsx");

    expect(contestPage).toContain("COMPETITIONS_DATA");
    expect(reportPage).toContain("REPORTS_DATA");
    expect(contestPage).toContain("hostname.endsWith('github.io')");
    expect(reportPage).toContain("hostname.endsWith('github.io')");
  });
});
