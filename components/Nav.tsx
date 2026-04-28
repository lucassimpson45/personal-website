"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
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
    <header className="fixed inset-x-0 top-0 z-[10000] px-5 py-4 md:px-8">
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
      <nav className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollToId("#home")}
          className="font-display text-lg tracking-[0.12em] text-text-primary transition-colors hover:text-accent md:text-xl"
          data-cursor-hover
          data-cursor-glow
        >
          Lucas Simpson
        </button>

        {!isMobile && (
          <ul className="flex items-center gap-10">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={linkClass}
                  data-cursor-glow
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
            aria-label="Menu"
            className="relative z-20 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-border bg-surface/80"
            onClick={() => setMobileOpen((o) => !o)}
            data-cursor-hover
            data-cursor-glow
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
      </nav>

      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-bg/98 pt-20"
          >
            <button
              type="button"
              className="font-display text-2xl tracking-[0.15em]"
              data-cursor-glow
              onClick={() => {
                scrollToId("#home");
                setMobileOpen(false);
              }}
            >
              Home
            </button>
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-xs uppercase tracking-[0.35em] text-text-primary"
                data-cursor-glow
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(href);
                  setMobileOpen(false);
                }}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
