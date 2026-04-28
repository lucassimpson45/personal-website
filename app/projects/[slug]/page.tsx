import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectArticleNav } from "@/components/ProjectArticleNav";
import { getShowcaseProjectBySlug, SHOWCASE_PROJECT_SLUGS, type ShowcaseProject } from "@/lib/portfolio-showcase";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return SHOWCASE_PROJECT_SLUGS.map((slug) => ({ slug }));
}

function metadataFor(p: ShowcaseProject): Metadata {
  return {
    title: `${p.title} | Lucas Simpson`,
    description: p.pageMetaDescription,
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const p = getShowcaseProjectBySlug(params.slug);
  if (!p) {
    return { title: "Project | Lucas Simpson" };
  }
  return metadataFor(p);
}

export default function ProjectCaseStudyPage({ params }: Props) {
  const p = getShowcaseProjectBySlug(params.slug);
  if (!p) {
    notFound();
  }

  return (
    <article className="relative z-20 min-h-screen border-b border-border bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-2xl">
        <ProjectArticleNav />

        <header className="mt-12 border-b border-border pb-12">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.32em] text-accent/90">Project</p>
          <h1 className="mt-6 font-display text-3xl leading-tight tracking-[0.06em] text-text-primary md:text-4xl md:tracking-[0.08em]">
            {p.title}
          </h1>
        </header>

        {p.imageSrc2 ? (
          <div className="mt-12 space-y-10">
            <figure>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-surface-2">
                <Image
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 672px) 100vw, 672px"
                  priority
                />
              </div>
              {p.imageCaption ? (
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {p.imageCaption}
                </figcaption>
              ) : null}
            </figure>
            <figure>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/60 bg-surface-2">
                <Image
                  src={p.imageSrc2}
                  alt={p.imageAlt2 ?? ""}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 672px) 100vw, 672px"
                />
              </div>
              {p.imageCaption2 ? (
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary">
                  {p.imageCaption2}
                </figcaption>
              ) : null}
            </figure>
          </div>
        ) : (
          <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/60 bg-surface-2">
            <Image
              src={p.imageSrc}
              alt={p.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 672px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <div className="mt-12 space-y-5 text-sm leading-relaxed text-text-secondary md:text-base">
          {p.description.split("\n\n").map((block, i) => (
            <p key={i}>{block}</p>
          ))}
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-text-secondary"
            >
              {t}
            </li>
          ))}
        </ul>

        {p.techFootnote ? (
          <p className="mt-4 max-w-prose border-t border-border/40 pt-4 font-mono text-[9px] leading-relaxed tracking-[0.03em] text-text-secondary/55">
            {p.techFootnote}
          </p>
        ) : null}

        {p.cta ? (
          <div className="mt-12">
            <a
              href={p.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded border border-accent/50 bg-accent/10 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-primary shadow-glow-sm transition hover:border-accent hover:bg-accent/15 hover:shadow-glow"
              data-cursor-hover
            >
              {p.cta.label}
            </a>
          </div>
        ) : null}

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/80">
          <Link href="/" className="text-accent/80 hover:text-accent hover:underline">
            Home
          </Link>
        </p>
      </div>
    </article>
  );
}
