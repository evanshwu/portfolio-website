"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  // Close the drawer on any navigation, including browser Back/Forward that
  // bypasses our click handlers. Derived during render (previous-value
  // comparison) instead of a setState-in-effect; ref mutation during render
  // is forbidden by react-hooks/refs, so the previous value lives in state.
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    if (open) setOpen(false);
  }

  // Close the panel; if focus is inside it, return focus to the toggle so it
  // does not fall to document.body when the panel hides.
  const closePanel = () => {
    const active = document.activeElement;
    if (active && panelRef.current?.contains(active)) {
      buttonRef.current?.focus();
    }
    setOpen(false);
  };

  // Let Escape dismiss the open mobile menu.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const active = document.activeElement;
      if (active && panelRef.current?.contains(active)) {
        buttonRef.current?.focus();
      }
      setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="container-page flex h-14 items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group text-foreground inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="bg-accent size-2 rounded-[2px] transition-transform group-hover:scale-110"
          />
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {siteConfig.nav.map((item) => {
            if ("external" in item && item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.title}
                </a>
              );
            }
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "text-foreground decoration-accent text-sm underline decoration-2 underline-offset-8"
                    : "text-muted-foreground hover:text-foreground text-sm transition-colors"
                }
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="text-foreground hover:bg-surface -mr-2 inline-flex size-9 items-center justify-center rounded-md transition-colors sm:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <nav
        ref={panelRef}
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="border-border bg-background border-t sm:hidden"
      >
        <ul className="container-page flex flex-col py-2">
          {siteConfig.nav.map((item) => {
            if ("external" in item && item.external) {
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closePanel}
                    className="text-muted-foreground hover:text-foreground block border-l-2 border-transparent py-2 pl-3 text-sm transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              );
            }
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closePanel}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "border-accent text-foreground block border-l-2 py-2 pl-3 text-sm"
                      : "text-muted-foreground hover:text-foreground block border-l-2 border-transparent py-2 pl-3 text-sm transition-colors"
                  }
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
