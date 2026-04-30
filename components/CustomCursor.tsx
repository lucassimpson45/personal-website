"use client";

import { type CSSProperties, useEffect, useRef, useSyncExternalStore } from "react";

const SQUARE_COUNT = 36;
const GLITCH_SQUARES = 8;
const GLOW_PROXIMITY_PX = 150;
const GLITCH_RESET_MS = 90;
const BLOOM_LERP = 0.1;
const TITLE_GLOW_SELECTOR = '[data-cursor-glow="title"]';
const INTERACTIVE_SELECTOR = "a, button, [data-cursor]";

const BLOOM_BG_NORMAL =
  "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)";

function distToRect(px: number, py: number, r: DOMRect): number {
  const cx = Math.max(r.left, Math.min(px, r.right));
  const cy = Math.max(r.top, Math.min(py, r.bottom));
  return Math.hypot(px - cx, py - cy);
}

function subscribePointerFine(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getPointerFineSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getPointerFineServerSnapshot(): boolean {
  return false;
}

function pickGlitchIndices(): number[] {
  const pool = Array.from({ length: SQUARE_COUNT }, (_, i) => i);
  const out: number[] = [];
  for (let k = 0; k < GLITCH_SQUARES; k++) {
    const j = Math.floor(Math.random() * pool.length);
    out.push(pool[j]!);
    pool.splice(j, 1);
  }
  return out;
}

function initSquareArrays() {
  const baseOffX: number[] = [];
  const baseOffY: number[] = [];
  const lerp: number[] = [];
  const curX: number[] = [];
  const curY: number[] = [];
  const glitchDx: number[] = [];
  const glitchDy: number[] = [];

  for (let i = 0; i < SQUARE_COUNT; i++) {
    const ox = Math.random() * 44 - 22;
    const oy = Math.random() * 44 - 22;
    baseOffX.push(ox);
    baseOffY.push(oy);
    lerp.push(Math.random() * 0.15 + 0.05);
    curX.push(ox);
    curY.push(oy);
    glitchDx.push(0);
    glitchDy.push(0);
  }

  return { baseOffX, baseOffY, lerp, curX, curY, glitchDx, glitchDy };
}

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(
    subscribePointerFine,
    getPointerFineSnapshot,
    getPointerFineServerSnapshot
  );

  const bloomRef = useRef<HTMLDivElement | null>(null);
  const bloomPosRef = useRef({ x: 0, y: 0 });
  const bloomGlitchUntilRef = useRef(0);
  const bloomHotRef = useRef(0);
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dataRef = useRef<ReturnType<typeof initSquareArrays> | null>(null);
  if (dataRef.current === null) {
    dataRef.current = initSquareArrays();
  }

  const mouseRef = useRef({ x: 0, y: 0 });
  const hoverInteractiveRef = useRef(false);
  const rafRef = useRef(0);
  const glitchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isFinePointer) return;

    document.body.classList.add("cursor-custom");

    const d = dataRef.current!;

    const clearTitleGlowActive = () => {
      document.querySelectorAll(TITLE_GLOW_SELECTOR).forEach((node) => {
        node.classList.remove("glow-active");
      });
    };

    const updateTitleGlow = (px: number, py: number) => {
      document.querySelectorAll(TITLE_GLOW_SELECTOR).forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        const dist = distToRect(px, py, rect);
        if (dist <= GLOW_PROXIMITY_PX) {
          node.classList.add("glow-active");
        } else {
          node.classList.remove("glow-active");
        }
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const t = e.target;
      if (t instanceof Element && t.closest(INTERACTIVE_SELECTOR)) {
        hoverInteractiveRef.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const rel = e.relatedTarget;
      if (!(rel instanceof Element) || !rel.closest(INTERACTIVE_SELECTOR)) {
        hoverInteractiveRef.current = false;
      }
    };

    const armGlitchBurst = () => {
      for (let i = 0; i < SQUARE_COUNT; i++) {
        d.glitchDx[i] = 0;
        d.glitchDy[i] = 0;
      }
      const idxs = pickGlitchIndices();
      for (const i of idxs) {
        d.glitchDx[i] = Math.random() * 60 - 30;
        d.glitchDy[i] = Math.random() * 60 - 30;
      }
      bloomHotRef.current = 1;
      bloomGlitchUntilRef.current = performance.now() + GLITCH_RESET_MS;
      if (glitchTimeoutRef.current !== null) {
        clearTimeout(glitchTimeoutRef.current);
      }
      glitchTimeoutRef.current = setTimeout(() => {
        glitchTimeoutRef.current = null;
        for (let i = 0; i < SQUARE_COUNT; i++) {
          d.glitchDx[i] = 0;
          d.glitchDy[i] = 0;
        }
      }, GLITCH_RESET_MS);
    };

    let syncedInitialPositions = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!syncedInitialPositions) {
        syncedInitialPositions = true;
        const scale = hoverInteractiveRef.current ? 1.6 : 1;
        bloomPosRef.current.x = e.clientX;
        bloomPosRef.current.y = e.clientY;
        const bloomEl = bloomRef.current;
        if (bloomEl) {
          bloomEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        }
        for (let i = 0; i < SQUARE_COUNT; i++) {
          d.curX[i] = e.clientX + d.baseOffX[i]! * scale + d.glitchDx[i]!;
          d.curY[i] = e.clientY + d.baseOffY[i]! * scale + d.glitchDy[i]!;
        }
      }
      armGlitchBurst();
    };

    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("mouseout", onMouseOut, true);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const tick = () => {
      const { x: mx, y: my } = mouseRef.current;
      const scale = hoverInteractiveRef.current ? 1.6 : 1;

      const bxp = bloomPosRef.current.x + (mx - bloomPosRef.current.x) * BLOOM_LERP;
      const byp = bloomPosRef.current.y + (my - bloomPosRef.current.y) * BLOOM_LERP;
      bloomPosRef.current.x = bxp;
      bloomPosRef.current.y = byp;
      const bloomEl = bloomRef.current;
      if (bloomEl) {
        bloomEl.style.transform = `translate3d(${bxp}px, ${byp}px, 0) translate(-50%, -50%)`;
        const now = performance.now();
        if (now < bloomGlitchUntilRef.current) {
          bloomHotRef.current = 1;
        } else {
          bloomHotRef.current = Math.max(0, bloomHotRef.current * 0.945);
        }
        const h = bloomHotRef.current;
        if (h < 0.004) {
          bloomHotRef.current = 0;
          bloomEl.style.background = BLOOM_BG_NORMAL;
        } else {
          const centerA = 0.12 + (0.22 - 0.12) * h;
          bloomEl.style.background = `radial-gradient(circle, rgba(255,255,255,${centerA}) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)`;
        }
      }

      for (let i = 0; i < SQUARE_COUNT; i++) {
        const tx = mx + d.baseOffX[i]! * scale + d.glitchDx[i]!;
        const ty = my + d.baseOffY[i]! * scale + d.glitchDy[i]!;
        const f = d.lerp[i]!;
        d.curX[i]! += (tx - d.curX[i]!) * f;
        d.curY[i]! += (ty - d.curY[i]!) * f;
        const el = squareRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${d.curX[i]}px, ${d.curY[i]}px, 0)`;
        }
      }

      updateTitleGlow(mx, my);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("mouseout", onMouseOut, true);
      cancelAnimationFrame(rafRef.current);
      if (glitchTimeoutRef.current !== null) {
        clearTimeout(glitchTimeoutRef.current);
        glitchTimeoutRef.current = null;
      }
      clearTitleGlowActive();
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  const bloomStyle: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 10000,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: BLOOM_BG_NORMAL,
    filter: "blur(8px)",
    left: 0,
    top: 0,
    border: "none",
    transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
  };

  const squareStyle: CSSProperties = {
    width: 7,
    height: 7,
    border: "1px solid rgba(255,255,255,0.85)",
    background: "transparent",
    position: "fixed",
    pointerEvents: "none",
    zIndex: 10001,
    left: 0,
    top: 0,
  };

  return (
    <>
      <div ref={bloomRef} aria-hidden style={bloomStyle} />
      {Array.from({ length: SQUARE_COUNT }, (_, i) => (
        <div
          key={i}
          aria-hidden
          ref={(el) => {
            squareRefs.current[i] = el;
          }}
          style={squareStyle}
        />
      ))}
    </>
  );
}
