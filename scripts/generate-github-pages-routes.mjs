import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");
const publicDir = path.join(projectRoot, "dist", "public");
const entryHtml = path.join(publicDir, "index.html");

const routes = [
  "contest/misteriya-zvuka",
  "contest/tantsy-triumph",
  "contest/mir-teatra",
  "contest/muzykalnaya-shkatulka",
  "contest/new-circus",
  "contest/art-hit",
  "report/itogi-artcode-30-11-14-12",
  "report/itogi-artcode-17-12-10-01",
  "report/itogi-artcode-12-01-26-01",
];

if (!fs.existsSync(entryHtml)) {
  throw new Error(`Missing built entry HTML: ${entryHtml}`);
}

for (const route of routes) {
  const routeDirectory = path.join(publicDir, route);
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.copyFileSync(entryHtml, path.join(routeDirectory, "index.html"));
}

fs.copyFileSync(entryHtml, path.join(publicDir, "404.html"));
console.log(`Generated ${routes.length} static GitHub Pages route entry points and 404 fallback.`);
