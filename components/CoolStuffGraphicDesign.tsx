"use client";

import Image from "next/image";
import { useState } from "react";
import { LOGO_DESIGN_ITEMS, THUMBNAIL_ITEMS, type LogoDesignItem } from "@/lib/graphic-design";

const hoverOverlay =
  "pointer-events-none absolute inset-0 bg-bg/0 transition-colors duration-300 group-hover/asset:bg-bg/70";
const hoverLabel =
  "pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-[9px] uppercase leading-snug tracking-[0.2em] text-text-primary opacity-0 transition-opacity duration-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] sm:text-[10px] sm:tracking-[0.24em] group-hover/asset:opacity-100";

const detailsSummary =
  "flex cursor-pointer list-none items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-text-primary transition-colors hover:text-text-primary/80 [&::-webkit-details-marker]:hidden";
const subSummaryBase =
  "w-full border-b border-border/45 py-3.5 pl-0 pr-1 text-text-secondary " + detailsSummary;

function Chevron() {
  return (
    <span
      className="chev inline-block origin-center text-[7px] text-text-secondary/80 transition duration-200"
      aria-hidden
    >
      ▼
    </span>
  );
}

function LogoAsset({ item, sizes }: { item: LogoDesignItem; sizes: string }) {
  return (
    <figure className="group/asset m-0 min-w-0">
      <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-bg">
        {item.media === "pdf" ? (
          <object data={item.src} type="application/pdf" className="absolute inset-0 h-full w-full bg-bg" aria-label={item.label}>
            <a
              href={item.src}
              className="absolute inset-0 flex items-center justify-center p-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary underline"
              target="_blank"
              rel="noreferrer"
            >
              Open PDF
            </a>
          </object>
        ) : (
          <Image
            src={item.src}
            alt={item.label}
            fill
            className="object-cover transition duration-500 ease-out group-hover/asset:scale-[1.02]"
            sizes={sizes}
          />
        )}
        <div className={hoverOverlay} aria-hidden />
        <p className={hoverLabel}>{item.label}</p>
      </div>
      <figcaption className="sr-only">{item.label}</figcaption>
    </figure>
  );
}

export function CoolStuffGraphicDesign() {
  const [graphicOpen, setGraphicOpen] = useState(true);
  const [logosOpen, setLogosOpen] = useState(true);
  const [thumbsOpen, setThumbsOpen] = useState(true);

  return (
    <div className="mt-14 min-w-0">
      <details
        className="min-w-0 border-b border-border/60 open:pb-1 open:[&>summary]:border-b-transparent open:[&>summary>span.chev]:rotate-180"
        open={graphicOpen}
        onToggle={(e) => setGraphicOpen(e.currentTarget.open)}
      >
        <summary className={`w-full border-b border-border/60 py-3.5 ${detailsSummary}`}>
          <span className="tracking-[0.3em]">Graphic Design</span>
          <Chevron />
        </summary>

        <div className="ml-0 mt-1 border-l border-border/30 pl-3 md:pl-5">
          <details
            className="min-w-0 open:[&>summary]:border-transparent open:[&>summary]:text-text-primary open:[&>summary>span.chev]:rotate-180"
            open={logosOpen}
            onToggle={(e) => setLogosOpen(e.currentTarget.open)}
          >
            <summary className={subSummaryBase}>
              <span>Logo Design</span>
              <Chevron />
            </summary>
            <ul className="mt-3 grid list-none grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5">
              {LOGO_DESIGN_ITEMS.map((item) => (
                <li key={item.src} className="min-w-0">
                  <LogoAsset item={item} sizes="(max-width: 1024px) 50vw, 33vw" />
                </li>
              ))}
            </ul>
          </details>

          <details
            className="mt-2 min-w-0 open:[&>summary]:border-transparent open:[&>summary]:text-text-primary open:[&>summary>span.chev]:rotate-180"
            open={thumbsOpen}
            onToggle={(e) => setThumbsOpen(e.currentTarget.open)}
          >
            <summary className={subSummaryBase}>
              <span>Thumbnails</span>
              <Chevron />
            </summary>
            <ul className="mt-3 grid list-none grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {THUMBNAIL_ITEMS.map((item) => (
                <li key={item.src} className="min-w-0">
                  <figure className="group/asset m-0 min-w-0">
                    <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-bg">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover transition duration-500 ease-out group-hover/asset:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                      <div className={hoverOverlay} aria-hidden />
                      <p className={hoverLabel}>{item.label}</p>
                    </div>
                    <figcaption className="sr-only">{item.label}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </details>
    </div>
  );
}
