"use client";

import {
  TECH_BRAND_ICONS,
  type BrandIconData,
  type TechBrandKey,
} from "@/lib/tech-brand-icons";
import { useCallback, useState } from "react";

type TechEntry =
  | { kind: "brand"; key: TechBrandKey; label: string }
  | {
      kind: "local";
      src: string;
      label: string;
      abbr: string;
      hex: string;
      /** Light marks on transparent (skip invert so they stay white) */
      rasterLight?: boolean;
    };

/** Custom PNG marks (public/logos) — order matches provided assets */
const TECH: TechEntry[] = [
  {
    kind: "local",
    src: "/logos/canva.png",
    abbr: "Ca",
    hex: "00C4CC",
    label: "Canva",
  },
  {
    kind: "local",
    src: "/logos/adobe-photoshop.png",
    abbr: "Ps",
    hex: "31A8FF",
    label: "Photoshop",
  },
  {
    kind: "local",
    src: "/logos/adobe-illustrator.png",
    abbr: "Ai",
    hex: "FF9A00",
    label: "Illustrator",
  },
  {
    kind: "local",
    src: "/logos/adobe-lightroom.png",
    abbr: "Lr",
    hex: "31A8FF",
    label: "Lightroom",
  },
  {
    kind: "local",
    src: "/logos/adobe-premiere.png",
    abbr: "Pr",
    hex: "9999FF",
    label: "Premiere Pro",
  },
  {
    kind: "local",
    src: "/logos/retell.png",
    abbr: "Re",
    hex: "7C9FFF",
    label: "Retell",
    rasterLight: true,
  },
  {
    kind: "local",
    src: "/logos/vscode.png",
    abbr: "VS",
    hex: "007ACC",
    label: "VS Code",
  },
  {
    kind: "local",
    src: "/logos/adobe-creative-cloud.png",
    abbr: "Cc",
    hex: "DA1F26",
    label: "Creative Cloud",
  },
  { kind: "brand", key: "cursor", label: "Cursor" },
  { kind: "brand", key: "notion", label: "Notion" },
  { kind: "brand", key: "n8n", label: "n8n" },
  { kind: "brand", key: "claude", label: "Claude" },
  { kind: "brand", key: "googlegemini", label: "Gemini" },
  { kind: "brand", key: "github", label: "GitHub" },
  { kind: "brand", key: "vercel", label: "Vercel" },
];

const MARQUEE_SVG_FILL = "#f2f2f2";

function BrandSvg({ icon }: { icon: BrandIconData }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-9 shrink-0"
      aria-hidden
    >
      <title>{icon.title}</title>
      <path fill={MARQUEE_SVG_FILL} d={icon.path} />
    </svg>
  );
}

function MonogramChip({ abbr }: { abbr: string }) {
  return (
    <span className="tech-marquee-monogram font-mono text-[11px] font-semibold tracking-tight text-white/90">
      {abbr}
    </span>
  );
}

function LocalLogo({
  src,
  label,
  abbr,
  rasterLight,
}: {
  src: string;
  label: string;
  abbr: string;
  hex: string;
  rasterLight?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  if (failed) {
    return <MonogramChip abbr={abbr} />;
  }

  const rasterClass = rasterLight
    ? "tech-marquee-raster-light object-contain h-9 w-9 shrink-0 sm:h-11 sm:w-11"
    : "tech-marquee-raster-dark object-contain h-9 w-9 shrink-0 sm:h-11 sm:w-11";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static PNGs in /public/logos
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      className={rasterClass}
      onError={onError}
      title={label}
    />
  );
}

function Cell({ entry }: { entry: TechEntry }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      {entry.kind === "brand" ? (
        <BrandSvg icon={TECH_BRAND_ICONS[entry.key]} />
      ) : (
        <LocalLogo
          src={entry.src}
          label={entry.label}
          abbr={entry.abbr}
          hex={entry.hex}
          rasterLight={entry.rasterLight}
        />
      )}
      <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-text-secondary">
        {entry.label}
      </span>
    </div>
  );
}

function Row({ items, suffix }: { items: TechEntry[]; suffix: string }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-12 sm:pr-12 md:gap-16 md:pr-16">
      {items.map((entry, i) => (
        <div key={`${suffix}-${entry.label}-${i}`}>
          <Cell entry={entry} />
        </div>
      ))}
    </div>
  );
}

export function TechMarquee() {
  return (
    <div className="isolate relative left-1/2 right-1/2 -mx-[50vw] w-screen max-w-[100vw] overflow-hidden border-y border-border/60 bg-bg/40 py-8 backdrop-blur-[2px] sm:py-12">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent sm:w-24" />
      <div className="flex w-max will-change-transform motion-reduce:animate-none max-md:animate-marquee-sm md:animate-marquee">
        <Row items={TECH} suffix="a" />
        <Row items={TECH} suffix="b" />
      </div>
    </div>
  );
}
