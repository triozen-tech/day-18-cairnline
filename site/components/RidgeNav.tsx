"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_LINKS } from "../content";
import { isStatic, onTick } from "../lib/motion";
import { CairnLogo, ridgePoints } from "./bits";

/**
 * NV19 scrollspy header + M422: logo · 6 links · "Now ‹section›" · glass Trip bag; the bottom edge is a ridge line
 * whose dot climbs it with the page progress. The "Now" word swaps whole (old lifts out, then the new wipes in,
 * lesson 85); the bag owns the count and bumps on every add (event ct:bag).
 */
export default function RidgeNav() {
  const root = useRef<HTMLElement>(null);
  const pts = ridgePoints(9, 30, 4, 18, 16).map(([x, y], i) => (i === 0 ? `M0 16` : `L${x} ${y}`));

  useEffect(() => {
    const nav = root.current!;
    const n = nav.querySelector<HTMLElement>(".bag .n")!;
    const bag = nav.querySelector<HTMLElement>(".bag")!;
    const bump = () => {
      n.textContent = String(+(n.textContent || 0) + 1);
      gsap.fromTo(n, { scale: 1.6, backgroundColor: "#fff", color: "#C63D66" }, { scale: 1, backgroundColor: "#C63D66", color: "#fff", duration: 0.6, ease: "back.out(3)" });
      gsap.fromTo(bag, { boxShadow: "0 0 0 0 rgba(232,87,126,.8)" }, { boxShadow: "0 0 0 14px rgba(232,87,126,0)", duration: 0.8 });
    };
    addEventListener("ct:bag", bump);
    // past the top of the hero the bar turns to frosted glass, so nothing behind it can be read
    const glass = () => nav.classList.toggle("glass-on", scrollY > 12);
    glass();
    addEventListener("scroll", glass, { passive: true });
    if (isStatic()) return () => {
      removeEventListener("ct:bag", bump);
      removeEventListener("scroll", glass);
    };

    const path = nav.querySelector<SVGPathElement>(".ridge path")!;
    const dot = nav.querySelector<SVGCircleElement>(".ridge .dot")!;
    const len = path.getTotalLength();
    const w = nav.querySelector<HTMLElement>(".now .w")!;
    const secs = [...document.querySelectorAll<HTMLElement>("[data-name]")];
    let name = "Flying in";
    const swapNow = (nu: string) => {
      const old = w.querySelector("span:last-child") as HTMLElement | null;
      const s = document.createElement("span");
      s.textContent = nu;
      w.appendChild(s);
      if (old) gsap.to(old, { yPercent: -110, opacity: 0, duration: 0.15, onComplete: () => old.remove() });
      gsap.fromTo(s, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.25, delay: 0.12 });
    };
    const off = onTick(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      const pt = path.getPointAtLength(p * len);
      dot.setAttribute("cx", pt.x.toFixed(1));
      dot.setAttribute("cy", pt.y.toFixed(1));
      const mid = innerHeight / 2;
      const cur = secs.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      const nn = cur?.dataset.name;
      if (nn && nn !== name) {
        name = nn;
        swapNow(nn);
      }
    });
    return () => {
      off();
      removeEventListener("ct:bag", bump);
      removeEventListener("scroll", glass);
    };
  }, []);

  return (
    <header className="ct-nav" ref={root}>
      <a className="logo" href="#hero">
        <CairnLogo />
        Cairnline Treks
      </a>
      <nav className="links">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="now">
        Now
        <span className="w">
          <span>Flying in</span>
        </span>
      </div>
      <button type="button" className="bag glass" id="ct-bag">
        Trip bag <span className="n">0</span>
      </button>
      <svg className="ridge" viewBox="0 0 1440 22" preserveAspectRatio="none" aria-hidden>
        <path d={pts.join(" ")} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.4" />
        <circle className="dot" cx="6" cy="15" r="4.5" />
      </svg>
    </header>
  );
}
