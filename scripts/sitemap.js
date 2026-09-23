import { writeFileSync, rmSync } from "node:fs";
import * as catalog from "../src/data/catalog.js";
import { validateCatalog } from "../src/utils/youtube.js";
import {
  officialVideos,
  videoCategories,
  validateVideoDataset,
} from "../src/data/videos.js";
const errors = [...validateCatalog(catalog), ...validateVideoDataset()];
if (errors.length) throw new Error(errors.join("\n"));
const origin = process.env.SITE_URL;
const routes = [
  "",
  "classes",
  "courses",
  "playlists",
  "videos",
  ...videoCategories.map((c) => `videos/category/${c.slug}`),
  ...officialVideos.map((v) => `videos/${v.id}`),
  "about",
  "founder",
  "contact",
  "privacy",
  "terms",
  "attribution",
  ...catalog.classes.map((x) => `classes/${x.slug}`),
  ...catalog.subjects.map((x) => `subjects/${x.slug}`),
  ...catalog.liveCourses.map((x) => `courses/${x.slug}`),
  ...catalog.livePlaylists.map((x) => `playlists/${x.slug}`),
  ...catalog.liveLessons.map((x) => catalog.lessonPath(x).slice(1)),
];
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
if (origin) {
  const base = new URL(origin);
  if (
    base.protocol !== "https:" ||
    base.pathname !== "/" ||
    base.search ||
    base.hash
  )
    throw new Error(
      "SITE_URL must be an HTTPS origin, e.g. https://school.example",
    );
  writeFileSync(
    "public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${escape(new URL(r, base).href)}</loc></url>`).join("")}</urlset>`,
  );
  writeFileSync(
    "public/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${base.origin}/sitemap.xml\n`,
  );
} else {
  rmSync("public/sitemap.xml", { force: true });
  writeFileSync("public/robots.txt", "User-agent: *\nAllow: /\n");
  console.log(
    "SITE_URL unset: canonical and sitemap are deferred until the production domain is known.",
  );
}
