"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LERP_DOT = 0.35;
const LERP_AURA = 0.12;
const LERP_SPOT = 0.08;

const GLOW_RADIUS = 220;

function distToRect(px: number, py: number, r: DOMRect) {
  const cx = Math.max(r.left, Math.min(px, r.right));
  const cy = Math.max(r.top, Math.min(py, r.bottom));
  return Math.hypot(px - cx, py - cy);
}

function smoothstep01(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function updateProximityGlow(px: number, py: number) {
  document.querySelectorAll("[data-cursor-glow]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const d = distToRect(px, py, rect);
    const raw = Math.max(0, 1 - d / GLOW_RADIUS);
    node.style.setProperty("--cursor-prox", smoothstep01(raw).toFixed(4));
  });
}

function clearProximityGlow() {
  document.querySelectorAll("[data-cursor-glow]").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.removeProperty("--cursor-prox");
    }
  });
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const aura = useRef({ x: -100, y: -100 });
  const spot = useRef({ x: -100, y: -100 });
  const dotEl = useRef<HTMLDivElement>(null);
  const auraEl = useRef<HTMLDivElement>(null);
  const spotEl = useRef<HTMLDivElement>(null);
  const hotEl = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      dot.current.x += (target.current.x - dot.current.x) * LERP_DOT;
      dot.current.y += (target.current.y - dot.current.y) * LERP_DOT;
      aura.current.x += (target.current.x - aura.current.x) * LERP_AURA;
      aura.current.y += (target.current.y - aura.current.y) * LERP_AURA;
      spot.current.x += (target.current.x - spot.current.x) * LERP_SPOT;
      spot.current.y += (target.current.y - spot.current.y) * LERP_SPOT;

      if (dotEl.current) {
        dotEl.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (auraEl.current) {
        auraEl.current.style.transform = `translate3d(${aura.current.x}px, ${aura.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (spotEl.current) {
        const { x, y } = spot.current;
        spotEl.current.style.background = `radial-gradient(72vmin 58vmin at ${x}px ${y}px, rgba(210, 220, 255, 0.46), rgba(120, 90, 220, 0.3) 28%, rgba(255, 140, 200, 0.16) 46%, rgba(40, 60, 120, 0.1) 58%, transparent 72%)`;
      }
      if (hotEl.current) {
        const { x, y } = dot.current;
        hotEl.current.style.background = `radial-gradient(200px 200px at ${x}px ${y}px, rgba(255, 248, 232, 0.52) 0%, rgba(255, 220, 175, 0.16) 42%, transparent 68%)`;
      }
      updateProximityGlow(dot.current.x, dot.current.y);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      clearProximityGlow();
    };
  }, [enabled, onMove]);

  useEffect(() => {
    if (!enabled) return;
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (
        t.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor-hover]",
        )
      ) {
        setHovering(true);
      }
    };
    const onOut = (e: Event) => {
      const me = e as MouseEvent;
      const t = me.target as HTMLElement | null;
      const rel = me.relatedTarget as HTMLElement | null;
      if (
        t?.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor-hover]",
        ) &&
        !rel?.closest(
          "a, button, [role='button'], input, textarea, select, [data-cursor-hover]",
        )
      ) {
        setHovering(false);
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [enabled]);

  useEffect(() => {
    document.body.classList.toggle("cursor-custom", enabled);
    return () => document.body.classList.remove("cursor-custom");
  }, [enabled]);

  if (!enabled) return null;

  const scale = hovering ? 1.45 : 1;
  const accent = hovering ? "rgba(200, 216, 255, 0.95)" : "rgba(220, 228, 255, 0.85)";

  return (
    <>
      <div
        ref={spotEl}
        className="pointer-events-none fixed inset-0 z-[12] transition-opacity duration-300"
        style={{
          mixBlendMode: "soft-light",
          opacity: hovering ? 0.92 : 0.72,
          background:
            "radial-gradient(72vmin 58vmin at -100px -100px, rgba(210, 220, 255, 0.42), rgba(120, 90, 220, 0.28) 28%, rgba(255, 140, 200, 0.14) 46%, rgba(40, 60, 120, 0.08) 58%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        ref={hotEl}
        className="pointer-events-none fixed inset-0 z-[13] transition-opacity duration-300"
        style={{
          mixBlendMode: "overlay",
          opacity: hovering ? 0.42 : 0.3,
          background:
            "radial-gradient(200px 200px at -100px -100px, rgba(255, 248, 232, 0.52) 0%, rgba(255, 220, 175, 0.16) 42%, transparent 68%)",
        }}
        aria-hidden
      />
      <div
        ref={auraEl}
        className="pointer-events-none fixed left-0 top-0 z-[10001] h-[60px] w-[60px] rounded-full mix-blend-screen transition-colors duration-300"
        style={{
          background: `radial-gradient(circle, rgba(200, 216, 255, 0.22) 0%, transparent 70%)`,
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(${scale})`,
        }}
      />
      <div
        ref={dotEl}
        className="pointer-events-none fixed left-0 top-0 z-[10002] h-3 w-3 rounded-full shadow-glow-sm transition-[background,box-shadow] duration-200"
        style={{
          background: accent,
          boxShadow: hovering
            ? "0 0 24px rgba(200, 216, 255, 0.9), 0 0 48px rgba(180, 210, 255, 0.35)"
            : "0 0 12px rgba(200, 216, 255, 0.5)",
          transform: `translate3d(-100px, -100px, 0) translate(-50%, -50%) scale(${scale})`,
        }}
      />
    </>
  );
}
