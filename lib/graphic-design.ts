/** Public URLs under /graphic-design/logos and /graphic-design/thumbnails */

export type LogoDesignItem = {
  src: string;
  label: string;
} & ({ media: "image" } | { media: "pdf" });

export const LOGO_DESIGN_ITEMS: LogoDesignItem[] = [
  { src: "/graphic-design/logos/LUDA_AI_UPDATED.png", label: "Luda AI · Brand Logo", media: "image" },
  { src: "/graphic-design/logos/LUDA_FAVI.png", label: "Luda AI · App Icon", media: "image" },
  { src: "/graphic-design/logos/luda_behiive_banner.png", label: "Luda AI · Campaign Banner", media: "image" },
  { src: "/graphic-design/logos/envowllinkedin.jpg", label: "Envowl · LinkedIn Banner", media: "image" },
  { src: "/graphic-design/logos/envowlbanner_LIGHT.pdf", label: "Envowl · Brand Logo", media: "pdf" },
  { src: "/graphic-design/logos/fav_1k_x_1k_.png", label: "Envowl · App Icon", media: "image" },
];

export const THUMBNAIL_ITEMS: { src: string; label: string }[] = [
  { src: "/graphic-design/thumbnails/relentless_thumb_page-0001.jpg", label: "Relentless" },
  { src: "/graphic-design/thumbnails/comparison_page-0001.jpg", label: "Comparison is Fuel" },
  { src: "/graphic-design/thumbnails/yourbrain_page-0001.jpg", label: "Your Brain on AI" },
];
