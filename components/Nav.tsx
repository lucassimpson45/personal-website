"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#learn", label: "Learn" },
  { href: "#contact", label: "Contact" },
] as const;

function scrollToId(id: string) {
  const el = document.querySelector(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen && isMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isMobile]);

  const linkClass =
    "font-mono text-[10px] uppercase tracking-[0.28em] text-text-primary/90 transition-colors hover:text-accent data-cursor-hover";

  return (
    <header className="fixed inset-x-0 top-0 z-[10000]">
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background: "rgba(8, 8, 8, 0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      />
      {/* Top bar stays above the full-screen menu so the hamburger stays tappable */}
      <div className="relative z-[60] flex w-full items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <div className="flex min-w-0 flex-1 items-center justify-start">
          <button
            type="button"
            onClick={() => {
              scrollToId("#home");
              setMobileOpen(false);
            }}
            className="nav-brand-name min-h-[44px] min-w-0 max-w-[calc(100%-4rem)] shrink-0 appearance-none border-0 bg-transparent px-2 text-left font-display text-base tracking-[0.12em] text-text-primary [box-shadow:none] [-webkit-appearance:none] outline-none [outline-style:none] ring-0 [ring-offset:0] transition-colors [text-shadow:none] hover:text-accent focus:!shadow-none focus:!outline-none focus:ring-0 focus-visible:!shadow-none focus-visible:!outline-none sm:max-w-none sm:px-0 sm:text-lg md:text-xl"
            data-cursor-hover
          >
            Lucas Simpson
          </button>
        </div>

        <div className="flex shrink-0 items-center justify-end">
          {!isMobile && (
            <ul className="flex items-center gap-6 md:gap-10">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={linkClass}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(href);
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {isMobile && (
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex min-h-11 min-w-11 shrink-0 touch-manipulation flex-col items-center justify-center gap-1.5 rounded border border-border bg-surface/80"
              onClick={() => setMobileOpen((o) => !o)}
              data-cursor-hover
            >
              <span
                className={`block h-px w-5 bg-text-primary transition-transform ${
                  mobileOpen ? "translate-y-1 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-text-primary transition-opacity ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-text-primary transition-transform ${
                  mobileOpen ? "-translate-y-1 -rotate-45" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            key="mobile-nav"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 touch-manipulation bg-bg/98 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <nav
              className="relative z-10 mx-auto flex w-full max-w-md flex-col items-stretch justify-center gap-0 px-6 py-6 pointer-events-none pt-[max(5.5rem,env(safe-area-inset-top,0px)+2.5rem)]"
              aria-label="Primary"
            >
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="pointer-events-auto w-full border-b border-border/40 py-4 text-center font-mono text-xs uppercase tracking-[0.32em] text-text-primary active:bg-surface-2/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    scrollToId(href);
                    setMobileOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
