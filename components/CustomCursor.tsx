"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Lerp factor per frame — lower = more lag behind the pointer */
const LERP = 0.14;
const CIRCLE_PX = 40;

function distToRect(px: number, py: number, r: DOMRect) {
  const cx = Math.max(r.left, Math.min(px, r.right));
  const cy = Math.max(r.top, Math.min(py, r.bottom));
  return Math.hypot(px - cx, py - cy);
}

function smoothstep01(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

const TITLE_GLOW_RADIUS = 220;

function updateTitleProximityGlow(px: number, py: number) {
  document.querySelectorAll('[data-cursor-glow="title"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    const d = distToRect(px, py, rect);
    const raw = Math.max(0, 1 - d / TITLE_GLOW_RADIUS);
    node.style.setProperty("--cursor-prox", smoothstep01(raw).toFixed(4));
  });
}

function clearTitleProximityGlow() {
  document.querySelectorAll('[data-cursor-glow="title"]').forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.removeProperty("--cursor-prox");
    }
  });
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const circleRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

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
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;
      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      updateTitleProximityGlow(pos.current.x, pos.current.y);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      clearTitleProximityGlow();
    };
  }, [enabled, onMove]);

  useEffect(() => {
    document.body.classList.toggle("cursor-custom", enabled);
    return () => document.body.classList.remove("cursor-custom");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={circleRef}
      className="pointer-events-none fixed left-0 top-0 rounded-full bg-white"
      style={{
        width: CIRCLE_PX,
        height: CIRCLE_PX,
        zIndex: 9999,
        mixBlendMode: "difference",
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
      }}
      aria-hidden
    />
  );
}
