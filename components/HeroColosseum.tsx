"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { HeroSunBloom } from "./HeroSunBloom";

gsap.registerPlugin(ScrollTrigger);

const HERO_VH = 480;

/** Base max opacity for the sun wrapper (0–1); scroll fade multiplies. Desktop: md+ only via CSS. */
const HERO_SUN_MAX_OPACITY = 0.5;

/** Title + rule fade out over this fraction of the hero scroll (0–1). */
const HERO_TITLE_FADE_END = 0.42;

function titleOpacityFromHeroProgress(p: number) {
  return Math.max(0, 1 - Math.min(1, p) / HERO_TITLE_FADE_END);
}

/** 3D stack lags slightly for a parallax read (percent of hero progress). */
const HERO_PARALLAX_SHIFT_PCT = 18;

/** Sun is fully visible at hero progress 0 and gone by this progress (40% of hero scroll). */
const HERO_SUN_FADE_END = 0.4;

function sunOpacityFromHeroProgress(p: number) {
  return Math.max(0, 1 - Math.min(1, p) / HERO_SUN_FADE_END);
}

function lerpRgb(
  out: THREE.Color,
  a: [number, number, number],
  b: [number, number, number],
  t: number,
) {
  out.r = (a[0] + (b[0] - a[0]) * t) / 255;
  out.g = (a[1] + (b[1] - a[1]) * t) / 255;
  out.b = (a[2] + (b[2] - a[2]) * t) / 255;
}

function sampleLightColor(p: number, target: THREE.Color) {
  const stops: [number, [number, number, number]][] = [
    [0, [255, 175, 130]],
    [0.25, [255, 195, 140]],
    [0.5, [160, 120, 200]],
    [0.75, [70, 90, 160]],
    [1, [35, 55, 110]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (p <= t1) {
      const u = (p - t0) / (t1 - t0);
      lerpRgb(target, c0, c1, u);
      return;
    }
  }
  lerpRgb(target, stops[stops.length - 1][1], stops[stops.length - 1][1], 0);
}

function createBaseMat() {
  return new THREE.MeshStandardMaterial({
    color: 0x2a2420,
    roughness: 0.92,
    metalness: 0.12,
    flatShading: true,
  });
}

function createArena(wireMaterials: THREE.MeshBasicMaterial[]): THREE.Group {
  const group = new THREE.Group();
  const makeWire = (opacity: number) => {
    const m = new THREE.MeshBasicMaterial({
      color: 0xc8d8ff,
      wireframe: true,
      transparent: true,
      opacity,
    });
    wireMaterials.push(m);
    return m;
  };

  const floor = new THREE.Mesh(new THREE.RingGeometry(3.5, 20, 72, 1), createBaseMat());
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  group.add(floor);

  const tiers = [
    { n: 40, r: 17, h: 5.8, w: 1.35, d: 1.55, y: 2.9 },
    { n: 36, r: 13.5, h: 4.6, w: 1.2, d: 1.35, y: 6.8 },
    { n: 28, r: 10.2, h: 3.4, w: 1.05, d: 1.2, y: 10.1 },
  ];

  for (const tier of tiers) {
    for (let i = 0; i < tier.n; i++) {
      const a = (i / tier.n) * Math.PI * 2;
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(tier.w, tier.h, tier.d),
        createBaseMat(),
      );
      mesh.position.set(
        Math.cos(a) * tier.r,
        tier.y,
        Math.sin(a) * tier.r,
      );
      mesh.rotation.y = -a;
      mesh.castShadow = true;
      group.add(mesh);

      const wire = mesh.clone();
      (wire as THREE.Mesh<THREE.BufferGeometry, THREE.Material>).material =
        makeWire(0.42);
      wire.scale.setScalar(1.03);
      group.add(wire);
    }
  }

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(11.5, 0.35, 10, 80),
    createBaseMat(),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 12.2;
  group.add(rim);

  const rimWire = rim.clone();
  (rimWire as THREE.Mesh<THREE.BufferGeometry, THREE.Material>).material =
    makeWire(0.38);
  rimWire.scale.setScalar(1.04);
  group.add(rimWire);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(8.5, 0.22, 8, 64),
    makeWire(0.28),
  );
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 4.5;
  group.add(innerRing);

  return group;
}

