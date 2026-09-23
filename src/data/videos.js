import dataset from "./amader-youtube-videos-categorized.json" with { type: "json" };
import { videoId, thumbnail } from "../utils/youtube.js";

// Keep the supplied source untouched. Derived fields and counts live here.
export const channel = dataset.channel;
const categoryOrder = [
  "merit-subject-migration",
  "gst-application-updates",
  "gst-reporting-final-admission",
  "university-admission",
  "medical-admission",
  "results",
  "school-college-academic",
  "islamic-cultural",
  "general-misc",
];
export function validateVideoDataset(source = dataset) {
  const errors = [],
    seen = new Set();
  const categories = new Map(
    (source.categories || []).map((c) => [c.slug, c.name]),
  );
  for (const video of source.videos || []) {
    if (videoId(video.id) !== video.id || !video.id)
      errors.push(`Invalid video ID: ${video.id}`);
    if (seen.has(video.id)) errors.push(`Duplicate video ID: ${video.id}`);
    seen.add(video.id);
    if (videoId(video.url) !== video.id)
      errors.push(`URL/ID mismatch: ${video.id}`);
    if (
      !categories.has(video.categorySlug) ||
      categories.get(video.categorySlug) !== video.category
    )
      errors.push(`Unknown or mismatched category: ${video.id}`);
    if (typeof video.title !== "string" || !video.title.trim())
      errors.push(`Missing title: ${video.id}`);
    if (
      video.sourceType !== "official" ||
      video.sourceChannelUrl !== source.channel?.url ||
      video.sourceChannel !== source.channel?.name
    )
      errors.push(`Source mismatch: ${video.id}`);
  }
  return errors;
}
const seen = new Set();
export const officialVideos = (dataset.videos || [])
  .filter((v) => {
    if (
      !v.published ||
      v.sourceType !== "official" ||
      !v.id ||
      videoId(v.id) !== v.id ||
      seen.has(v.id) ||
      !dataset.categories.some((c) => c.slug === v.categorySlug)
    )
      return false;
    seen.add(v.id);
    return true;
  })
  .map((v) => ({
    ...v,
    thumbnail: thumbnail(v.id),
    viewCount:
      Number.isFinite(v.viewCount) && v.viewCount >= 0 ? v.viewCount : null,
    durationSeconds:
      Number.isFinite(v.durationSeconds) && v.durationSeconds > 0
        ? v.durationSeconds
        : null,
    universityTags: Array.isArray(v.universityTags) ? v.universityTags : [],
  }));
export const videoCategories = [...dataset.categories]
  .sort((a, b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug))
  .map((c) => ({
    ...c,
    count: officialVideos.filter((v) => v.categorySlug === c.slug).length,
  }));
export const videosByCategory = Object.fromEntries(
  videoCategories.map((c) => [
    c.slug,
    officialVideos.filter((v) => v.categorySlug === c.slug),
  ]),
);
export const universityTags = [
  ...new Set(officialVideos.flatMap((v) => v.universityTags)),
].sort();
export const getVideoById = (id) => officialVideos.find((v) => v.id === id);
export function filterVideos({
  category = "",
  university = "",
  query = "",
  minViews = null,
  maxViews = null,
  sort = "newest",
} = {}) {
  const text = query.trim().normalize("NFKC").toLocaleLowerCase();
  const videos = officialVideos.filter(
    (v) =>
      (!category || v.categorySlug === category) &&
      (!university || v.universityTags.includes(university)) &&
      (!text ||
        [v.title, v.category, ...v.universityTags]
          .join(" ")
          .normalize("NFKC")
          .toLocaleLowerCase()
          .includes(text)) &&
      (minViews === null ||
        (v.viewCount !== null && v.viewCount >= minViews)) &&
      (maxViews === null || (v.viewCount !== null && v.viewCount <= maxViews)),
  );
  return videos.sort((a, b) => {
    if (sort === "most-viewed" || sort === "least-viewed") {
      if (a.viewCount === null) return b.viewCount === null ? 0 : 1;
      if (b.viewCount === null) return -1;
      return (
        (sort === "most-viewed"
          ? b.viewCount - a.viewCount
          : a.viewCount - b.viewCount) || a.order - b.order
      );
    }
    return sort === "oldest" ? b.order - a.order : a.order - b.order;
  });
}
// One recent dataset entry per category creates a varied homepage selection.
export const featuredVideos = videoCategories
  .map((c) => filterVideos({ category: c.slug })[0])
  .filter(Boolean)
  .slice(0, 6);
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const n = Math.floor(seconds);
  return n >= 3600
    ? `${Math.floor(n / 3600)}:${String(Math.floor((n % 3600) / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`
    : `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
}
export const formatViews = (count) =>
  Number.isFinite(count) && count >= 0
    ? `${count.toLocaleString("en-US")} views`
    : "Views unavailable";
