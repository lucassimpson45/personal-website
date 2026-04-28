import Link from "next/link";

export function BusinessArticleNav() {
  return (
    <nav className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
      <Link
        href="/#portfolio"
        className="text-accent/90 underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        ← What I&apos;ve built
      </Link>
      <span className="mx-2 text-border">/</span>
      <span className="text-text-primary/70">Businesses</span>
    </nav>
  );
}
