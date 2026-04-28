import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BusinessArticleNav } from "@/components/BusinessArticleNav";

export const metadata: Metadata = {
  title: "ENVOWL | Lucas Simpson",
  description:
    "Curated AI talent marketplace — businesses find vetted experts; creators find qualified projects with real scope.",
};

const whoWeServe = [
  "Businesses that need practical AI implementation support — not consultants who disappear after the pitch.",
  "Professionals that want trusted AI guidance tailored to their specific role and workflow.",
  "Vetted AI creators, agencies, and freelancers seeking qualified leads from buyers who actually know what they want.",
];

export default function EnvowlPage() {
  return (
    <article className="relative z-20 min-h-screen border-b border-border bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-2xl">
        <BusinessArticleNav />

        <header className="mt-12 border-b border-border pb-12">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-[min(100%,14rem)] font-mono text-[10px] uppercase leading-relaxed tracking-[0.32em] text-accent/90 sm:max-w-md">
              AI talent marketplace
            </p>
            <div className="relative h-14 w-36 shrink-0 sm:h-16 sm:w-44">
              <Image
                src="/logos/envowl.png"
                alt="ENVOWL"
                fill
                data-cursor-glow="logo"
                className="bus-logo object-contain object-right"
                sizes="176px"
                priority
              />
            </div>
          </div>
          <h1 className="mt-8 font-display text-3xl leading-tight tracking-[0.06em] text-text-primary sm:mt-10 md:text-4xl md:tracking-[0.08em]">
            AI expertise, matched correctly.
          </h1>
        </header>

        <div className="mt-14 space-y-6 text-sm leading-relaxed text-text-secondary md:text-base">
          <p>
            Most businesses know they need AI. Few know where to start, who to trust, or how to find someone who can
            actually deliver.
          </p>
          <p>
            Envowl is a curated AI talent marketplace that solves the mismatch on both sides. Businesses and
            professionals use Envowl to find vetted AI experts. Creators, agencies, and freelancers use Envowl to find
            qualified projects with clearer scope and real expectations — not a race to the bottom.
          </p>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-xl tracking-[0.14em] text-text-primary md:text-2xl">Who Envowl serves</h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary md:text-base">
            {whoWeServe.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-xl tracking-[0.14em] text-text-primary md:text-2xl">How trust works</h2>
          <p className="mt-5 text-sm leading-relaxed text-text-secondary md:text-base">
            Envowl is not an open directory. Every creator is reviewed for portfolio quality, delivery credibility, and
            fit before they&apos;re listed. That reduces mismatch risk for buyers and improves lead quality for creators.
            Both sides win.
          </p>
        </section>

        <p className="mt-12 text-sm leading-relaxed text-text-secondary md:text-base">
          The idea is simple: AI knowledge has real economic value. Envowl is the place where that value gets exchanged
          fairly, clearly, and without the noise.
        </p>

        <div className="mt-10">
          <a
            href="https://envowl.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded border border-accent/50 bg-accent/10 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-primary shadow-glow-sm transition hover:border-accent hover:bg-accent/15 hover:shadow-glow"
            data-cursor-hover
          >
            Explore Envowl →
          </a>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-text-secondary/80">
          <Link href="/" className="text-accent/80 hover:text-accent hover:underline">
            Home
          </Link>
        </p>
      </div>
    </article>
  );
}
