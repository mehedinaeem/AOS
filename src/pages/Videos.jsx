import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Youtube } from "lucide-react";
import { Page, NotFound } from "./Catalog";
import {
  Button,
  EmptyState,
  SearchField,
  SectionHeading,
} from "../components/ui";
import OfficialVideoCard from "../components/OfficialVideoCard";
import { YouTubePlayer } from "../components/YouTubePlayer";
import {
  channel,
  videoCategories,
  officialVideos,
  filterVideos,
  getVideoById,
  universityTags,
  formatViews,
  formatDuration,
} from "../data/videos";
const pageSize = 12;
export function Videos() {
  const { categorySlug } = useParams();
  const [params, setParams] = useSearchParams();
  const category = videoCategories.find((c) => c.slug === categorySlug);
  const activeCategory = categorySlug || params.get("category") || "";
  const query = params.get("q") || "";
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);
  const update = (key, value) => {
    // Read the URL synchronously so rapid controls do not reuse pre-navigation filters.
    const p = new URLSearchParams(window.location.search);
    value ? p.set(key, value) : p.delete(key);
    p.delete("page");
    setParams(p, { replace: key === "q" });
  };
  if (categorySlug && !category) return <NotFound />;
  const minimum = params.get("minViews");
  const minViews =
    minimum !== null && minimum !== "" && Number.isFinite(Number(minimum))
      ? Math.max(0, Number(minimum))
      : null;
  const results = filterVideos({
    category: activeCategory,
    university: params.get("university") || "",
    query: debouncedQuery,
    minViews,
    sort: params.get("sort") || "newest",
  });
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.floor(Number(params.get("page"))) || 1),
  );
  const visible = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const goPage = (page) => {
    const next = new URLSearchParams(window.location.search);
    next.set("page", String(page));
    setParams(next);
    document.getElementById("video-results")?.focus();
  };
  return (
    <Page
      title={category ? category.name : "From Our YouTube Channel"}
      description="Explore official videos on admission guidance, academic learning, and more. Choose a topic and watch at your own pace."
      crumbs={category ? [{ label: "Videos", to: "/videos" }] : []}
    >
      <p className="notice video-notice">
        This archive includes past admission sessions and exam updates. Check
        the session in each title. View counts are from the supplied dataset,
        not live YouTube totals.
      </p>
      {!category && (
        <section className="resource-section">
          <SectionHeading
            title="Categories"
            description={`${officialVideos.length} official videos across ${videoCategories.length} categories`}
          />
          <div className="grid three category-grid">
            {videoCategories.map((c) => (
              <Link
                className="card video-category-card"
                key={c.slug}
                to={`/videos/category/${c.slug}`}
              >
                <h3>{c.name}</h3>
                <p>
                  {c.count} {c.count === 1 ? "video" : "videos"}
                </p>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="resource-section" aria-label="Browse official videos">
        <SearchField
          value={query}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Search video titles, categories, or universities…"
        />
        <div className="filters video-filters">
          {!category && (
            <label>
              Category
              <select
                aria-label="Video category"
                value={activeCategory}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">All categories</option>
                {videoCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.count})
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            University tag
            <select
              aria-label="University tag"
              value={params.get("university") || ""}
              onChange={(e) => update("university", e.target.value)}
            >
              <option value="">All university tags</option>
              {universityTags.map((t) => (
                <option value={t} key={t}>
                  {t === "islamic-university"
                    ? "Islamic University"
                    : t.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label>
            Minimum views
            <input
              aria-label="Minimum views"
              type="number"
              min="0"
              step="1"
              value={params.get("minViews") || ""}
              placeholder="Any view count"
              onChange={(e) => update("minViews", e.target.value)}
            />
          </label>
          <label>
            Sort
            <select
              aria-label="Sort videos"
              value={params.get("sort") || "newest"}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="newest">Newest dataset order</option>
              <option value="oldest">Oldest dataset order</option>
              <option value="most-viewed">Most viewed</option>
              <option value="least-viewed">Least viewed</option>
            </select>
          </label>
        </div>
        <div id="video-results" className="video-results-summary" tabIndex="-1">
          <p role="status">
            {results.length} {results.length === 1 ? "video" : "videos"}
            {results.length > 0 &&
              ` · Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, results.length)}`}
          </p>
          <button
            className="text-button"
            onClick={() => {
              setDebouncedQuery("");
              setParams({});
            }}
          >
            Clear video filters
          </button>
        </div>
        {visible.length ? (
          <div className="grid three">
            {visible.map((v) => (
              <OfficialVideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No videos match these filters"
            description="Try another category, university tag, or a shorter search."
          />
        )}
        {totalPages > 1 && (
          <nav className="video-pagination" aria-label="Video pagination">
            <Button
              secondary
              disabled={currentPage === 1}
              onClick={() => goPage(currentPage - 1)}
            >
              ← Previous page
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              secondary
              disabled={currentPage === totalPages}
              onClick={() => goPage(currentPage + 1)}
            >
              Next page →
            </Button>
          </nav>
        )}
      </section>
    </Page>
  );
}
export function OfficialVideoDetail() {
  const { videoId } = useParams();
  const video = getVideoById(videoId);
  useEffect(() => {
    if (video) document.title = `${video.title} | Amader Online School`;
  }, [video]);
  if (!video) return <NotFound />;
  const ordered = filterVideos();
  const index = ordered.findIndex((v) => v.id === video.id);
  const related = filterVideos({ category: video.categorySlug })
    .filter((v) => v.id !== video.id)
    .slice(0, 3);
  return (
    <Page
      title={video.title}
      crumbs={[
        { label: "Videos", to: "/videos" },
        { label: video.category, to: `/videos/category/${video.categorySlug}` },
      ]}
    >
      <div className="official-detail">
        <YouTubePlayer key={video.id} video={video.id} title={video.title} />
        <div className="actions">
          <a
            className="button"
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Youtube size={18} />
            Watch on YouTube
          </a>
          <Link className="badge" to={`/videos/category/${video.categorySlug}`}>
            {video.category}
          </Link>
        </div>
        <div className="card attribution">
          <span className="official-badge">Official channel</span>
          <p>
            Source:{" "}
            <a href={channel.url} target="_blank" rel="noreferrer">
              {channel.name}
            </a>
          </p>
          <p>
            {formatViews(video.viewCount)}
            {video.viewCount !== null ? " · dataset snapshot" : ""}
            {formatDuration(video.durationSeconds) &&
              ` · ${formatDuration(video.durationSeconds)}`}
          </p>
          <p>
            Video embedded from Amader Online School on YouTube. Content remains
            owned by its creator and is subject to YouTube terms.
          </p>
          {video.universityTags.length > 0 && (
            <p>
              University tags:{" "}
              {video.universityTags.map((t, i) => (
                <span key={t}>
                  {i > 0 ? ", " : ""}
                  <Link to={`/videos?university=${encodeURIComponent(t)}`}>
                    {t === "islamic-university"
                      ? "Islamic University"
                      : t.toUpperCase()}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
        <p className="notice">
          Admission and exam updates may refer to past sessions. Refer to the
          session in the title when using this video.
        </p>
        <nav className="actions" aria-label="Previous and next videos">
          {ordered[index - 1] && (
            <Button secondary to={`/videos/${ordered[index - 1].id}`}>
              ← Previous video
            </Button>
          )}
          {ordered[index + 1] && (
            <Button to={`/videos/${ordered[index + 1].id}`}>
              Next video →
            </Button>
          )}
        </nav>
      </div>
      {related.length > 0 && (
        <section className="resource-section">
          <SectionHeading
            title="More in this category"
            to={`/videos/category/${video.categorySlug}`}
            link="View category"
          />
          <div className="grid three">
            {related.map((v) => (
              <OfficialVideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}
    </Page>
  );
}