export default function HeroColosseum() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sunWrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const progressRef = useRef(0);

  const parallaxRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const apply = (progress: number) => {
      const p = progress;

      const sunEl = sunWrapRef.current;
      if (sunEl) {
        sunEl.style.opacity = String(HERO_SUN_MAX_OPACITY * sunOpacityFromHeroProgress(p));
      }

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(0, ${(p * HERO_PARALLAX_SHIFT_PCT).toFixed(3)}%, 0)`;
      }

      if (titleGroupRef.current) {
        titleGroupRef.current.style.opacity = String(titleOpacityFromHeroProgress(p));
      }
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => apply(self.progress),
    });

    apply(st.progress);
    const raf = requestAnimationFrame(() => {
      apply(st.progress);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = mountRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    mouse.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.current.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }, []);

  const onTouch = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    const el = mountRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    mouse.current.x = ((t.clientX - r.left) / r.width) * 2 - 1;
    mouse.current.y = -((t.clientY - r.top) / r.height) * 2 + 1;
  }, []);

  useGSAP(
    () => {
      if (!mountRef.current || !sectionRef.current) return;

      const scene = new THREE.Scene();
      const fogExp = new THREE.FogExp2(0x080808, 0.008);
      scene.fog = fogExp;

      const mount = mountRef.current;
      const camAspect =
        mount.clientWidth > 0 && mount.clientHeight > 0
          ? mount.clientWidth / mount.clientHeight
          : window.innerWidth / window.innerHeight;

      const camera = new THREE.PerspectiveCamera(48, camAspect, 0.1, 220);
      camera.position.set(0, 11, 40);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      /** Transparent clear so the HeroSunBloom layer (below the canvas) reads as a backlit sky. */
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      mount.appendChild(renderer.domElement);

      const applyCanvasSize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w < 1 || h < 1) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      applyCanvasSize();
      const ro = new ResizeObserver(() => applyCanvasSize());
      ro.observe(mount);

      const wireMaterials: THREE.MeshBasicMaterial[] = [];
      const arena = createArena(wireMaterials);
      scene.add(arena);

      const ambient = new THREE.AmbientLight(0x404060, 0.35);
      scene.add(ambient);

      const spot = new THREE.SpotLight(0xffc9a0, 4.5, 120, 0.42, 0.35, 1);
      spot.position.set(-18, 32, 12);
      spot.target.position.set(0, 4, 0);
      scene.add(spot);
      scene.add(spot.target);

      const rimLight = new THREE.PointLight(0xaaccff, 1.2, 80);
      rimLight.position.set(12, 18, -14);
      scene.add(rimLight);

      const fill = new THREE.DirectionalLight(0x8899cc, 0.25);
      fill.position.set(0, 8, 20);
      scene.add(fill);

      const rimLerpA = new THREE.Color(0xaaccff);
      const rimLerpB = new THREE.Color(0x6688ff);

      const narrow = (mount.clientWidth > 0 ? mount.clientWidth : window.innerWidth) < 768;
      const particleCount = narrow ? 550 : 1400;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const r = 8 + Math.random() * 32;
        const th = Math.random() * Math.PI * 2;
        const ph = (Math.random() - 0.5) * Math.PI * 0.5;
        positions[i * 3] = r * Math.cos(th) * Math.cos(ph);
        positions[i * 3 + 1] = 2 + Math.random() * 18;
        positions[i * 3 + 2] = r * Math.sin(th) * Math.cos(ph);
        velocities[i * 3] = (Math.random() - 0.5) * 0.008;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.008;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xc8d8ff,
        size: narrow ? 0.055 : 0.045,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      const lightColor = new THREE.Color();
      const clock = new THREE.Clock();

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          sampleLightColor(p, lightColor);
          spot.color.copy(lightColor);
          rimLight.color.lerpColors(rimLerpA, rimLerpB, p);

          const orbit = p * Math.PI * 0.85;
          const dist = 40 - p * 29;
          const camY = 11 - p * 5.5 + Math.sin(p * Math.PI) * 1.2;
          camera.position.x = Math.sin(orbit) * dist * 0.85;
          camera.position.z = Math.cos(orbit * 0.92) * dist;
          camera.position.y = camY;
          camera.lookAt(0, 3.5 + p * 2.2, 0);

          fogExp.color.setHex(p > 0.72 ? 0x05060c : 0x080808);
          fogExp.density = 0.008 + p * 0.018;

          const wireOp = 0.32 + p * 0.38;
          wireMaterials.forEach((m) => {
            m.opacity = wireOp;
          });
          ambient.intensity = 0.28 + p * 0.22;
          spot.intensity = 4.2 - p * 0.8;
          pMat.opacity = 0.35 + p * 0.45;
        },
      });

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchstart", onTouch, { passive: true });
      window.addEventListener("touchmove", onTouch, { passive: true });

      const onWindowResize = () => {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        applyCanvasSize();
      };
      window.addEventListener("resize", onWindowResize);

      let raf = 0;
      const animate = () => {
        const t = clock.getElapsedTime();
        const p = progressRef.current;
        arena.rotation.y = t * 0.012 + p * 0.15;

        const posAttr = pGeo.getAttribute("position") as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        const mx = mouse.current.x * 2.2;
        const my = mouse.current.y * 2.2;
        for (let i = 0; i < particleCount; i++) {
          arr[i * 3] += velocities[i * 3] + mx * 0.0004;
          arr[i * 3 + 1] += velocities[i * 3 + 1] + my * 0.00035;
          arr[i * 3 + 2] += velocities[i * 3 + 2];
          if (Math.abs(arr[i * 3]) > 36) velocities[i * 3] *= -1;
          if (arr[i * 3 + 1] < 0 || arr[i * 3 + 1] > 26) velocities[i * 3 + 1] *= -1;
          if (Math.abs(arr[i * 3 + 2]) > 36) velocities[i * 3 + 2] *= -1;
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        ro.disconnect();
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchstart", onTouch);
        window.removeEventListener("touchmove", onTouch);
        st.kill();
        const canvas = renderer.domElement;
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }

        scene.remove(ambient);
        ambient.dispose();
        scene.remove(spot.target);
        scene.remove(spot);
        spot.dispose();
        scene.remove(rimLight);
        rimLight.dispose();
        scene.remove(fill);
        fill.dispose();
        scene.fog = null;

        renderer.dispose();
        const seenGeometries = new WeakSet<THREE.BufferGeometry>();
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
            const g = obj.geometry;
            if (g && !seenGeometries.has(g)) {
              seenGeometries.add(g);
              g.dispose();
            }
            const mat = obj.material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          }
        });
      };
    },
    { dependencies: [onMouseMove, onTouch], revertOnUpdate: true },
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative z-0"
      style={{ height: `${HERO_VH}vh` }}
    >
      <div className="relative sticky top-0 h-screen min-h-[100dvh] w-full min-w-0 overflow-hidden">
        <div
          ref={parallaxRef}
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
        >
          <div
            ref={sunWrapRef}
            className="pointer-events-none absolute inset-0 z-0 max-md:hidden md:block"
            style={{ opacity: HERO_SUN_MAX_OPACITY, willChange: "opacity" }}
          >
            <HeroSunBloom />
          </div>
          <div
            ref={mountRef}
            className="pointer-events-none absolute inset-0 z-10 h-full w-full min-h-0 min-w-0 [&_canvas]:pointer-events-none [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:min-h-0"
          />
          {/* keep top clear so the sun (behind the canvas) stays visible; darken toward bottom only */}
          <div className="pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-transparent via-bg/0 via-40% to-bg/90" />
        </div>
        <div
          ref={titleGroupRef}
          className="pointer-events-none absolute inset-0 z-20 will-change-[opacity]"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-0 w-full pt-24 pb-12 text-center sm:pt-28 md:pt-32">
            <h1
              className="text-center font-display text-[clamp(1.1rem,4.8vw,1.75rem)] leading-tight tracking-[0.18em] text-text-primary drop-shadow-[0_0_40px_rgba(0,0,0,0.85)] sm:text-4xl sm:tracking-[0.24em] md:whitespace-nowrap md:text-6xl md:tracking-[0.3em] lg:text-7xl lg:tracking-[0.34em]"
            >
              LUCAS SIMPSON
            </h1>
            <div className="mx-auto mt-6 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-accent/85 to-transparent sm:mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
