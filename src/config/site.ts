// The live résumé lives on Google Drive (kept off the repo to avoid shipping a
// PDF that goes stale); referenced from both the nav and the homepage hero.
const RESUME_URL =
  "https://drive.google.com/file/d/1MdrcvCfWIAXyxdNuAzDsycBG6B0T7yPy/view?usp=sharing";

export const siteConfig = {
  name: "Evan Wu",
  fullName: "Hsin-Han (Evan) Wu",
  description: "Portfolio of Hsin-Han (Evan) Wu, software engineer.",
  url: "https://evanwu.dev", // placeholder domain; real one set at Phase 6 cutover
  resumeUrl: RESUME_URL,
  nav: [
    { title: "Home", href: "/" },
    { title: "Projects", href: "/projects" },
    { title: "Resume", href: RESUME_URL, external: true },
  ],
  socials: {
    github: "https://github.com/evanshwu",
    linkedin: "https://www.linkedin.com/in/hsinhanw/",
    email: "evan.sh.wu@gmail.com",
  },
} as const;
