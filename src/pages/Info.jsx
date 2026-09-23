import { useState } from "react";
import { Link } from "react-router-dom";
import { Page } from "./Catalog";
import { Button } from "../components/ui";
import { site } from "../data/catalog";
export function About({ founder = false }) {
  return (
    <Page
      title={founder ? site.founder : "Learning belongs to everyone."}
      description={
        founder
          ? "Founder, Amader Online School"
          : "Free, accessible learning for Bangladeshi students in Classes 6–12."
      }
    >
      <div className="prose">
        <img
          className="about-logo"
          src="/logo.png"
          width="160"
          height="160"
          alt="Amader Online School logo"
        />
        <h2>A space to learn, explore, and grow</h2>
        <p>
          {site.name} was founded by {site.founder}. The platform provides free
          educational access through embedded YouTube content.
        </p>
        <p>
          Explore content by class and subject, follow courses and playlists,
          and learn at your own pace. No account is needed. Optional notes and
          progress are stored in your browser.
        </p>
        <p>
          Each published video identifies its source. Content from other
          educational channels remains the property of its original creators.
        </p>
        <div className="actions">
          <Button to="/classes">Explore classes</Button>
          <Button secondary to="/attribution">
            How content is attributed
          </Button>
        </div>
      </div>
    </Page>
  );
}
export function Contact() {
  const [status, setStatus] = useState("");
  return (
    <Page
      title="Let’s stay connected."
      description="Questions, suggestions, or a content correction? Here’s where to find us."
    >
      <div className="grid two">
        <div className="card">
          <h2>Amader Online School</h2>
          <p>
            <a href={site.facebookUrl}>Visit our Facebook page ↗</a>
          </p>
          <p>
            <a href={site.youtubeUrl}>Visit our YouTube channel ↗</a>
          </p>
          {site.email && (
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {site.phone && <p>{site.phone}</p>}
          <p className="muted">
            {site.email
              ? "Use the form to prepare a message in your email app."
              : "An email address and phone number have not been provided. You can reach the school through its Facebook page."}
          </p>
        </div>
        <form
          className="card contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (!site.email) {
              setStatus(
                "Direct submission is unavailable. Please contact us through Facebook. Your message has not been sent.",
              );
              return;
            }
            location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Website message from ${f.get("name")}`)}&body=${encodeURIComponent(`Reply to: ${f.get("email")}\n\n${f.get("message")}`)}`;
            setStatus(
              "Your email app has been opened. Send the message there to complete your request.",
            );
          }}
        >
          <h2>Write a message</h2>
          <p>This form does not send messages to a server.</p>
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength="100" />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Message
            <textarea name="message" required minLength="10" maxLength="5000" />
          </label>
          <Button type="submit">
            {site.email ? "Open email app" : "Check contact options"}
          </Button>
          <p role="status">{status}</p>
        </form>
      </div>
    </Page>
  );
}
export function Policy({ type }) {
  const content = {
    privacy: {
      title: "Your privacy",
      sections: [
        [
          "No account required",
          "This frontend-only site does not operate an account system or store your learning activity in a server database.",
        ],
        [
          "Data in your browser",
          "Completed lessons, bookmarks, notes, recently viewed lessons, and theme preference are saved in versioned browser localStorage. This information does not sync across devices. You can clear it on the My learning page.",
        ],
        [
          "Embedded content and external services",
          "YouTube embeds use the privacy-enhanced youtube-nocookie.com domain. Loading or playing embedded content connects to YouTube, which may process device and usage information under its own policies. Visiting Facebook or YouTube also takes you to an external service. Your hosting provider may retain access logs.",
        ],
        [
          "Contact",
          "The contact form has no server submission. When an email address is configured, the form opens your email app.",
        ],
      ],
    },
    terms: {
      title: "Terms of use",
      sections: [
        [
          "Educational access",
          "Amader Online School offers free access to educational content through YouTube embeds. Availability depends on the original sources and their embedding settings.",
        ],
        [
          "Source content",
          "Videos remain owned by their respective creators. Use of embedded videos is subject to YouTube terms and the applicable creator rights. This site does not grant a license to download, reproduce, or redistribute them.",
        ],
        [
          "Learning resources",
          "Resources are intended to support learning. Check your school’s syllabus and official exam guidance for current requirements.",
        ],
        [
          "Local features",
          "Browser-local notes and progress may be lost when browser data is cleared. No account backup or cross-device synchronization is provided.",
        ],
      ],
    },
    attribution: {
      title: "Credit where it belongs.",
      sections: [
        [
          "Official Amader Online School videos",
          "Only confirmed uploads from the Amader Online School channel are labeled official. Each lesson includes its source channel and original YouTube link.",
        ],
        [
          "Third-party educational resources",
          "Selected videos from other creators are labeled as third-party resources. Ownership remains with each source creator. Embedding does not imply a partnership or endorsement.",
        ],
        [
          "Licenses and embedding",
          "Embedded content is subject to YouTube terms. A publicly accessible video is not automatically open source. Creative Commons or public-license labels are used only when verified. Videos are never downloaded, proxied, or rehosted by this platform.",
        ],
        [
          "Corrections and removal requests",
          "Content owners can request a correction or removal through the school’s Facebook page. Please include the lesson URL, original source, and the correction or removal requested.",
        ],
      ],
    },
  }[type];
  return (
    <Page title={content.title}>
      <div className="prose">
        {content.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <Link
          className="text-link"
          to={type === "privacy" ? "/my-learning" : "/contact"}
        >
          {type === "privacy"
            ? "Manage local learning data"
            : "Contact the school"}{" "}
          →
        </Link>
      </div>
    </Page>
  );
}
