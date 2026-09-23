import React, { useState } from "react";
import { thumbnail } from "../utils/youtube";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Play,
  Search,
  FolderOpen,
} from "lucide-react";
import { classes, subjects, courseLessons, lessonPath } from "../data/catalog";
export const Button = ({ to, children, secondary = false, ...props }) =>
  to ? (
    <Link
      className={`button ${secondary ? "secondary" : ""}`}
      to={to}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <button className={`button ${secondary ? "secondary" : ""}`} {...props}>
      {children}
    </button>
  );
export function SectionHeading({
  eyebrow,
  title,
  description,
  to,
  link = "View all",
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "What would you like to learn?",
  ...props
}) {
  return (
    <label className="search-field">
      <Search size={20} />
      <span className="sr-only">Search learning content</span>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link to="/">Home</Link>
      {items.map((i, n) => (
        <React.Fragment key={n}>
          <span>/</span>
          {i.to ? (
            <Link to={i.to}>{i.label}</Link>
          ) : (
            <span aria-current="page">{i.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
export function ClassCard({ item }) {
  return (
    <Link className="class-card" to={`/classes/${item.slug}`}>
      <span className="class-number">
        {String(item.order).padStart(2, "0")}
      </span>
      <ArrowUpRight size={18} />
      <h3>{item.name}</h3>
      <p lang="bn">{item.nameBn}</p>
      <span className="class-level">
        {item.order <= 8
          ? "Build your foundation"
          : item.order <= 10
            ? "Secondary learning"
            : "Higher secondary"}
      </span>
    </Link>
  );
}
export function SubjectCard({ item }) {
  return (
    <Link className="card subject-card" to={`/subjects/${item.slug}`}>
      <BookOpen className="blue" />
      <h3>{item.name}</h3>
      <p lang="bn">{item.nameBn}</p>
      <span className="muted">
        {classes.find((c) => c.id === item.classId)?.name} · Subject directory
      </span>
      <ArrowUpRight size={18} />
    </Link>
  );
}
function ResourceImage({ src }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed || !/^(https:\/\/|\/(?!\/))/.test(src)) return null;
  return (
    <img
      className="resource-image"
      src={src}
      alt=""
      width="480"
      height="270"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
export function CourseCard({ item }) {
  return (
    <Link className="card" to={`/courses/${item.slug}`}>
      <ResourceImage src={item.thumbnail} />
      <span className="badge">
        {classes.find((c) => c.id === item.classId)?.name}
      </span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <span className="muted">
        {subjects.find((s) => s.id === item.subjectId)?.name} ·{" "}
        {courseLessons(item.id).length} lessons
      </span>
    </Link>
  );
}
export function PlaylistCard({ item }) {
  return (
    <Link className="card" to={`/playlists/${item.slug}`}>
      <ResourceImage src={item.thumbnail} />
      <Play className="blue" />
      <h3>{item.title}</h3>
      <p>{item.sourceChannel}</p>
    </Link>
  );
}
export function VideoCard({ item }) {
  return (
    <Link className="card" to={lessonPath(item)}>
      <ResourceImage
        src={
          item.thumbnail || thumbnail(item.youtubeUrl || item.youtubeVideoId)
        }
      />
      <Play className="blue" />
      <h3>{item.title}</h3>
      <p>
        {item.sourceChannel}
        {item.duration && ` · ${item.duration}`}
      </p>
    </Link>
  );
}
export function EmptyState({
  title = "A little more learning is on the way",
  description = "There are no published resources here yet. Explore the class directory or visit our YouTube channel.",
  compact = false,
}) {
  return (
    <div className={`empty ${compact ? "compact" : ""}`}>
      <span className="empty-icon">
        <FolderOpen size={25} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}
export const LoadingSkeleton = () => (
  <div className="skeleton" role="status" aria-label="Loading content" />
);
export class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="container section">
        <h1>Something went wrong</h1>
        <p>Please reload the page to try again.</p>
        <Button onClick={() => location.reload()}>Reload page</Button>
      </main>
    ) : (
      this.props.children
    );
  }
}
