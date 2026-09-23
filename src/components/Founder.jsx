import {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Globe,
  GraduationCap,
  Fingerprint,
} from "lucide-react";
import { founder, schoolSocials } from "../data/catalog";
const profiles = [
  ["github", "GitHub", Github],
  ["website", "Personal website", Globe],
  ["linkedin", "LinkedIn", Linkedin],
  ["scholar", "Google Scholar", GraduationCap],
  ["orcid", "ORCID", Fingerprint],
  ["facebook", "Personal Facebook", Facebook],
];
export function FounderLinks() {
  return (
    <div
      className="profile-links"
      role="group"
      aria-label="Founder contact and professional links"
    >
      <a
        className="profile-link"
        href={`mailto:${founder.email}`}
        aria-label={`Email ${founder.name}`}
        title={`Email ${founder.name}`}
      >
        <Mail size={19} aria-hidden="true" />
      </a>
      {profiles
        .filter(([key]) => founder.links[key])
        .map(([key, label, Icon]) => (
          <a
            key={key}
            className="profile-link"
            href={founder.links[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${founder.name} — ${label}`}
            title={label}
          >
            <Icon size={19} aria-hidden="true" />
          </a>
        ))}
    </div>
  );
}
export function SchoolSocials() {
  return (
    <div className="school-socials">
      <h3>Follow Amader Online School</h3>
      <div className="profile-links">
        <a
          className="profile-link labeled"
          href={schoolSocials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Amader Online School Facebook"
        >
          <Facebook size={18} aria-hidden="true" />
          Facebook
        </a>
        <a
          className="profile-link labeled"
          href={schoolSocials.youtube}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Amader Online School YouTube"
        >
          <Youtube size={18} aria-hidden="true" />
          YouTube
        </a>
      </div>
    </div>
  );
}
export function FounderSection() {
  return (
    <section className="card founder-section" aria-labelledby="founder-heading">
      <p className="eyebrow">MEET THE FOUNDER</p>
      <div className="founder-profile">
        <img
          className="founder-photo"
          src={founder.photo}
          width="170"
          height="170"
          alt="Md Mehedi Hasan Naeem - Founder of Amader Online School"
          loading="lazy"
        />
        <div className="founder-copy">
          <h2 id="founder-heading">{founder.name}</h2>
          <p className="founder-role">{founder.role}</p>
          <p>{founder.description}</p>
          <FounderLinks />
        </div>
      </div>
    </section>
  );
}
