/**
 * Backlit “sun” behind the hero — top-center, scaled down, read as a distant light source.
 */
export function HeroSunBloom() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-0 z-0 h-[min(92vmin,820px)] w-[min(92vmin,820px)] -translate-x-1/2 -translate-y-[42%] scale-[0.7] [transform-origin:50%_0%]"
      aria-hidden
    >
      <div className="hero-sun-core absolute inset-0 rounded-full" />
      <div className="hero-sun-halo absolute inset-[6%] rounded-full blur-3xl" />
    </div>
  );
}
