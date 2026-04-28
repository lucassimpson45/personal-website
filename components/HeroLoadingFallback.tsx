/** Placeholder while the hero chunk loads — matches hero height so layout doesn’t jump. */
export function HeroLoadingFallback() {
  return (
    <section
      id="home"
      className="relative z-0 h-[480vh] bg-bg"
      aria-hidden
    >
      <div className="sticky top-0 flex h-screen flex-col items-center bg-bg px-6 pb-16 pt-28 text-center md:pt-32">
        <h1 className="font-display text-5xl tracking-[0.28em] text-text-primary/80 md:text-7xl md:tracking-[0.32em]">
          LUCAS SIMPSON
        </h1>
        <div className="mt-8 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
    </section>
  );
}
