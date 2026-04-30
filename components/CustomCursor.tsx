"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LERP = 0.12;
const CURSOR_DIAMETER_PX = 60;
const TITLE_GLOW_PROXIMITY_PX = 150;

function distToRect(px: number, py: number, r: DOMRect) {
  const cx = Math.max(r.left, Math.min(px, r.right));
  const cy = Math.max(r.top, Math.min(py, r.bottom));
  return Math.hypot(px - cx, py - cy);
}

function updateTitleGlowProximity(px: number, py: number) {
  document.querySelectorAll('[data-cursor-glow="title"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const d = distToRect(px, py, rect);
    if (d <= TITLE_GLOW_PROXIMITY_PX) {
      node.classList.add("glow-active");
    } else {
      node.classList.remove("glow-active");
    }
  });
}

function clearTitleGlowActive() {
  document.querySelectorAll('[data-cursor-glow="title"]').forEach((node) => {
    if (node instanceof HTMLElement) {
      node.classList.remove("glow-active");
    }
  });
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const ringRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    target.current.x = e.clientX;
    target.current.y = e.clientY;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;
      const el = ringRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      updateTitleGlowProximity(pos.current.x, pos.current.y);
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
      clearTitleGlowActive();
    };
  }, [enabled, onMove]);

  useEffect(() => {
    document.body.classList.toggle("cursor-custom", enabled);
    return () => document.body.classList.remove("cursor-custom");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      clearTitleGlowActive();
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 rounded-full bg-white"
      style={{
        width: CURSOR_DIAMETER_PX,
        height: CURSOR_DIAMETER_PX,
        zIndex: 9999,
        mixBlendMode: "difference",
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }}
    />
  );
}
