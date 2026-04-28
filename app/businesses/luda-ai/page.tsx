import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BusinessArticleNav } from "@/components/BusinessArticleNav";

export const metadata: Metadata = {
  title: "Luda AI | Lucas Simpson",
  description:
    "AI automation for trade businesses — missed calls, follow-ups, bookings, and reviews without adding headcount.",
};

const handles = [
  "Every missed call",
  "Follow-ups and lead qualification",
  "Appointment booking",
  "Review requests",
];

const values: { title: string; body: string }[] = [
  {
    title: "Built for the Real World",
    body: "Designed for trucks, job sites, and missed calls. Your business runs in the field; your automation should too.",
  },
  {
    title: "People-First Partnership",
    body: "We work with you, not around you. Clear expectations, real humans when you need them, systems that match how you already run jobs.",
  },
  {
    title: "Growth Without Limits",
    body: "As you add crews, services, or territories, Luda scales with demand, not against it.",
  },
  {
    title: "Integrity & Trust",
    body: "Straightforward pricing, no bait-and-switch, and automation that represents your brand honestly.",
  },
];

export default function LudaAiPage() {
  return (
    <article className="relative z-20 min-h-screen border-b border-border bg-bg px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-2xl">
        <BusinessArticleNav />

        <header className="mt-12 border-b border-border pb-12">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-[min(100%,18rem)] font-mono text-[10px] uppercase leading-relaxed tracking-[0.32em] text-accent/90 sm:max-w-xl">
              AI automation for trade businesses
            </p>
            <div className="relative h-16 w-36 shrink-0 sm:h-[4.5rem] sm:w-40">
              <Image
                src="/logos/luda.png"
                alt="Luda AI"
                fill
                data-cursor-glow="logo"
                className="bus-logo object-contain object-right"
                sizes="160px"
                priority
              />
            </div>
          </div>
          <h1 className="mt-8 font-display text-3xl leading-tight tracking-[0.06em] text-text-primary sm:mt-10 md:text-4xl md:tracking-[0.08em]">
            The trades don&apos;t sleep. Neither does Luda.
          </h1>
        </header>

        <div className="mt-14 space-y-6 text-sm leading-relaxed text-text-secondary md:text-base">
          <p>
            Luda AI handles every missed call, follow-up, booking, and review request — so you can stay on the
            tools without losing the next job.
          </p>
          <p>
            The trades run the world. Plumbers, electricians, HVAC techs, contractors — they keep everything
            working. But while they&apos;re on job sites, under sinks, and on rooftops, calls go unanswered. Leads go
            cold. Jobs get lost. Hiring a full-time receptionist to fix that isn&apos;t realistic for most operators
            running lean crews.
          </p>
          <p>
            Luda is the solution built specifically for that world — not for SaaS dashboards, not for enterprise software
            teams. For the guy running three trucks out of New Jersey who needs every call answered and every job
            booked without adding headcount.
          </p>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-xl tracking-[0.14em] text-text-primary md:text-2xl">What Luda handles</h2>
          <ul className="mt-5 space-y-3 border-l border-accent/25 pl-5 font-mono text-[13px] leading-relaxed text-text-primary/90 md:text-sm">
            {handles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-xl tracking-[0.14em] text-text-primary md:text-2xl">
            The values behind it
          </h2>
          <div className="mt-8 space-y-10">
            {values.map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-display text-lg tracking-[0.1em] text-text-primary md:text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary md:text-base">— {body}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 font-display text-lg tracking-[0.08em] text-text-primary md:text-xl">
          Built for the businesses that keep the world running.
        </p>

        <div className="mt-10">
          <a
            href="https://goluda.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded border border-accent/50 bg-accent/10 px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-primary shadow-glow-sm transition hover:border-accent hover:bg-accent/15 hover:shadow-glow"
            data-cursor-hover
          >
            Book a Free Demo →
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
