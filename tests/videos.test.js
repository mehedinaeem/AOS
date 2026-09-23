import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  officialVideos,
  videoCategories,
  videosByCategory,
  getVideoById,
  filterVideos,
  featuredVideos,
  validateVideoDataset,
  formatDuration,
  formatViews,
} from "../src/data/videos.js";
const source = JSON.parse(
  readFileSync(
    new URL(
      "../src/data/amader-youtube-videos-categorized.json",
      import.meta.url,
    ),
  ),
);
test("the supplied official archive is valid, complete, and counted from records", () => {
  assert.deepEqual(validateVideoDataset(), []);
  assert.equal(officialVideos.length, 149);
  assert.equal(new Set(officialVideos.map((v) => v.id)).size, 149);
  assert.equal(
    videoCategories.reduce((sum, c) => sum + c.count, 0),
    149,
  );
  for (const c of videoCategories) {
    assert.equal(c.count, videosByCategory[c.slug].length);
    assert.equal(
      c.count,
      source.categories.find((x) => x.slug === c.slug).count,
    );
  }
  assert.ok(officialVideos.every((v) => !v.classId && !v.courseId));
});
test("combined filters, Bengali search, and all sort orders preserve dataset semantics", () => {
  assert.equal(filterVideos({ category: "medical-admission" }).length, 2);
  const results = filterVideos({
    category: "merit-subject-migration",
    university: "jkkniu",
    minViews: 500,
  });
  assert.ok(results.length);
  assert.ok(
    results.every(
      (v) =>
        v.categorySlug === "merit-subject-migration" &&
        v.universityTags.includes("jkkniu") &&
        v.viewCount >= 500,
    ),
  );
  assert.ok(filterVideos({ query: "অ্যাসাইনমেন্ট" }).length);
  assert.equal(filterVideos()[0].order, 1);
  assert.equal(filterVideos({ sort: "oldest" })[0].order, 149);
  for (const sort of ["most-viewed", "least-viewed"]) {
    const list = filterVideos({ sort });
    assert.ok(
      list.every(
        (v, i) =>
          i === 0 ||
          (sort === "most-viewed"
            ? list[i - 1].viewCount >= v.viewCount
            : list[i - 1].viewCount <= v.viewCount),
      ),
    );
  }
  assert.ok(filterVideos({ maxViews: 100 }).every((v) => v.viewCount <= 100));
  assert.equal(filterVideos({ query: "zzzz-no-match" }).length, 0);
});
test("lookup, featured selection, and optional metadata have safe fallbacks", () => {
  assert.equal(getVideoById("mSuRD2dQcUY").order, 1);
  assert.equal(getVideoById("invalid"), undefined);
  assert.equal(featuredVideos.length, 6);
  assert.equal(new Set(featuredVideos.map((v) => v.categorySlug)).size, 6);
  assert.equal(formatDuration(null), "");
  assert.equal(formatDuration(0), "");
  assert.equal(formatDuration(318), "5:18");
  assert.equal(formatDuration(3661), "1:01:01");
  assert.equal(formatViews(null), "Views unavailable");
  assert.equal(formatViews(0), "0 views");
});
test("invalid IDs, duplicate IDs, URL mismatches, and unknown categories fail validation", () => {
  const broken = structuredClone(source);
  broken.videos.push({ ...broken.videos[0] });
  broken.videos[1].id = "bad";
  broken.videos[2].categorySlug = "missing";
  assert.ok(validateVideoDataset(broken).length >= 4);
});
