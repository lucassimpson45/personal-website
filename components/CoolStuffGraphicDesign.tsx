"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { LOGO_DESIGN_ITEMS, THUMBNAIL_ITEMS, type LogoDesignItem } from "@/lib/graphic-design";

const hoverOverlay =
  "pointer-events-none absolute inset-0 bg-bg/0 transition-colors duration-300 group-hover/asset:bg-bg/70";
const hoverLabel =
  "pointer-events-none absolute inset-0 flex items-center justify-center p-2 text-center font-mono text-[7px] uppercase leading-snug tracking-[0.18em] text-text-primary opacity-0 transition-opacity duration-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] sm:p-3 sm:text-[8px] sm:tracking-[0.2em] group-hover/asset:opacity-100";

const thumbHoverLabel =
  "pointer-events-none absolute inset-0 flex items-center justify-center p-3 text-center font-mono text-[8px] uppercase leading-snug tracking-[0.2em] text-text-primary opacity-0 transition-opacity duration-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.95)] sm:text-[9px] sm:tracking-[0.22em] group-hover/asset:opacity-100 md:text-[10px] md:tracking-[0.24em]";

const detailsLabel =
  "flex w-full cursor-pointer list-none items-center justify-between gap-2 border-b border-border/45 py-3.5 pl-0 pr-1 text-left font-mono text-[10px] uppercase tracking-[0.26em] text-text-secondary transition-colors hover:text-text-primary/80";

function SubAccordionContent({ open, children, className = "" }: { open: boolean; children: ReactNode; className?: string }) {
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

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`shrink-0 text-[7px] text-text-secondary/80 transition duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      ▼
    </span>
  );
}

function LogoAsset({ item, sizes }: { item: LogoDesignItem; sizes: string }) {
  return (
    <figure className="group/asset m-0 min-w-0">
      <div className="relative aspect-[3/2] w-full min-w-0 overflow-hidden bg-bg">
        {item.media === "pdf" ? (
          <object
            data={item.src}
            type="application/pdf"
            className="pointer-events-none absolute inset-0 h-full w-full bg-bg"
            aria-label={item.label}
          >
            <a
              href={item.src}
              className="absolute inset-0 flex items-center justify-center p-2 text-center font-mono text-[7px] uppercase tracking-[0.2em] text-text-secondary underline sm:text-[8px]"
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

function ThumbnailCard({ item, sizes }: { item: { src: string; label: string }; sizes: string }) {
  return (
    <figure className="group/asset m-0 min-w-0">
      <div className="relative aspect-video w-full min-w-0 overflow-hidden bg-bg">
        <Image
          src={item.src}
          alt={item.label}
          fill
          className="object-cover transition duration-500 ease-out group-hover/asset:scale-[1.02]"
          sizes={sizes}
        />
        <div className={hoverOverlay} aria-hidden />
        <p className={thumbHoverLabel}>
          {item.label}
        </p>
      </div>
      <figcaption className="sr-only">{item.label}</figcaption>
    </figure>
  );
}

/**
 * Logo + Thumbnail sub-accordions (used inside Cool Stuff → Graphic Design panel).
 * Parent "Graphic Design" row lives in `CoolStuffPanel`.
 */
export function CoolStuffGraphicContent() {
  const [logosOpen, setLogosOpen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(false);

  return (
    <div className="ml-0 min-w-0 border-l border-border/30 pl-3 md:pl-5">
      <div>
        <button
          type="button"
          id="sub-tab-logos"
          aria-expanded={logosOpen}
          aria-controls="sub-panel-logos"
          onClick={() => setLogosOpen((o) => !o)}
          className={`${detailsLabel} w-full ${
            logosOpen ? "border-border/25 text-text-primary" : "text-text-secondary"
          }`}
        >
          <span>Logo Design</span>
          <Chevron open={logosOpen} />
        </button>
        <SubAccordionContent open={logosOpen}>
          <ul
            id="sub-panel-logos"
            role="region"
            aria-labelledby="sub-tab-logos"
            className="isolate mt-1 grid list-none grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-2 lg:grid-cols-4 lg:gap-2.5"
          >
            {LOGO_DESIGN_ITEMS.map((item) => (
              <li key={item.src} className="min-w-0 max-w-full">
                <LogoAsset
                  item={item}
                  sizes="(max-width: 768px) 42vw, (max-width: 1024px) 30vw, 24vw"
                />
              </li>
            ))}
          </ul>
        </SubAccordionContent>
      </div>

      <div className="mt-1">
        <button
          type="button"
          id="sub-tab-thumbs"
          aria-expanded={thumbsOpen}
          aria-controls="sub-panel-thumbs"
          onClick={() => setThumbsOpen((o) => !o)}
          className={`${detailsLabel} w-full ${
            thumbsOpen ? "border-border/25 text-text-primary" : "text-text-secondary"
          }`}
        >
          <span>Thumbnails</span>
          <Chevron open={thumbsOpen} />
        </button>
        <SubAccordionContent open={thumbsOpen}>
          <ul
            id="sub-panel-thumbs"
            role="region"
            aria-labelledby="sub-tab-thumbs"
            className="mt-1 grid list-none grid-cols-2 gap-3 sm:gap-3 lg:grid-cols-3 lg:gap-4"
          >
            {THUMBNAIL_ITEMS.map((item) => (
              <li key={item.src} className="min-w-0">
                <ThumbnailCard item={item} sizes="(max-width: 1024px) 45vw, 33vw" />
              </li>
            ))}
          </ul>
        </SubAccordionContent>
      </div>
    </div>
  );
}
