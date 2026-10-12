"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { isStatic, signalLift } from "../lib/motion";

/**
 * I38 loader: a trail map folds into a paper plane while a REAL 0–100 counter tracks the hero films loading (lesson 3),
 * then the plane flies off and two cloud halves part with the hero film already moving (lesson 4).
 * CSS motion runs from the first paint (lesson 11). Removed in ?static=1 (`?loader=1` shows a still for review).
 */
export default function MapLoader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const q = new URLSearchParams(location.search);
    if (isStatic()) {
      if (!q.has("loader")) setGone(true);
      else {
        el.classList.add("still");
        el.querySelector(".count span")!.textContent = "64";
        (el.querySelector(".loadbar") as HTMLElement).style.transform = "scaleX(.64)";
      }
      return;
    }
    window.__lenis?.stop();
    window.scrollTo(0, 0);
    const cnt = el.querySelector<HTMLElement>(".count span")!;
    const bar = el.querySelector<HTMLElement>(".loadbar")!;
    let real = 0;
    const unsub = loading.subscribe((p) => (real = p));
    const start = performance.now();
    const shown = { v: 0 };
    let folded = false, finished = false;
    const fold = gsap.timeline({ paused: true })
      .to(el.querySelector(".ml"), { rotationY: 78, duration: 0.6, ease: "power2.inOut" }, 0)
      .to(el.querySelector(".mr"), { rotationY: -78, duration: 0.6, ease: "power2.inOut" }, 0)
      .to(el.querySelectorAll(".m"), { opacity: 0, duration: 0.25 }, 0.5)
      .fromTo(el.querySelector(".lp"), { opacity: 0, scale: 0.9, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2)" }, 0.5);

    const finish = () => {
      finished = true;
      gsap.timeline({ onComplete: () => setGone(true) })
        .to(el.querySelector(".lp"), { x: 260, y: -220, rotation: -24, scale: 0.7, opacity: 0, duration: 0.6, ease: "power2.in" }, 0)
        .to(el.querySelector(".count"), { opacity: 0, y: -10, duration: 0.3 }, 0)
        .add(() => {
          signalLift();
          window.__lenis?.start();
        }, 0)
        // textured cloud banks part fast (0.55 s) with the Everest film already moving behind them
        .to(el.querySelector(".half.l"), { xPercent: -104, duration: 0.55, ease: "power2.inOut" }, 0.2)
        .to(el.querySelector(".half.r"), { xPercent: 104, duration: 0.55, ease: "power2.inOut" }, 0.2)
        .to(bar, { opacity: 0, duration: 0.3 }, 0.2);
    };

    const tick = () => {
      if (finished) return;
      const el2 = (performance.now() - start) / 1000;
      const timeCap = Math.min(1, el2 / 2.2); // never faster than ~2.2 s
      const target = Math.min(real, timeCap) * 100;
      shown.v += (target - shown.v) * 0.14;
      if (el2 > 14) shown.v = 100; // safety: never hang
      const v = Math.min(100, Math.round(shown.v + 0.4));
      cnt.textContent = String(v);
      bar.style.transform = `scaleX(${v / 100})`;
      if (!folded && v >= 42) {
        folded = true;
        fold.play();
      }
      if (v >= 100 && folded && fold.progress() > 0.95) finish();
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      unsub();
    };
  }, []);

  if (gone) return null;
  return (
    <div className="ct-loader" ref={root} aria-hidden>
      <div className="half l" />
      <div className="half r" />
      <div className="stage">
        <div className="mapfold">
          <div className="m ml">
            <svg viewBox="0 0 240 240">
              <use href="#ct-mapart" />
            </svg>
          </div>
          <div className="m mr">
            <svg viewBox="0 0 240 240">
              <use href="#ct-mapart" />
            </svg>
          </div>
          <div className="lp">
            <svg width="150" height="88" viewBox="0 0 96 56">
              <use href="#ct-planeart" />
            </svg>
          </div>
        </div>
        <div className="count">
          <span>0</span>
          <small>CHARTING THE ROUTE</small>
        </div>
      </div>
      <div className="loadbar" />
    </div>
  );
}
