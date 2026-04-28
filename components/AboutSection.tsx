"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const social = [
  {
    label: "YouTube",
    handle: "@lucas_simpson",
    href: "https://www.youtube.com/@lucas_simpson",
  },
  {
    label: "TikTok",
    handle: "@simpsonlite",
    href: "https://www.tiktok.com/@simpsonlite",
  },
  {
    label: "Instagram",
    handle: "@lucasbsimpson",
    href: "https://www.instagram.com/lucasbsimpson/",
  },
  {
    label: "LinkedIn",
    handle: "lucasbsimpson",
    href: "https://www.linkedin.com/in/lucasbsimpson/",
  },
  {
    label: "GitHub",
    handle: "lucassimpson45",
    href: "https://github.com/lucassimpson45",
  },
  {
    label: "Substack",
    handle: "@lucasbsimpson",
    href: "https://substack.com/@lucasbsimpson",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const linkClass =
  "text-text-primary underline decoration-accent/45 underline-offset-[5px] transition-colors hover:text-accent";

const aboutBody: ReactNode[] = [
  "I quit my job and moved to Rome.",
  "Not on a whim — on a bet. A bet on myself, on the things I actually care about building, and on the belief that comfort is the enemy of everything worth doing.",
  "I'm Lucas Simpson, 23, from New Jersey. After college I took the conventional route — got the job, showed up every day — and knew pretty quickly it wasn't it. So I left, moved to Italy, and got to work.",
  <>
    Here I&apos;m building two companies with my brother:{" "}
    <a
      href="https://goluda.ai"
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      data-cursor-hover
    >
      Luda AI
    </a>{" "}
    and{" "}
    <a
      href="https://envowl.com"
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      data-cursor-hover
    >
      ENVOWL
    </a>{" "}
    — both rooted in the same idea that technology should genuinely improve people&apos;s lives. Alongside that I create content, design, and document the whole journey publicly — partly to hold myself accountable, partly because stepping in front of a camera was one of the scariest things I could do, and that&apos;s exactly why I did it.
  </>,
  "What this life has taught me fast: discipline isn't optional, time management is everything, and running a business with your brother is one of the greatest and most humbling things you can do.",
  "I have a passion for content creation, graphic design, and entrepreneurship — and I plan to pursue far more of all three. There's something in the works to help others take their own leap.",
  "The recurring theme in everything I do is this: it's never too late to start. Never too late to try. Never too late to step out of your comfort zone. Where your fear is — there your task is.",
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-20 border-t border-border bg-bg py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-5xl px-6 md:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="shrink-0 font-display text-5xl leading-none tracking-[0.12em] text-text-primary/90 md:text-7xl md:[writing-mode:vertical-rl] md:rotate-180 lg:text-8xl"
          >
            ABOUT
          </motion.p>

          <div className="min-w-0 flex-1 space-y-6">
            {aboutBody.map((content, i) => (
              <motion.p
                key={i}
                custom={i + 1}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="text-sm leading-relaxed text-text-secondary md:text-base"
              >
                {content}
              </motion.p>
            ))}
          </div>
        </div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-16 max-w-md"
        >
          <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[40%_60%_55%_45%/55%_45%_55%_45%] border border-border bg-gradient-to-br from-surface-2 via-surface to-bg shadow-glow-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-6xl tracking-[0.2em] text-accent/40">
                LS
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="relative left-1/2 right-1/2 -mx-[50vw] mt-20 w-screen px-6 md:px-12 lg:px-16"
      >
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-text-secondary">
          Connect
        </p>
        <ul className="mt-6 grid w-full max-w-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {social.map((s) => (
            <li key={s.label} className="min-w-0">
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full min-h-[52px] w-full items-center justify-between gap-3 rounded border border-border bg-surface/60 px-4 py-3 transition-all hover:border-accent/50 hover:shadow-glow-sm md:flex-col md:items-stretch md:justify-center md:text-center"
                data-cursor-hover
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary group-hover:text-accent">
                  {s.label}
                </span>
                <span className="font-mono text-[10px] text-text-primary/80 md:mt-1">
                  {s.handle}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
