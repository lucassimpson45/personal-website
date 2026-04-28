"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { TechMarquee } from "@/components/TechMarquee";
import { BUSINESSES_BY_SLUG, BUSINESS_SLUGS, type BusinessSlug } from "@/lib/business-pages";
import { showcaseProjects } from "@/lib/portfolio-showcase";
import { PHOTOGRAPHY_ITEMS } from "@/lib/photography";
import type { YoutubeFeedVideo } from "@/lib/youtube-public";
import { youtubeThumbnailUrl, youtubeWatchUrl } from "@/lib/youtube-public";

const tabs = [
  { id: "businesses" as const, label: "Businesses" },
  { id: "projects" as const, label: "Projects" },
  { id: "content" as const, label: "Content" },
  { id: "cool-stuff" as const, label: "Cool Stuff" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.04 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const panelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

type PortfolioSectionProps = {
  latestYoutube: YoutubeFeedVideo[];
  hasYoutubeConfig: boolean;
};

export function PortfolioSection({ latestYoutube, hasYoutubeConfig }: PortfolioSectionProps) {
  const [tab, setTab] = useState<TabId>("businesses");

  return (
    <section
      id="portfolio"
      className="relative z-20 border-t border-border bg-surface py-28 md:py-36"
    >
      <div className="relative mx-auto max-w-6xl min-w-0 px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl tracking-[0.18em] text-text-primary md:text-7xl"
        >
          PORTFOLIO
        </motion.h2>
        <div className="mt-4 h-px max-w-sm bg-gradient-to-r from-accent/70 to-transparent" />

        <div className="mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-secondary">
            What I use
          </p>
        </div>
      </div>

      <div className="mt-10">
        <TechMarquee />
      </div>

      <div className="relative mx-auto mt-24 min-w-0 max-w-6xl px-6 md:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-secondary">
          What I&apos;ve built
        </p>

        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="mt-8 flex flex-wrap gap-1 border-b border-border/80"
        >
          {tabs.map(({ id, label }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                id={`tab-${id}`}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                data-cursor-hover
                className={`relative -mb-px touch-manipulation px-4 py-3 font-mono text-[10px] uppercase tracking-[0.28em] transition-colors md:px-5 ${
                  active
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary/80"
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-px bg-accent" aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-10 min-h-[320px]">
          <AnimatePresence mode="wait">
            {tab === "businesses" ? (
              <motion.div
                key="businesses"
                role="tabpanel"
                id="panel-businesses"
                aria-labelledby="tab-businesses"
                variants={panelMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid gap-5 md:grid-cols-2"
              >
                {BUSINESS_SLUGS.map((slug, i) => {
                  const b = BUSINESSES_BY_SLUG[slug as BusinessSlug];
                  return (
                    <motion.div
                      key={slug}
                      custom={i}
                      variants={cardReveal}
                      initial="hidden"
                      animate="show"
                    >
                      <Link
                        href={b.href}
                        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg/70 p-8 pr-6 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-glow-sm md:pr-8"
                        data-cursor-hover
                      >
                        <div className="flex min-h-[3.5rem] items-start justify-between gap-3 sm:min-h-16">
                          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-text-secondary">
                            Business
                          </span>
                          <div className="relative h-12 w-28 shrink-0 sm:h-14 sm:w-36">
                            <Image
                              src={b.logoSrc}
                              alt=""
                              fill
                              data-cursor-glow="logo"
                              className="bus-logo object-contain object-right"
                              sizes="(max-width: 768px) 112px, 144px"
                            />
                          </div>
                        </div>
                        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.26em] text-accent/85">
                          {b.cardTag}
                        </p>
                        <h3 className="mt-2 font-display text-3xl tracking-[0.08em] text-text-primary transition-colors group-hover:text-accent md:text-4xl">
                          {b.name}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                          {b.cardSummary}
                        </p>
                        <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-accent/90">
                          Read the story →
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : null}

            {tab === "projects" ? (
              <motion.div
                key="projects"
                role="tabpanel"
                id="panel-projects"
                aria-labelledby="tab-projects"
                variants={panelMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid gap-5 md:grid-cols-2"
              >
                {showcaseProjects.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    custom={i}
                    variants={cardReveal}
                    initial="hidden"
                    animate="show"
                    className={
                      showcaseProjects.length === 1
                        ? "md:col-span-2 flex justify-center"
                        : undefined
                    }
                  >
                    <Link
                      href={p.href}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border bg-bg/70 p-8 pr-6 pt-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-glow-sm md:pr-8 ${
                        showcaseProjects.length === 1 ? "w-full max-w-xl" : "h-full w-full"
                      }`}
                      data-cursor-hover
                    >
                      <div className="flex min-h-[3.5rem] items-start justify-between gap-3 sm:min-h-16">
                        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-text-secondary">
                          Project
                        </span>
                        <div className="relative h-12 w-28 shrink-0 sm:h-14 sm:w-36">
                          <Image
                            src={p.logoSrc}
                            alt=""
                            fill
                            data-cursor-glow="logo"
                            className="bus-logo object-contain object-right"
                            sizes="(max-width: 768px) 112px, 144px"
                          />
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.26em] text-accent/85">
                        {p.cardTag}
                      </p>
                      <h3 className="mt-2 font-display text-3xl tracking-[0.08em] text-text-primary transition-colors group-hover:text-accent md:text-4xl">
                        {p.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
                        {p.cardSummary}
                      </p>
                      <span className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-accent/90">
                        Read the story →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}

            {tab === "content" ? (
              <motion.div
                key="content"
                role="tabpanel"
                id="panel-content"
                aria-labelledby="tab-content"
                variants={panelMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {latestYoutube.length > 0 ? (
                  latestYoutube.map((v, i) => (
                    <motion.a
                      key={v.videoId}
                      href={youtubeWatchUrl(v.videoId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      custom={i}
                      variants={cardReveal}
                      initial="hidden"
                      animate="show"
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-bg/60 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow-sm"
                      data-cursor-hover
                    >
                      <div className="relative aspect-video w-full bg-surface-2">
                        <Image
                          src={youtubeThumbnailUrl(v.videoId)}
                          alt={v.title}
                          fill
                          className="object-cover transition duration-300 group-hover:opacity-90"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="rounded-full border border-white/20 bg-bg/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-primary backdrop-blur-sm">
                            Watch on YouTube
                          </span>
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-text-secondary">
                          YouTube
                        </p>
                        <p className="mt-1 line-clamp-2 font-display text-lg tracking-[0.04em] text-text-primary">
                          {v.title}
                        </p>
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <motion.div
                    key="content-empty"
                    custom={0}
                    variants={cardReveal}
                    initial="hidden"
                    animate="show"
                    className="col-span-full rounded-xl border border-dashed border-border/80 bg-surface/30 p-8 text-center sm:col-span-2 lg:col-span-3"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
                      {hasYoutubeConfig ? "YouTube" : "YouTube (not configured)"}
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary/90 md:mx-auto">
                      {hasYoutubeConfig
                        ? "The channel feed could not be loaded. Check your connection or try again in a few minutes."
                        : "Add your public channel id as YOUTUBE_CHANNEL_ID in .env.local (the “UC…” id from your channel’s URL) so the three most recent videos load here. The list revalidates on each visit (with a short cache) so it stays in sync with your latest uploads."}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : null}

            {tab === "cool-stuff" ? (
              <motion.div
                key="cool-stuff"
                role="tabpanel"
                id="panel-cool-stuff"
                aria-labelledby="tab-cool-stuff"
                variants={panelMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-w-0"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-text-secondary">
                  Photography
                </p>
                <ul className="mt-6 grid list-none grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
