const videoPattern = /^[a-zA-Z0-9_-]{11}$/;
const playlistPattern = /^(PL|UU|LL|FL|OLAK5uy_)[a-zA-Z0-9_-]{10,}$/;
function youtubeURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "music.youtube.com",
        "youtu.be",
        "www.youtube-nocookie.com",
        "youtube-nocookie.com",
      ].includes(url.hostname)
      ? url
      : null;
  } catch {
    return null;
  }
}
export function videoId(value = "") {
  if (videoPattern.test(value)) return value;
  const u = youtubeURL(value);
  if (!u) return "";
  const candidate =
    u.hostname === "youtu.be"
      ? u.pathname.slice(1)
      : u.searchParams.get("v") ||
        (/^\/(embed|shorts|live)\//.test(u.pathname)
          ? u.pathname.split("/")[2]
          : "");
  return videoPattern.test(candidate || "") ? candidate : "";
}
export function playlistId(value = "") {
  if (playlistPattern.test(value)) return value;
  const u = youtubeURL(value);
  const id = u?.searchParams.get("list") || "";
  return playlistPattern.test(id) ? id : "";
}
export const thumbnail = (value) =>
  videoId(value)
    ? `https://i.ytimg.com/vi/${videoId(value)}/hqdefault.jpg`
    : "";
export function validateCatalog(data) {
  const errors = [];
  const ids = new Set();
  const videos = new Set();
  const lists = new Set();
  const slugs = new Set();
  for (const type of [
    "classes",
    "subjects",
    "courses",
    "chapters",
    "lessons",
    "playlists",
  ])
    for (const item of data[type] || []) {
      if (!item.id || ids.has(item.id))
        errors.push(`${type}: missing or duplicate id ${item.id}`);
      ids.add(item.id);
      if (!item.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug))
        errors.push(`${item.id}: invalid slug`);
      const slugKey = `${type}:${["lessons", "chapters"].includes(type) ? item.courseId : ""}:${item.slug}`;
      if (slugs.has(slugKey)) errors.push(`${item.id}: duplicate slug`);
      slugs.add(slugKey);
      if (!String(item.title || item.name || "").trim())
        errors.push(`${item.id}: missing title or name`);
      for (const [field, collection] of [
        ["lessonIds", "lessons"],
        ["chapterIds", "chapters"],
        ["courseIds", "courses"],
        ["playlistIds", "playlists"],
        ["subjectIds", "subjects"],
      ]) {
        for (const id of item[field] || [])
          if (!data[collection]?.some((x) => x.id === id))
            errors.push(`${item.id}: invalid ${field} reference ${id}`);
      }
      for (const field of ["sourceChannelUrl", "thumbnail"])
        if (
          item[field] &&
          !/^https:\/\//.test(item[field]) &&
          !(field === "thumbnail" && /^\/(?!\/)/.test(item[field]))
        )
          errors.push(`${item.id}: unsafe ${field}`);
      if (
        type === "lessons" &&
        item.chapterId &&
        data.chapters?.find((c) => c.id === item.chapterId)?.courseId !==
          item.courseId
      )
        errors.push(`${item.id}: chapter belongs to another course`);
      for (const [field, collection] of [
        ["classId", "classes"],
        ["subjectId", "subjects"],
        ["courseId", "courses"],
        ["chapterId", "chapters"],
      ])
        if (item[field] && !data[collection]?.some((x) => x.id === item[field]))
          errors.push(`${item.id}: invalid ${field}`);
      if (item.published && ["lessons", "playlists"].includes(type)) {
        const id =
          type === "lessons"
            ? videoId(item.youtubeUrl || item.youtubeVideoId)
            : playlistId(item.youtubeUrl || item.youtubePlaylistId);
        if (!id && !(type === "playlists" && item.lessonIds?.length))
          errors.push(
            `${item.id}: missing valid YouTube source or curated lessons`,
          );
        const seen = type === "lessons" ? videos : lists;
        if (id && seen.has(id)) errors.push(`${item.id}: duplicate YouTube ID`);
        if (id) seen.add(id);
        if (
          !item.sourceChannel ||
          !item.attribution ||
          !["official", "third-party"].includes(item.sourceType)
        )
          errors.push(`${item.id}: incomplete attribution`);
      }
    }
  return errors;
}
