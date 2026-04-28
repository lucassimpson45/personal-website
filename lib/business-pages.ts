export type BusinessSlug = "luda-ai" | "envowl";

export type BusinessCard = {
  slug: BusinessSlug;
  name: string;
  href: string;
  logoSrc: string;
  /** Small mono label on portfolio cards */
  cardTag: string;
  /** One-line preview under the name */
  cardSummary: string;
};

export const BUSINESS_SLUGS: BusinessSlug[] = ["luda-ai", "envowl"];

export const BUSINESSES_BY_SLUG: Record<BusinessSlug, BusinessCard> = {
  "luda-ai": {
    slug: "luda-ai",
    name: "Luda AI",
    href: "/businesses/luda-ai",
    logoSrc: "/logos/luda.png",
    cardTag: "AI automation for trade businesses",
    cardSummary:
      "Every missed call, follow-up, booking, and review request — so you can stay on the tools without losing the next job.",
  },
  envowl: {
    slug: "envowl",
    name: "ENVOWL",
    href: "/businesses/envowl",
    logoSrc: "/logos/envowl.png",
    cardTag: "AI talent marketplace",
    cardSummary:
      "Curated AI experts for businesses — and qualified projects for creators, agencies, and freelancers.",
  },
};
