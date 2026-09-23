# Adding learning content

Edit `src/data/catalog.js`. Use `src/data/course-data.template.json` as the field reference; do not publish its example titles or empty URLs. Keep IDs unique across the entire catalog and use unique URL-safe slugs (lowercase words separated by hyphens) within each resource type; lesson slugs must be unique within their course.

## 1. Class and group

The `classes` array currently generates Classes 6–12. Add or update a record with `id`, `slug`, `name`, `nameBn`, numeric `order`, and `groups`. Supported group values are `general`, `science`, `business-studies`, and `humanities`. The order drives class-card numbers and sorting. Class directories are visible even when empty.

## 2. Subject

Add a record to `subjects` with `id`, `slug`, `classId`, `group`, `name`, `nameBn`, `description`, and `courseIds`. The current array generates general subject placeholders; extend that generation or append explicit records. Each subject belongs to a single class and group. Add group-specific subjects only when you have confirmed their classification. No curriculum completeness is claimed by the initial directories.

## 3. Course

Append a record to `courses` with `id`, `slug`, `classId`, `subjectId`, `group`, `title`, `titleBn`, `description`, `thumbnail`, `featured`, `published`, `chapterIds`, and `playlistIds`. Optional fields include `attribution`, `tags`, and `publishedAt` (ISO date for newest sorting). Set `published:false` while editing. Never add imaginary instructors, statistics, ratings, or testimonials.

## 4. Chapter

Append a record to `chapters` with `id`, `courseId`, `slug`, `number`, `title`, `titleBn`, and `lessonIds`. Keep chapter numbers in teaching order and list chapter records in the desired display order. A chapter is discoverable only when its parent course is published.

## 5. Lesson

Append a record to `lessons` using every field in the supplied template. Set `courseId` and `chapterId` to existing records. Use a real HTTPS `youtubeUrl` in watch, youtu.be, shorts, live, or embed format, or a valid `youtubeVideoId`. Keep lesson `order` unique within the course. Include the source channel, channel URL, attribution, and license status. Optional `instructor`, `duration`, `thumbnail`, and `tags` should contain confirmed facts only. Empty optional fields are acceptable. Thumbnails can be generated through `thumbnail()` in `src/utils/youtube.js` only for a valid video ID.

A lesson becomes visible only when both it and its parent course have `published:true`. Preview `/courses/your-course-slug` and `/learn/your-course-slug/your-lesson-slug` after publication locally. Verify the actual video permits embedding before uploading the new build. Check previous/next order, chapter placement, completion, notes, and attribution.

## 6. Official source

Use `sourceType:'official'` only after confirming the upload belongs to `https://www.youtube.com/@amader_online_school` (channel ID `UC3tE_x8F91uYlzvkSM1jxVA`). Set `sourceChannel:'Amader Online School'`, its channel URL, and a plain attribution such as “Video embedded from Amader Online School on YouTube.” A video URL alone does not prove its channel identity.

## 7. Third-party source

Use `sourceType:'third-party'`, the creator’s actual channel name and URL, the original video URL, and explicit attribution. Ownership remains with that creator. Use `licenseStatus:'not-verified'` unless you have checked the license. Set a Creative Commons label only when verified and retain verification details in the record. Do not assume public visibility grants reuse rights. Never download, proxy, scrape, or rehost videos.

## 8. Playlist

Add a record to `playlists` using the template, with `classId`, `subjectId`, optional `group`, optional `courseId`, source details, `featured`, and `published`. For a YouTube playlist supply its URL or `youtubePlaylistId`. For a locally curated collection, provide `lessonIds` referencing published lessons. Explicit `lessonIds` define the collection; otherwise lessons come from the linked course. YouTube-only playlists may have no locally indexed lessons because the site does not fetch or scrape YouTube metadata.

## Publish checklist

Run `npm test` and `npm run build`. Build validation rejects duplicate IDs, orphan parent references, invalid published YouTube links, repeated YouTube IDs, and missing published attribution. Check titles and translated text manually, confirm licenses and channel identity at the source, and confirm embeddings work. Keep public data free of secrets. Rebuild and publish through your chosen static host.

## Settings and local features

The `site` export in `src/data/catalog.js` centralizes editable contact fields and brand information. Supply an email to enable preparing a mailto message; the form never submits to a backend. Progress, bookmarks, notes, theme, and recent history are saved under `aos:v1:learning` on the learner’s device. They do not sync. Clearing local data removes those preferences and activity.

## Independent official-video archive

Admission and other channel videos are maintained separately in `src/data/amader-youtube-videos-categorized.json`, not in class lesson records. See the “Official YouTube archive” section of README for category assignment, ordering, optional fields, and validation. See `VIDEO_IMPORT_REPORT.md` for the imported category counts and new routes.
