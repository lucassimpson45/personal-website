/**
 * Warm “sun” in the hero top corner — blends with the scene and title (soft-light / screen).
 */
export function HeroSunBloom() {
  return (
    <div
      className="pointer-events-none absolute -right-[10%] top-0 z-[14] h-[min(92vmin,820px)] w-[min(92vmin,820px)] translate-x-[14%] -translate-y-[22%]"
      aria-hidden
    >
      <div className="hero-sun-core absolute inset-0 rounded-full" />
      <div className="hero-sun-halo absolute inset-[6%] rounded-full blur-3xl" />
    </div>
  );
}
