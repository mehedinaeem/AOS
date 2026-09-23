import OfficialVideoCard from "../components/OfficialVideoCard";
import { featuredVideos } from "../data/videos";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Play,
  Check,
  Sparkles,
  GraduationCap,
  Compass,
  Heart,
  Youtube,
  Pause,
} from "lucide-react";
import {
  classes,
  liveCourses,
  livePlaylists,
  liveLessons,
  site,
} from "../data/catalog";
import {
  Button,
  SearchField,
  SectionHeading,
  ClassCard,
  CourseCard,
  PlaylistCard,
  VideoCard,
  EmptyState,
} from "../components/ui";
export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [artPaused, setArtPaused] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="eyebrow">
              <span className="live-dot" /> YOUR CLASSROOM, WITHOUT LIMITS
            </p>
            <h1>
              A little curiosity.
              <br />A world of{" "}
              <span>
                learning.
                <svg viewBox="0 0 370 17" aria-hidden="true">
                  <path d="M3 12 Q180 -2 365 8" />
                </svg>
              </span>
            </h1>
            <motion.p
              className="hero-origin"
              data-paused={artPaused || reduce}
              aria-label={`Since ${site.foundedYear}`}
              initial={reduce ? false : { opacity: 0, scale: 0.85, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 16,
                delay: reduce ? 0 : 0.3,
              }}
            >
              <span className="origin-line" aria-hidden="true" />
              <span className="origin-since">Since</span>
              <strong>{site.foundedYear}</strong>
              <span className="origin-line" aria-hidden="true" />
            </motion.p>
            <p className="hero-description">
              Welcome to <strong>Amader Online School.</strong>
              <br />
              Free, accessible learning for Bangladeshi students.
              <br className="desktop-break" /> Find your class. Explore a
              subject. Learn at your own pace.
            </p>
            <div className="hero-buttons">
              <Button to="/classes">
                Explore Your Class <ArrowRight size={18} />
              </Button>
              <Button to="/playlists" secondary>
                <Play size={17} /> Browse Playlists
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <Check />
                Always free
              </span>
              <span>
                <Check />
                Classes 6–12
              </span>
              <span>
                <Check />
                Learn at your pace
              </span>
            </div>
          </motion.div>
          <div
            className="hero-art"
            data-paused={artPaused || reduce}
            aria-label="An illustrated learning space"
          >
            <span className="art-spark spark-one">✦</span>
            <span className="art-spark spark-two">✧</span>
            <div className="art-orbit" />
            <div className="floating-tag tag-top">
              <span className="tag-icon">
                <GraduationCap size={24} />
              </span>
              <span>
                A place for every learner<small>তোমার শেখা, তোমার গতিতে</small>
              </span>
            </div>
            <div className="study-card">
              <div className="study-top">
                <span className="mini-dots">● ● ●</span>
                <span>THE LEARNING SPACE</span>
                <BookOpen size={16} />
              </div>
              <div className="study-content">
                <span className="study-pill">LET’S LEARN SOMETHING NEW</span>
                <div className="math-sketch">
                  <span>অ আ ক</span>
                  <span>√x + y²</span>
                </div>
                <div className="book-stack">
                  <div className="book blue-book">
                    A world of possibilities <Sparkles size={21} />
                  </div>
                  <div className="book red-book">One lesson at a time.</div>
                  <div className="book cream-book">
                    Keep asking why. <ArrowRight size={20} />
                  </div>
                </div>
                <span className="study-caption">
                  Small steps. Meaningful progress.
                </span>
              </div>
            </div>
            <div className="floating-tag tag-bottom">
              <span className="tag-icon red-icon">
                <Play size={19} />
              </span>
              <span>
                Press play on possibility
                <small>Learn with YouTube lessons</small>
              </span>
              <span className="tiny-arrow">↗</span>
            </div>
            <span className="art-caption">
              A brighter tomorrow begins with learning.
              {!reduce && (
                <button
                  className="art-motion-toggle"
                  onClick={() => setArtPaused((value) => !value)}
                  aria-label={
                    artPaused ? "Play hero animations" : "Pause hero animations"
                  }
                  title={artPaused ? "Play animation" : "Pause animation"}
                >
                  {artPaused ? (
                    <Play size={13} aria-hidden="true" />
                  ) : (
                    <Pause size={13} aria-hidden="true" />
                  )}
                </button>
              )}
            </span>
          </div>
        </div>
        <div className="container hero-search">
          <span>
            <SearchLabel />
          </span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            <SearchField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a class, subject, or lesson…"
            />
            <button className="button" type="submit">
              Find a lesson <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="FIND YOUR STARTING POINT"
          title="Your class. Your next step."
          description="From building the basics to preparing for what’s next."
          to="/classes"
          link="Explore all classes"
        />
        <div className="class-grid">
          {classes.map((c) => (
            <ClassCard key={c.id} item={c} />
          ))}
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="WATCH & EXPLORE"
          title="From Our YouTube Channel"
          description="Official videos on admission guidance, academic learning, and more."
          to="/videos"
          link="Browse all videos"
        />
        <div className="grid three">
          {featuredVideos.map((video) => (
            <OfficialVideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
      <section className="soft-section">
        <div className="container section">
          <SectionHeading
            eyebrow="SPACE TO EXPLORE"
            title="Build understanding, one lesson at a time."
            to="/courses"
            link="Browse courses"
          />
          {liveCourses.some((c) => c.featured) ? (
            <div className="grid three">
              {liveCourses
                .filter((c) => c.featured)
                .map((c) => (
                  <CourseCard key={c.id} item={c} />
                ))}
            </div>
          ) : (
            <EmptyState
              title="Our course library is taking shape"
              description="No courses have been published yet. In the meantime, explore your class and subject directory, or visit Amader Online School on YouTube."
            />
          )}
          <a className="text-link channel-link" href={site.youtubeUrl}>
            <Youtube size={19} /> Visit our YouTube channel{" "}
            <ArrowRight size={16} />
          </a>
          <div className="grid two resource-sections">
            <div>
              <SectionHeading title="Featured playlists" to="/playlists" />
              {livePlaylists.some((p) => p.featured) ? (
                livePlaylists
                  .filter((p) => p.featured)
                  .map((p) => <PlaylistCard key={p.id} item={p} />)
              ) : (
                <EmptyState
                  compact
                  title="Playlists, thoughtfully organized"
                  description="Published collections will appear here."
                />
              )}
            </div>
            <div>
              <SectionHeading title="Latest lessons" to="/search?type=lesson" />
              {liveLessons.length ? (
                liveLessons
                  .slice(-3)
                  .reverse()
                  .map((l) => <VideoCard key={l.id} item={l} />)
              ) : (
                <EmptyState
                  compact
                  title="Room for your next discovery"
                  description="New lessons will appear here when published."
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="SIMPLE BY DESIGN"
          title="A small step is all it takes."
          description="No sign-up. No fees. Just you and something new to learn."
        />
        <div className="how-grid">
          {[
            [
              Compass,
              "01",
              "Find your class",
              "Choose your class and explore the subjects you want to understand.",
            ],
            [
              Play,
              "02",
              "Follow your curiosity",
              "Open a course or playlist and work through lessons at your own pace.",
            ],
            [
              Check,
              "03",
              "Make progress, your way",
              "Save notes and mark lessons complete, right here in your browser.",
            ],
          ].map(([Icon, n, title, text]) => (
            <div className="how-card" key={n}>
              <div>
                <span className="how-icon">
                  <Icon size={23} />
                </span>
                <span className="step-number">{n}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container founder-strip">
        <div className="founder-symbol">
          <Heart size={34} />
        </div>
        <div>
          <p className="eyebrow">BUILT WITH A PURPOSE</p>
          <h2>Good education should be within everyone’s reach.</h2>
          <p>
            Founded by <strong>Md Mehedi Hasan Naeem</strong>, Amader Online
            School is a space for free, accessible learning.
          </p>
        </div>
        <Link to="/about" className="text-link">
          Get to know us <ArrowRight size={18} />
        </Link>
      </section>
      <section className="container cta">
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h2>Where will your curiosity take you?</h2>
        <p>Choose a class and take the first step.</p>
        <Button to="/classes">
          Let’s Start Learning <ArrowRight size={18} />
        </Button>
        <Link to="/courses">Or explore all courses →</Link>
      </section>
    </>
  );
}
function SearchLabel() {
  return (
    <>
      <strong>Something on your mind?</strong>
      <small>Let’s find a place to start.</small>
    </>
  );
}
