"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { CoolStuffGraphicContent } from "@/components/CoolStuffGraphicDesign";
import { PHOTOGRAPHY_ITEMS } from "@/lib/photography";

const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function AccordionContent({ open, children, className = "" }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open
          ? "max-h-[10000px] opacity-100 [transition-property:max-height,opacity]"
          : "max-h-0 opacity-0 pointer-events-none [transition-property:max-height,opacity]"
      } ${className}`.trim()}
      aria-hidden={!open}
    >
      {children}
    </div>
  );
}

type Section = "photography" | "graphic";

export function CoolStuffPanel() {
  const [openSection, setOpenSection] = useState<Section | null>(null);

  return (
    <div className="min-w-0">
      <div
        className="grid min-w-0 grid-cols-2 divide-x divide-border/50 border-b border-border/60"
        role="tablist"
        aria-label="Cool stuff categories"
      >
        <button
          type="button"
          role="tab"
          id="cool-tab-photography"
          aria-selected={openSection === "photography"}
          aria-controls="cool-panel-photography"
          onClick={() => setOpenSection((s) => (s === "photography" ? null : "photography"))}
          className={`group/tab flex w-full min-w-0 items-center justify-between gap-2 border-b-2 py-3.5 pl-0 pr-2 text-left font-mono text-[10px] uppercase tracking-[0.28em] transition-colors sm:pl-1 sm:pr-3 ${
            openSection === "photography"
              ? "border-accent text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary/90"
          }`}
        >
          <span>Photography</span>
          <span
            className={`shrink-0 text-[7px] text-text-secondary/80 transition duration-300 ${
              openSection === "photography" ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▼
          </span>
        </button>
        <button
          type="button"
          role="tab"
          id="cool-tab-graphic"
          aria-selected={openSection === "graphic"}
          aria-controls="cool-panel-graphic"
          onClick={() => setOpenSection((s) => (s === "graphic" ? null : "graphic"))}
          className={`group/tab flex w-full min-w-0 items-center justify-between gap-2 border-b-2 py-3.5 pl-2 pr-1 text-left font-mono text-[10px] uppercase tracking-[0.28em] transition-colors sm:pl-3 sm:pr-1 ${
            openSection === "graphic" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary/90"
          }`}
        >
          <span className="tracking-[0.24em]">Graphic Design</span>
          <span
            className={`shrink-0 text-[7px] text-text-secondary/80 transition duration-300 ${
              openSection === "graphic" ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ▼
          </span>
        </button>
      </div>

      <AccordionContent open={openSection === "photography"}>
        <div
          id="cool-panel-photography"
          role="tabpanel"
          aria-labelledby="cool-tab-photography"
          className="pt-5"
        >
          <ul className="grid list-none grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {PHOTOGRAPHY_ITEMS.map((item, i) => (
              <motion.li
                key={item.src}
                custom={i}
                variants={cardReveal}
                initial="hidden"
                animate="show"
                className="min-w-0"
              >
                <figure className="group/photo m-0 min-w-0">
                  <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-bg">
                    <Image
                      src={item.src}
                      alt={item.label}
                      fill
                      className="object-cover transition duration-500 ease-out group-hover/photo:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-bg/0 transition-colors duration-300 group-hover/photo:bg-bg/70"
                      aria-hidden
                    />
                    <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-text-primary opacity-0 transition-opacity duration-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] sm:text-[10px] sm:tracking-[0.24em] group-hover/photo:opacity-100">
                      {item.label}
                    </p>
                  </div>
                  <figcaption className="sr-only">{item.label}</figcaption>
                </figure>
              </motion.li>
            ))}
          </ul>
        </div>
      </AccordionContent>

      <AccordionContent open={openSection === "graphic"}>
        <div
          id="cool-panel-graphic"
          role="tabpanel"
          aria-labelledby="cool-tab-graphic"
          className="pt-4"
        >
          <CoolStuffGraphicContent />
        </div>
      </AccordionContent>
    </div>
  );
}
