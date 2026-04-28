"use client";

import { motion } from "framer-motion";

export function LearnSection() {
  return (
    <section
      id="learn"
      className="relative z-20 border-t border-border bg-bg px-6 py-36 md:px-12 md:py-44"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <h2 className="font-display text-5xl tracking-[0.35em] text-text-primary md:text-7xl md:tracking-[0.45em]">
          COMING SOON
        </h2>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">
          Something is being built here.
        </p>
        <div className="mt-12 h-px w-32 bg-gradient-to-r from-transparent via-accent/60 to-transparent shadow-glow-sm" />
      </motion.div>
    </section>
  );
}
