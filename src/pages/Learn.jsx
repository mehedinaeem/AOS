import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Copy, Share2 } from "lucide-react";
import * as db from "../data/catalog";
import { Page, NotFound, BookmarkButton } from "./Catalog";
import { Button, EmptyState, CourseCard, VideoCard } from "../components/ui";
import { YouTubePlayer } from "../components/YouTubePlayer";
import { useLocal } from "../hooks/useLocal";
export function Learn() {
  const { courseSlug, lessonSlug } = useParams();
  const c = db.liveCourses.find((c) => c.slug === courseSlug);
  const lessons = db.courseLessons(c?.id);
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  const { data, setData, toggle, available } = useLocal();
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (lesson)
      setData((d) => ({
        ...d,
        recent: [lesson.id, ...d.recent.filter((id) => id !== lesson.id)].slice(
          0,
          20,
        ),
      }));
  }, [lesson?.id, setData]);
  if (!c || !lesson) return <NotFound />;
  const index = lessons.indexOf(lesson);
  const done = lessons.filter((l) => data.completed.includes(l.id)).length;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setMessage("Lesson link copied.");
    } catch {
      setMessage(`Copy this lesson URL: ${location.href}`);
    }
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: lesson.title, url: location.href });
      } catch (e) {
        if (e.name !== "AbortError") await copy();
      }
    } else await copy();
  };
  return (
    <Page
      title={lesson.title}
      description={`${c.title} · ${db.chapters.find((ch) => ch.id === lesson.chapterId)?.title || ""}`}
      crumbs={[
        { label: "Courses", to: "/courses" },
        { label: c.title, to: `/courses/${c.slug}` },
      ]}
    >
      <div className="learn-grid">
        <div>
          <YouTubePlayer
            key={lesson.id}
            video={lesson.youtubeUrl || lesson.youtubeVideoId}
            title={lesson.title}
          />
          <p>{lesson.description}</p>
          <p>
            {db.classes.find((x) => x.id === c.classId)?.name} ·{" "}
            {db.subjects.find((x) => x.id === c.subjectId)?.name}
          </p>
          <div className="card attribution">
            <span className="badge">
              {lesson.sourceType === "official"
                ? "Amader Online School"
                : "Third-party resource"}
            </span>
            <p>
              Source:{" "}
              <a href={lesson.sourceChannelUrl}>{lesson.sourceChannel}</a>
            </p>
            <p>{lesson.attribution}</p>
            {lesson.instructor && <p>Instructor: {lesson.instructor}</p>}
            <small>
              License / status: {lesson.licenseStatus || "Not verified"}
            </small>
          </div>
          <div className="actions">
            <Button
              onClick={() => toggle("completed", lesson.id)}
              aria-pressed={data.completed.includes(lesson.id)}
            >
              <Check size={17} />
              {data.completed.includes(lesson.id)
                ? "Completed"
                : "Mark complete"}
            </Button>
            <BookmarkButton id={lesson.id} />
            <Button secondary onClick={copy}>
              <Copy size={17} />
              Copy link
            </Button>
            <Button secondary onClick={share}>
              <Share2 size={17} />
              Share
            </Button>
          </div>
          <p role="status">{message}</p>
          <label className="notes-label">
            Your lesson notes
            <textarea
              value={
                typeof data.notes[lesson.id] === "string"
                  ? data.notes[lesson.id]
                  : ""
              }
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  notes: { ...d.notes, [lesson.id]: e.target.value },
                }))
              }
              placeholder="Write down a thought, a question, or something to remember…"
            />
          </label>
          <p className="muted">
            {available
              ? "Notes and progress are saved only in this browser. They do not sync between devices."
              : "Browser storage is unavailable. Changes will last only for this session."}
          </p>
          <div className="actions">
            {lessons[index - 1] && (
              <Button secondary to={db.lessonPath(lessons[index - 1])}>
                ← Previous lesson
              </Button>
            )}
            {lessons[index + 1] && (
              <Button to={db.lessonPath(lessons[index + 1])}>
                Next lesson →
              </Button>
            )}
          </div>
        </div>
        <aside>
          <details className="card lesson-sidebar" open>
            <summary>
              Course lessons · {done}/{lessons.length} complete
            </summary>
            <progress
              value={done}
              max={lessons.length || 1}
              aria-label="Course progress"
            />
            {lessons.map((l, i) => (
              <Link
                aria-current={l.id === lesson.id ? "page" : undefined}
                className="lesson-row"
                to={db.lessonPath(l)}
                key={l.id}
              >
                <span>
                  {i + 1}. {l.title}
                </span>
                {data.completed.includes(l.id) && <Check size={16} />}
              </Link>
            ))}
          </details>
        </aside>
      </div>
    </Page>
  );
}
export function MyLearning() {
  const { data, clear, available } = useLocal();
  const [confirm, setConfirm] = useState(false);
  const recent = data.recent
    .map((id) => db.liveLessons.find((l) => l.id === id))
    .filter(Boolean);
  const courses = db.liveCourses.filter((c) => data.bookmarks.includes(c.id));
  const videos = db.liveLessons.filter((l) => data.bookmarks.includes(l.id));
  return (
    <Page
      title="Your learning space"
      description="Your progress, bookmarks, and notes live only in this browser."
    >
      {!available && (
        <p role="status">
          Storage is unavailable. Your activity will not persist after this
          session.
        </p>
      )}
      <h2>Continue learning</h2>
      {recent[0] ? (
        <VideoCard item={recent[0]} />
      ) : (
        <EmptyState title="Your next chapter starts with a lesson" />
      )}
      <h2>Saved for later</h2>
      <div className="grid three">
        {courses.map((c) => (
          <CourseCard key={c.id} item={c} />
        ))}
        {videos.map((l) => (
          <VideoCard key={l.id} item={l} />
        ))}
      </div>
      {!courses.length && !videos.length && (
        <EmptyState title="No bookmarks yet" />
      )}
      <h2>Recently viewed</h2>
      <div className="grid three">
        {recent.map((l) => (
          <VideoCard key={l.id} item={l} />
        ))}
      </div>
      {!recent.length && <p>No lessons viewed yet.</p>}
      <p>
        {db.liveLessons.filter((l) => data.completed.includes(l.id)).length}{" "}
        lessons marked complete.
      </p>
      {confirm ? (
        <div className="card">
          <p>
            Clear your progress, notes, bookmarks, history, and theme preference
            from this browser?
          </p>
          <div className="actions">
            <Button
              onClick={() => {
                clear();
                setConfirm(false);
              }}
            >
              Yes, clear local data
            </Button>
            <Button secondary onClick={() => setConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button secondary onClick={() => setConfirm(true)}>
          Clear local learning data
        </Button>
      )}
    </Page>
  );
}
