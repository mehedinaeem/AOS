import template from "./course-data.template.json" with { type: "json" };
export const founder = {
  name: template.site.founder,
  role: "Founder, Amader Online School",
  email: "mehedinaeem@gmail.com",
  photo: "/images/founder/mehedi-naeem.jpg",
  description:
    "Md Mehedi Hasan Naeem is the founder of Amader Online School, an educational platform created to make organized and accessible learning resources available to students.",
  links: {
    github: "https://github.com/mehedinaeem",
    // Add confirmed personal URLs here. Empty fields are not displayed.
    website: "",
    linkedin: "https://www.linkedin.com/in/mehedinaeem/",
    scholar: "https://scholar.google.com/citations?user=1rcfRWkAAAAJ&hl=en",
    orcid: "",
    facebook: "https://www.facebook.com/mehedinaeem00",
  },
};
export const schoolSocials = {
  facebook: template.site.facebookUrl,
  youtube: template.site.youtubeUrl,
};
export const site = {
  ...template.site,
  email: founder.email,
  foundedYear: 2021,
  canonicalUrl: "",
};
const namesBn = [
  "ষষ্ঠ শ্রেণি",
  "সপ্তম শ্রেণি",
  "অষ্টম শ্রেণি",
  "নবম শ্রেণি",
  "দশম শ্রেণি",
  "একাদশ শ্রেণি",
  "দ্বাদশ শ্রেণি",
];
export const classes = Array.from({ length: 7 }, (_, i) => ({
  id: `class-${i + 6}`,
  slug: `class-${i + 6}`,
  name: `Class ${i + 6}`,
  nameBn: namesBn[i],
  order: i + 6,
  groups:
    i < 3
      ? ["general"]
      : ["general", "science", "business-studies", "humanities"],
}));
const subjectNames = [
  ["mathematics", "Mathematics", "গণিত"],
  ["english", "English", "ইংরেজি"],
  ["bangla", "Bangla", "বাংলা"],
  ["science", "Science", "বিজ্ঞান"],
  ["ict", "ICT", "তথ্য ও যোগাযোগ প্রযুক্তি"],
];
export const subjects = classes.flatMap((c) =>
  subjectNames
    .filter((s) => c.order < 11 || ["english", "bangla", "ict"].includes(s[0]))
    .map(([slug, name, nameBn]) => ({
      id: `${c.id}-${slug}`,
      slug: `${c.id}-${slug}`,
      classId: c.id,
      group: "general",
      name,
      nameBn,
      description: "Subject directory — lessons have not been published yet.",
      courseIds: [],
    })),
);
// Paste reviewed records here using course-data.template.json. Keep drafts published:false.
// Supply verified creator attribution and real YouTube links before publishing.
export const courses = [];
export const chapters = [];
export const lessons = [];
export const playlists = [];
export const groupName = (value) =>
  ({
    general: "General",
    science: "Science",
    "business-studies": "Business Studies",
    humanities: "Humanities",
  })[value] || value;
export const liveCourses = courses.filter((c) => c.published);
export const liveLessons = lessons.filter(
  (l) => l.published && liveCourses.some((c) => c.id === l.courseId),
);
export const livePlaylists = playlists.filter((p) => p.published);
export const courseLessons = (id) =>
  liveLessons
    .filter((l) => l.courseId === id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
export const lessonPath = (l) =>
  `/learn/${liveCourses.find((c) => c.id === l.courseId)?.slug}/${l.slug}`;
