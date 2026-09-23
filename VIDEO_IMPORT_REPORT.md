# Official video archive import

Imported all 149 supplied video records without changing any fields in the source JSON. Categories and university tags follow the supplied categorization. These videos live independently of class courses; no admission video has been assigned to Classes 6–12.

## Routes

- `/videos`: category cards, title/category/tag search, category and university filters, minimum-view filter, four sort choices, and URL-backed pagination.
- `/videos/category/:categorySlug`: the same browser restricted to a category.
- `/videos/:videoId`: privacy-enhanced player, source attribution, original YouTube link, category, snapshot views, duration, related videos, and previous/next navigation.

The homepage now shows six selected official videos, with a link to the archive. Videos is also linked in desktop/mobile navigation and the footer. Existing branding and course routes remain intact.

## Counts derived from published records

| Category                          | Videos |
| --------------------------------- | -----: |
| Merit, Subject Choice & Migration |     96 |
| GST Application & Updates         |     10 |
| GST Reporting & Final Admission   |     10 |
| University Admission Guidance     |      2 |
| Medical Admission                 |      2 |
| Results & Result Checking         |      1 |
| School & College Academic         |     20 |
| Islamic & Cultural                |      4 |
| General, Creative & Miscellaneous |      4 |
| Total                             |    149 |

## Files

Added `src/data/amader-youtube-videos-categorized.json`, `src/data/videos.js`, `src/components/OfficialVideoCard.jsx`, `src/pages/Videos.jsx`, `tests/videos.test.js`, and `tests/browser/videos.spec.js`.

Updated `src/main.jsx`, `src/layouts/Layout.jsx`, `src/pages/Home.jsx`, `src/styles.css`, `scripts/sitemap.js`, and `vite.config.js` to connect navigation, routes, presentation, sitemap entries, content validation, and a separate archive-data chunk. README documents content maintenance; this report records the import.

## Validation and limits

The supplied JSON has 149 unique valid YouTube IDs, matching watch URLs, recognized categories, and consistent official-source attribution. The imported file is byte-identical to the supplied JSON. The CSV also contains 149 records and is not required at runtime. View counts are dataset snapshots, not current YouTube statistics. Newest/oldest sorting follows the supplied `order`, not inferred publication dates.

Unit tests cover category totals, combined filters, Bengali search, all sort modes, lookup, optional metadata, and invalid data. Browser checks cover pagination, URL persistence, category/detail deep links, previous/next links, unavailable thumbnails, unknown routes, responsive widths from 320px, and accessibility in light/dark themes. Embed tests use isolated responses rather than attempting to play real YouTube media. Live availability and embedding permission can change independently of this application; visible YouTube fallback links remain available.

`npm run build` passes without new warnings. The archive data is a separate ~91 KB raw / ~11 KB gzip chunk. No new dependencies, backend, API key, video downloading, or deployment were added. No lint command is configured in the project.
