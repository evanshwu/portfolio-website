import { siteConfig } from "@/config/site";

type SocialLink = {
  label: string;
  href: string;
  external: boolean;
  icon: React.ReactNode;
};

const GitHubIcon = (
  <svg
    viewBox="0 0 16 16"
    className="size-[18px]"
    fill="currentColor"
    aria-hidden
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedInIcon = (
  <svg
    viewBox="0 0 24 24"
    className="size-[18px]"
    fill="currentColor"
    aria-hidden
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const EmailIcon = (
  <svg
    viewBox="0 0 24 24"
    className="size-[18px]"
    fill="currentColor"
    aria-hidden
  >
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: siteConfig.socials.github,
    external: true,
    icon: GitHubIcon,
  },
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    external: true,
    icon: LinkedInIcon,
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.socials.email}`,
    external: false,
    icon: EmailIcon,
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface border-t">
      <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground font-mono text-xs">
          © {year} {siteConfig.name}
        </p>
        <ul className="-ml-2 flex items-center gap-1">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-label={link.label}
                className="text-muted-foreground hover:text-accent inline-flex size-9 items-center justify-center rounded-md transition-colors"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {link.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
