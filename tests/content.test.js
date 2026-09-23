import test from "node:test";
import assert from "node:assert/strict";
import {
  videoId,
  playlistId,
  thumbnail,
  validateCatalog,
} from "../src/utils/youtube.js";
import * as data from "../src/data/catalog.js";
test("extracts common YouTube formats", () => {
  for (const url of [
    "https://youtu.be/abcdefghijk",
    "https://www.youtube.com/watch?v=abcdefghijk&t=30",
    "https://m.youtube.com/shorts/abcdefghijk",
    "https://www.youtube.com/live/abcdefghijk",
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  ])
    assert.equal(videoId(url), "abcdefghijk");
  assert.equal(
    playlistId("https://www.youtube.com/playlist?list=PLabcdefghijklmnop"),
    "PLabcdefghijklmnop",
  );
});
test("rejects malformed and impersonated sources", () => {
  for (const url of [
    "https://youtube.com.evil.test/watch?v=abcdefghijk",
    "javascript:abcdefghijk",
    "https://evil.test/abcdefghijk",
    "https://youtu.be/not-valid",
    "http://youtube.com/watch?v=abcdefghijk",
  ])
    assert.equal(videoId(url), "");
  assert.equal(thumbnail(""), "");
  assert.equal(playlistId("invalid"), "");
});
test("all seed directories are valid and no draft media is published", () => {
  assert.deepEqual(validateCatalog(data), []);
  assert.equal(data.classes.length, 7);
  assert.equal(data.liveLessons.length, 0);
  assert.equal(data.liveCourses.length, 0);
  for (const c of data.classes)
    assert.ok(data.subjects.some((s) => s.classId === c.id));
});
test("detects orphan records and missing source attribution", () => {
  assert.ok(
    validateCatalog({
      lessons: [
        { id: "a", published: true, courseId: "missing", youtubeUrl: "bad" },
      ],
    }).length >= 3,
  );
});
