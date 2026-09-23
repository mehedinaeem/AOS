import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Youtube,
  Facebook,
  BookOpen,
} from "lucide-react";
import { site } from "../data/catalog";
import { useLocal } from "../hooks/useLocal";
const links = [
  "Home",
  "Classes",
  "Courses",
  "Playlists",
  "Videos",
  "About",
  "Contact",
];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const location = useLocation();
  const { data, setData } = useLocal();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    document.title = `${location.pathname === "/" ? "Free learning for Classes 6–12" : location.pathname.split("/")[1].replace(/^./, (c) => c.toUpperCase())} | Amader Online School`;
    const canonical = document.querySelector("link[rel=canonical]");
    if (canonical)
      canonical.href = new URL(location.pathname, canonical.href).href;
    document.querySelector("main")?.focus();
  }, [location.pathname]);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  const nav = () =>
    links.map((label) => (
      <NavLink
        key={label}
        to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
        end={label === "Home"}
        onClick={() => setOpen(false)}
      >
        {label}
      </NavLink>
    ));
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="topbar">
        <span>শেখার সুযোগ হোক সবার জন্য</span>
        <span>
          Free learning. Open possibilities. <span className="top-dot">✦</span>
        </span>
      </div>
      <header>
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Amader Online School home">
            <img
              src="/logo.png"
              alt="Amader Online School logo"
              width="48"
              height="48"
            />
            <span>
              Amader<span>Online School</span>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav()}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label={`Theme: ${data.theme}. Switch theme`}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  theme:
                    d.theme === "system"
                      ? "light"
                      : d.theme === "light"
                        ? "dark"
                        : "system",
                }))
              }
            >
              {data.theme === "dark" ? (
                <Moon size={19} />
              ) : data.theme === "light" ? (
                <Sun size={19} />
              ) : (
                <Monitor size={19} />
              )}
            </button>
            <Link className="button small desktop-cta" to="/classes">
              Start Learning <ArrowRight size={16} />
            </Link>
            <button
              className="icon-button menu-button"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="mobile-drawer"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) setOpen(false);
        }}
      >
        <div>
          <button
            className="icon-button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
          <nav aria-label="Mobile navigation">{nav()}</nav>
        </div>
      </dialog>
      <main id="main" tabIndex="-1">
        <Outlet />
      </main>
      <footer>
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand">
              <img src="/logo.png" width="48" height="48" alt="" />
              <span>
                Amader<span>Online School</span>
              </span>
            </Link>
            <p>
              Learning belongs to everyone.
              <br />A free space to learn, explore, and grow.
            </p>
            <div className="social">
              <a
                href={site.youtubeUrl}
                aria-label="Amader Online School on YouTube"
              >
                <Youtube size={21} />
              </a>
              <a
                href={site.facebookUrl}
                aria-label="Amader Online School on Facebook"
              >
                <Facebook size={21} />
              </a>
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/classes">Browse classes</Link>
            <Link to="/courses">All courses</Link>
            <Link to="/playlists">Video playlists</Link>
            <Link to="/videos">Official videos</Link>
            <Link to="/search">Search lessons</Link>
          </div>
          <div>
            <h3>Our school</h3>
            <Link to="/about">About us</Link>
            <Link to="/founder">Our founder</Link>
            <Link to="/contact">Get in touch</Link>
            <Link to="/my-learning">My learning</Link>
          </div>
          <div className="footer-note">
            <BookOpen size={25} />
            <h3>Your next chapter starts here.</h3>
            <p>
              For curious minds in Classes 6–12.
              <br />
              Made for Bangladesh.
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Amader Online School</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/attribution">Content attribution</Link>
          </div>
          <span>Built around your curiosity.</span>
        </div>
      </footer>
    </>
  );
}
