import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";
import * as db from "../data/catalog";
import {
  Breadcrumbs,
  ClassCard,
  SubjectCard,
  CourseCard,
  PlaylistCard,
  VideoCard,
  EmptyState,
  SectionHeading,
  SearchField,
  Button,
} from "../components/ui";
import { useLocal } from "../hooks/useLocal";
import { YouTubePlayer } from "../components/YouTubePlayer";
export const NotFound = () => (
  <div className="container section">
    <p className="eyebrow">PAGE NOT FOUND</p>
    <h1>Let’s get you back to learning.</h1>
    <p>This page may have moved or is not published yet.</p>
    <Button to="/classes">Explore classes</Button>
  </div>
);
export function Page({ title, description, children, crumbs = [] }) {
  return (
    <div className="container page">
      <Breadcrumbs items={[...crumbs, { label: title }]} />
      <div className="page-heading">
        <p className="eyebrow">AMADER ONLINE SCHOOL</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Classes() {
  return (
    <Page
      title="A place for every learner."
      description="Choose your class. Find your subjects. Take your next step."
    >
      <div className="class-grid">
        {db.classes.map((c) => (
          <ClassCard item={c} key={c.id} />
        ))}
      </div>
      <p className="notice">
        These are subject directories. Published courses and lessons will appear
        as they are added.
      </p>
    </Page>
  );
}
export function ClassDetail() {
  const { classSlug } = useParams();
  const c = db.classes.find((c) => c.slug === classSlug);
  const [params, setParams] = useSearchParams();
  if (!c) return <NotFound />;
  const group = params.get("group") || "general";
  return (
    <Page
      title={c.name}
      description={c.nameBn}
      crumbs={[{ label: "Classes", to: "/classes" }]}
    >
      <label className="filter-label">
        Study group
        <select
          value={group}
          onChange={(e) => setParams({ group: e.target.value })}
        >
          {c.groups.map((g) => (
            <option key={g} value={g}>
              {db.groupName(g)}
            </option>
          ))}
        </select>
      </label>
      <SectionHeading title="Explore your subjects" />
      <div className="grid three">
        {db.subjects
          .filter((s) => s.classId === c.id && s.group === group)
          .map((s) => (
            <SubjectCard key={s.id} item={s} />
          ))}
      </div>
      {!db.subjects.some((s) => s.classId === c.id && s.group === group) && (
        <EmptyState title="No subjects listed for this group" />
      )}
      <ResourceSection
        title="Courses"
        items={db.liveCourses.filter(
          (x) => x.classId === c.id && x.group === group,
        )}
        Card={CourseCard}
      />
      <ResourceSection
        title="Playlists"
        items={db.livePlaylists.filter(
          (x) => x.classId === c.id && (!x.group || x.group === group),
        )}
        Card={PlaylistCard}
      />
      <ResourceSection
        title="Lessons"
        items={db.liveLessons.filter((l) =>
          db.liveCourses.some(
            (x) =>
              x.id === l.courseId && x.classId === c.id && x.group === group,
          ),
        )}
        Card={VideoCard}
      />
    </Page>
  );
}
export function SubjectDetail() {
  const { subjectSlug } = useParams();
  const s = db.subjects.find((s) => s.slug === subjectSlug);
  if (!s) return <NotFound />;
  return (
    <Page
      title={s.name}
      description={`${db.classes.find((c) => c.id === s.classId)?.name} · ${s.nameBn}`}
      crumbs={[
        { label: "Classes", to: "/classes" },
        {
          label: db.classes.find((c) => c.id === s.classId)?.name,
          to: `/classes/${s.classId}`,
        },
      ]}
    >
      <ResourceSection
        title="Courses"
        items={db.liveCourses.filter((c) => c.subjectId === s.id)}
        Card={CourseCard}
      />
      <ResourceSection
        title="Playlists"
        items={db.livePlaylists.filter((p) => p.subjectId === s.id)}
        Card={PlaylistCard}
      />
    </Page>
  );
}
function ResourceSection({ title, items, Card }) {
  return (
    <section className="resource-section">
      <SectionHeading title={title} />
      {items.length ? (
        <div className="grid three">
          {items.map((x) => (
            <Card key={x.id} item={x} />
          ))}
        </div>
      ) : (
        <EmptyState title={`No published ${title.toLowerCase()} yet`} />
      )}
    </section>
  );
}
export function Filters({ params, setParams, search = true }) {
  const update = (k, v) => {
    const p = new URLSearchParams(params);
    v ? p.set(k, v) : p.delete(k);
    if (k === "class") p.delete("subject");
    setParams(p, { replace: true });
  };
  return (
    <div className="filters">
      {search && (
        <SearchField
          value={params.get("q") || ""}
          onChange={(e) => update("q", e.target.value)}
        />
      )}
      <label>
        Class
        <select
          value={params.get("class") || ""}
          onChange={(e) => update("class", e.target.value)}
        >
          <option value="">All classes</option>
          {db.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Subject
        <select
          value={params.get("subject") || ""}
          onChange={(e) => update("subject", e.target.value)}
        >
          <option value="">All subjects</option>
          {db.subjects
            .filter(
              (s) => !params.get("class") || s.classId === params.get("class"),
            )
            .map((s) => (
              <option key={s.id} value={s.id}>
                {db.classes.find((c) => c.id === s.classId)?.name} · {s.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Group
        <select
          value={params.get("group") || ""}
          onChange={(e) => update("group", e.target.value)}
        >
          <option value="">All groups</option>
          {["general", "science", "business-studies", "humanities"].map((g) => (
            <option key={g} value={g}>
              {db.groupName(g)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select
          value={params.get("sort") || "title"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="title">Title A–Z</option>
          <option value="class">Class</option>
          <option value="newest">Recently added</option>
        </select>
      </label>
    </div>
  );
}
function matches(x, p) {
  return (
    ["class", "subject", "group"].every(
      (k) => !p.get(k) || x[k === "group" ? k : `${k}Id`] === p.get(k),
    ) &&
    `${x.title} ${x.description || ""} ${x.tags?.join(" ") || ""}`
      .toLowerCase()
      .includes((p.get("q") || "").toLowerCase())
  );
}
function sorted(items, sort) {
  return [...items].sort(
    sort === "class"
      ? (a, b) =>
          (db.classes.find((c) => c.id === a.classId)?.order || 0) -
          (db.classes.find((c) => c.id === b.classId)?.order || 0)
      : sort === "newest"
        ? (a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || "")
        : (a, b) => a.title.localeCompare(b.title),
  );
}
export function Courses() {
  const [p, set] = useSearchParams();
  const items = sorted(
    db.liveCourses.filter((c) => matches(c, p)),
    p.get("sort"),
  );
  return (
    <Page
      title="Follow your curiosity."
      description="Explore courses by class, subject, and study group."
    >
      <Filters params={p} setParams={set} />
      <p className="muted">
        {items.length} courses{" "}
        <button className="text-button" onClick={() => set({})}>
          Reset filters
        </button>
      </p>
      {items.length ? (
        <div className="grid three">
          {items.map((c) => (
            <CourseCard item={c} key={c.id} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No courses to show yet"
          description="Try another filter, or explore the class directory while the course library is being prepared."
        />
      )}
    </Page>
  );
}
export function BookmarkButton({ id }) {
  const { data, toggle } = useLocal();
  return (
    <Button
      secondary
      onClick={() => toggle("bookmarks", id)}
      aria-pressed={data.bookmarks.includes(id)}
    >
      <Bookmark size={17} />
      {data.bookmarks.includes(id) ? "Saved" : "Save for later"}
    </Button>
  );
}
export function CourseDetail() {
  const { courseSlug } = useParams();
  const c = db.liveCourses.find((c) => c.slug === courseSlug);
  const { data } = useLocal();
  if (!c) return <NotFound />;
  const lessons = db.courseLessons(c.id);
  const next =
    lessons.find((l) => !data.completed.includes(l.id)) || lessons[0];
  return (
    <Page
      title={c.title}
      description={c.description}
      crumbs={[{ label: "Courses", to: "/courses" }]}
    >
      <p className="badge">
        {db.classes.find((x) => x.id === c.classId)?.name} ·{" "}
        {db.subjects.find((x) => x.id === c.subjectId)?.name} ·{" "}
        {db.groupName(c.group)} · {lessons.length} lessons
      </p>
      <div className="actions">
        {next && (
          <Button to={db.lessonPath(next)}>
            Start / resume learning <ArrowRight size={17} />
          </Button>
        )}
        <BookmarkButton id={c.id} />
      </div>
      <p>{c.attribution || "Source details are listed with each lesson."}</p>
      {db.chapters
        .filter((ch) => ch.courseId === c.id)
        .map((ch) => (
          <section className="card resource-section" key={ch.id}>
            <h2>
              {ch.number}. {ch.title}
            </h2>
            {lessons
              .filter((l) => l.chapterId === ch.id)
              .map((l) => (
                <Link className="lesson-row" to={db.lessonPath(l)} key={l.id}>
                  {l.title}
                  <span>
                    {data.completed.includes(l.id) ? "Completed" : l.duration}
                  </span>
                </Link>
              ))}
          </section>
        ))}
      {!lessons.length && <EmptyState title="No published lessons yet" />}
    </Page>
  );
}
export function Playlists() {
  const [p, set] = useSearchParams();
  const items = sorted(
    db.livePlaylists.filter((x) => matches(x, p)),
    p.get("sort"),
  );
  return (
    <Page
      title="One playlist. New possibilities."
      description="Thoughtfully organized lessons, ready when you are."
    >
      <Filters params={p} setParams={set} />
      <ResourceSection title="Playlists" items={items} Card={PlaylistCard} />
    </Page>
  );
}
export function PlaylistDetail() {
  const { playlistSlug } = useParams();
  const p = db.livePlaylists.find((p) => p.slug === playlistSlug);
  if (!p) return <NotFound />;
  const items = db.liveLessons.filter((l) =>
    p.lessonIds ? p.lessonIds.includes(l.id) : l.courseId === p.courseId,
  );
  return (
    <Page
      title={p.title}
      description={p.description}
      crumbs={[{ label: "Playlists", to: "/playlists" }]}
    >
      <p>
        {db.classes.find((c) => c.id === p.classId)?.name} ·{" "}
        {db.subjects.find((s) => s.id === p.subjectId)?.name} ·{" "}
        {p.sourceChannel}
      </p>
      {(p.youtubeUrl || p.youtubePlaylistId) && (
        <YouTubePlayer
          playlist={p.youtubeUrl || p.youtubePlaylistId}
          title={p.title}
        />
      )}
      <p>{p.attribution}</p>
      <ResourceSection title="Lessons" items={items} Card={VideoCard} />
      <ResourceSection
        title="Related courses"
        items={db.liveCourses.filter(
          (c) => c.id === p.courseId || c.subjectId === p.subjectId,
        )}
        Card={CourseCard}
      />
    </Page>
  );
}
function highlight(text, q) {
  if (!q) return text;
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  return index < 0 ? (
    text
  ) : (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + q.length)}</mark>
      {text.slice(index + q.length)}
    </>
  );
}
export function SearchPage() {
  const [p, set] = useSearchParams();
  const [query, setQuery] = useState(p.get("q") || "");
  useEffect(() => {
    setQuery(p.get("q") || "");
  }, [p]);
  useEffect(() => {
    if (query === (p.get("q") || "")) return;
    const t = setTimeout(() => {
      const next = new URLSearchParams(p);
      query ? next.set("q", query) : next.delete("q");
      set(next, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [query, p, set]);
  const all = useMemo(
    () => [
      ...db.classes.map((x) => ({
        ...x,
        title: x.name,
        type: "class",
        classId: x.id,
        url: `/classes/${x.slug}`,
      })),
      ...db.subjects.map((x) => ({
        ...x,
        title: x.name,
        type: "subject",
        subjectId: x.id,
        url: `/subjects/${x.slug}`,
      })),
      ...db.liveCourses.map((x) => ({
        ...x,
        type: "course",
        url: `/courses/${x.slug}`,
      })),
      ...db.livePlaylists.map((x) => ({
        ...x,
        type: "playlist",
        url: `/playlists/${x.slug}`,
      })),
      ...db.chapters
        .filter((x) => db.liveCourses.some((c) => c.id === x.courseId))
        .map((x) => ({
          ...db.liveCourses.find((c) => c.id === x.courseId),
          ...x,
          type: "chapter",
          url: `/courses/${db.liveCourses.find((c) => c.id === x.courseId).slug}`,
        })),
      ...db.liveLessons.map((x) => ({
        ...db.liveCourses.find((c) => c.id === x.courseId),
        ...x,
        type: "lesson",
        url: db.lessonPath(x),
      })),
    ],
    [],
  );
  const results = sorted(
    all.filter(
      (x) =>
        matches(
          {
            ...x,
            description: `${x.description || ""} ${x.nameBn || x.titleBn || ""} ${db.classes.find((c) => c.id === x.classId)?.name || ""}`,
          },
          p,
        ) &&
        (!p.get("type") || x.type === p.get("type")),
    ),
    p.get("sort"),
  );
  return (
    <Page
      title="What will you discover?"
      description="Search classes, subjects, courses, chapters, playlists, and lessons."
    >
      <SearchField value={query} onChange={(e) => setQuery(e.target.value)} />
      <Filters params={p} setParams={set} search={false} />
      <label className="filter-label">
        Resource type
        <select
          value={p.get("type") || ""}
          onChange={(e) => {
            const n = new URLSearchParams(p);
            e.target.value ? n.set("type", e.target.value) : n.delete("type");
            set(n);
          }}
        >
          <option value="">Everything</option>
          {["class", "subject", "course", "chapter", "playlist", "lesson"].map(
            (t) => (
              <option key={t}>{t}</option>
            ),
          )}
        </select>
      </label>
      <p role="status">
        {results.length} results{" "}
        <button
          className="text-button"
          onClick={() => {
            setQuery("");
            set({});
          }}
        >
          Clear search and filters
        </button>
      </p>
      <div className="grid three">
        {results.map((x) => (
          <Link key={`${x.type}-${x.id}`} to={x.url} className="card">
            <span className="badge">{x.type}</span>
            <h2 className="result-title">
              {highlight(x.title, p.get("q") || "")}
            </h2>
            <p>
              {db.classes.find((c) => c.id === x.classId)?.name}{" "}
              {x.nameBn || x.titleBn}
            </p>
          </Link>
        ))}
      </div>
      {!results.length && (
        <EmptyState
          title="No matches this time"
          description="Try a class number, a subject name, or a shorter search."
        />
      )}
    </Page>
  );
}
