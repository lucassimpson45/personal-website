/** Showcase data for the Portfolio “What I’ve built” tabs (Projects + Content). */

export type ShowcaseProject = {
  slug: string;
  href: string;
  title: string;
  /** Top-right mark on the portfolio card (e.g. Luda logo) */
  logoSrc: string;
  /** Small accent line under the label, like business `cardTag` */
  cardTag: string;
  /** Short body under the title on the card only */
  cardSummary: string;
  /** Long-form copy for the project case-study page */
  description: string;
  pageMetaDescription: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
  imageSrc2?: string;
  imageAlt2?: string;
  imageCaption?: string;
  imageCaption2?: string;
  /** Optional footer CTA (e.g. public product site) */
  cta?: { href: string; label: string };
  /** One quiet line under tag pills: stack + tooling (not a second narrative paragraph) */
  techFootnote?: string;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "luda-client-dashboard",
    href: "/projects/luda-client-dashboard",
    title: "Luda AI Client Dashboard",
    logoSrc: "/logos/luda.png",
    cardTag: "Admin console & per-client portal",
    cardSummary:
      "Gives you and your clients live visibility into calls, bookings, and outcomes from the Luda product—no static reports, all interactive.",
    description:
      "A full web app my co-founder and I use on the admin side, and that each Luda client opens in their own portal: it pulls live performance from the automations live on their business—calls, bookings, outcomes, and trends—so owners and crews see exactly what the product is doing day to day. The UI is fully interactive (filters, date views, exports, and tabbed areas for receptionist, follow-up, reviews, and outbound), aligned with the same AI reception and workflow story as you’ll read on goluda.ai.\n\nUnder the hood it’s a Next.js app written in TypeScript and React (`.tsx`), styled with Tailwind, talking to Supabase for data—plus the usual JSON and JS config files (`package.json`, `next.config`, etc.) that `next build` compiles with SWC.",
    pageMetaDescription:
      "Interactive Luda AI admin and client dashboard: live call stats, bookings, and outcomes for every tradesperson using the product. Built for transparency between Luda, clients, and their data.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    imageSrc: "/projects/luda-admin.png",
    imageAlt: "Luda AI admin dashboard with client list and key metrics",
    imageCaption: "Admin — team console for Luda AI",
    imageSrc2: "/projects/luda-client-dashboard.png",
    imageAlt2:
      "Luda AI client portal with KPIs, charts, and recent calls for a plumbing business",
    imageCaption2: "Client portal — live stats for each business",
    cta: { href: "https://goluda.ai", label: "Learn about Luda at goluda.ai →" },
  },
  {
    slug: "i-am-manifested",
    href: "/projects/i-am-manifested",
    title: "I Am Manifested",
    logoSrc: "/logos/i-am-manifested.png",
    cardTag: "Human design · gene keys · daily practice",
    cardSummary:
      "A subscription app for a life coach’s community: birth-data onboarding, a stored cosmic blueprint (Human Design, Gene Keys, natal), and a full product for manifestations, journal, practices, and daily check-ins—payments, auth, and AI in one place.",
    description:
      "I Am Manifested is a subscription web app for a life-coach client, built around Human Design, Gene Keys, and Western natal astrology woven into guided manifestation work. People land on a marketing experience, then sign up, enter birth data, and go through paywall and onboarding. From there they carry a stored cosmic blueprint—type, strategy, and authority, defined centers and channels, Gene Key paths, narrative, and optional chart data—that personalizes the whole product.\n\nInside the app, members shape intentions with an AI-assisted manifestation flow and per-intention chat, keep a journal with prompts and entries, run practices they can log, and stay engaged with daily check-ins, streaks, and an “energy bank” metaphor. There’s a dashboard and profile, structured inquiries, settings (including account deletion), legal and disclaimer pages, and admin tools for stats, user lookup, and HD recalc when you need to fix or refresh someone’s design.",
    pageMetaDescription:
      "I Am Manifested: subscription app combining Human Design, Gene Keys, and natal work with AI-guided manifestation, journal, practices, and Stripe/Supabase-backed product flows.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "Anthropic"],
    techFootnote:
      "App Router, API routes, TypeScript, Tailwind, Supabase (auth/SSR), Stripe, Anthropic, natalengine and the HD pipeline, Luxon, and a single access gate for sessions, trials, paywall, and onboarding order.",
    imageSrc: "/projects/i-am-manifested-landing.png",
    imageAlt:
      "I Am Manifested landing page with hero, Human Design, Gene Keys, and manifestation feature cards",
    imageCaption: "Marketing — offer, positioning, and journey CTA",
    imageSrc2: "/projects/i-am-manifested-dashboard.png",
    imageAlt2:
      "I Am Manifested app home with daily check-in, sidebar navigation, and manifestation list",
    imageCaption2: "Client app — daily ritual, navigation, and manifestations",
  },
];

const projectsBySlug = new Map(
  showcaseProjects.map((p) => [p.slug, p] as const),
);

export const SHOWCASE_PROJECT_SLUGS: string[] = showcaseProjects.map((p) => p.slug);

export function getShowcaseProjectBySlug(slug: string): ShowcaseProject | undefined {
  return projectsBySlug.get(slug);
}
