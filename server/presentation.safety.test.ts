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

  it("keeps the light hero and catalog stable before the full desktop breakpoint with guaranteed contrast", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain("hidden xl:flex");
    expect(home).toContain("xl:hidden p-2");
    expect(home).toContain("grid grid-cols-1 xl:grid-cols-12");
    expect(home).toContain("grid grid-cols-2 lg:grid-cols-4");
    expect(home).toContain("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3");
    expect(home).toContain('light-artcode min-h-screen');
    expect(home).toContain("backgroundColor: isSelected ? '#d97706' : '#ffffff'");
    expect(home).toContain("color: isSelected ? '#172554' : '#1e3a8a'");
    expect(home).toContain("borderColor: isSelected ? '#d97706' : '#cbd5e1'");
    expect(home).not.toContain("bg-[#060913]");
    expect(home).toContain("Search className");
  });

  it("enforces distinct dark navy typography (#172554 / text-blue-950) instead of pure black", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");
    const contestPage = readProjectFile("client/src/pages/ContestPage.tsx");
    const reportPage = readProjectFile("client/src/pages/ReportPage.tsx");
    const adminPage = readProjectFile("client/src/pages/Admin.tsx");
    const notFoundPage = readProjectFile("client/src/pages/NotFound.tsx");
    const modal = readProjectFile("client/src/components/ApplicationModal.tsx");
    const styles = readProjectFile("client/src/index.css");

    // All public headings and body use distinct navy tokens
    expect(home).toContain("text-blue-950");
    expect(contestPage).toContain("text-blue-950");
    expect(reportPage).toContain("text-blue-950");
    expect(adminPage).toContain("text-blue-950");
    expect(notFoundPage).toContain("text-blue-950");
    expect(modal).toContain("text-blue-950");

    // CSS variables mandate #172554 (visible navy blue, not #000000)
    expect(styles).toContain("--foreground: #172554;");
    expect(styles).toContain("color: #172554 !important;");

    // Never use pure black text or text-slate-950
    expect(home).not.toContain("text-slate-950");
    expect(contestPage).not.toContain("text-slate-950");
    expect(reportPage).not.toContain("text-slate-950");
    expect(adminPage).not.toContain("text-slate-950");
    expect(adminPage).not.toContain("text-slate-900");
    expect(adminPage).not.toContain("text-slate-800");
    expect(notFoundPage).not.toContain("text-slate-950");
    expect(notFoundPage).not.toContain("text-slate-900");
    expect(modal).not.toContain("text-slate-950");
  });

  it("prevents light public pages from shipping white or pale text on light surfaces", () => {
    const publicViews = [
      "client/src/pages/Home.tsx",
      "client/src/pages/ContestPage.tsx",
      "client/src/pages/ReportPage.tsx",
      "client/src/components/ApplicationModal.tsx",
    ].map(readProjectFile);
    const styles = readProjectFile("client/src/index.css");

    for (const view of publicViews) {
      expect(view).not.toContain("text-white");
      expect(view).not.toContain("text-amber-200");
    }
    expect(styles).toContain(".light-artcode .button-motion");
    expect(styles).toContain("color: #172554 !important");
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

  it("uses a trimmed GitHub Pages router base and generates static entry points", () => {
    const app = readProjectFile("client/src/App.tsx");
    const packageJson = readProjectFile("package.json");
    const routeGenerator = readProjectFile("scripts/generate-github-pages-routes.mjs");

    expect(app).toContain('import.meta.env.BASE_URL.replace(/\\/+$/, "")');
    expect(packageJson).toContain('node scripts/generate-github-pages-routes.mjs');
    expect(routeGenerator).toContain('"contest/misteriya-zvuka"');
    expect(routeGenerator).toContain('"report/itogi-artcode-12-01-26-01"');
    expect(routeGenerator).toContain('"404.html"');
  });

  it("renders static contest and report data when GitHub Pages has no server API", () => {
    const contestPage = readProjectFile("client/src/pages/ContestPage.tsx");
    const reportPage = readProjectFile("client/src/pages/ReportPage.tsx");

    expect(contestPage).toContain("COMPETITIONS_DATA");
    expect(reportPage).toContain("REPORTS_DATA");
    expect(contestPage).toContain("hostname.endsWith('github.io')");
    expect(reportPage).toContain("hostname.endsWith('github.io')");
    expect(contestPage).toContain("staticRegulations");
    expect(contestPage).toContain("juryNames: staticContest.juryList.join(' | ')");
  });
});
