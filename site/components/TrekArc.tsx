"use client";

import { useEffect, useRef } from "react";
import { DEST_STATIC, TREKS, img } from "../content";
import { PlaneRest, Sample } from "./bits";
import { clamp as cl, follow, isStatic, onTick, pinProgress, smooth, swapWhole } from "../lib/motion";

/** Arc geometry (1440×900): circle of radius R whose left edge sits 300 px from the right; orbs 0.36 rad apart. */
const R = 520;
const STEP = 0.36;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
function orbStyle(i: number, a: number) {
  const d = i - a;
  const dx = -R * Math.cos(d * STEP); // θ = π + d·step
  const dy = -R * Math.sin(d * STEP);
  const s = 0.72 + 0.4 * Math.max(0, 1 - Math.abs(d));
  return {
    left: `calc(100% + ${(220 + dx).toFixed(1)}px)`,
    top: `calc(50% + ${(10 + dy).toFixed(1)}px)`,
    transform: `scale(${s.toFixed(3)})`,
    opacity: clamp(1.25 - Math.abs(d) * 0.38) * clamp((460 + dy - 150) / 90) * clamp((900 - 40 - (460 + dy)) / 110),
    zIndex: 10 - Math.round(Math.abs(d)),
  };
}

/**
 * 2 · Destinations · GL10 as an arc + M444 (images on a giant arc), from destinations-1 (mine).
 * Static: the arc parked with Valley of Flowers in the centre; Round 2 turns it with the scroll.
 */
export default function TrekArc() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const sec = root.current!;
    if (isStatic()) return;
    const stage = sec.querySelector<HTMLElement>(".stage")!;
    const orbs = [...sec.querySelectorAll<HTMLElement>(".orb")];
    const bgs = [...sec.querySelectorAll<HTMLElement>(".bgs .bg")];
    const dots = [...sec.querySelectorAll<HTMLElement>(".pager i")];
    const vals = ["days", "lvl", "alt", "px"].map((k) => sec.querySelector<HTMLElement>(`[data-k="${k}"]`)!);
    let a = 0, k = -1;
    const off = onTick((_t, dt) => {
      const r = sec.getBoundingClientRect();
      sec.classList.toggle("arrived", r.top < innerHeight * 0.8);
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      // arrival: the backdrop rises out of the seam (zoomed from its lower edge, so mountains meet the clouds, not
      // empty sky); the arc, pager and card fade in only as the stage settles, never half-visible under the seam
      const arrive = smooth(innerHeight * 0.55, innerHeight * 0.02, r.top);
      stage.style.setProperty("--arrive", arrive.toFixed(3));
      stage.style.setProperty("--landed", smooth(0.82, 1, arrive).toFixed(3));
      a = follow(a, pinProgress(sec) * (TREKS.length - 1), dt, 8);
      const W = stage.offsetWidth, H = stage.offsetHeight;
      orbs.forEach((o, i) => {
        const st = orbStyle(i, a);
        const d = i - a;
        const top = H / 2 + 10 - R * Math.sin(d * STEP);
        o.style.left = `${W + 220 - R * Math.cos(d * STEP)}px`;
        o.style.top = `${top}px`;
        o.style.transform = st.transform;
        // never under the nav or the trek card: fade near the top and bottom edges
        const edge = cl((top - 150) / 45) * cl((H - 40 - top) / 55);
        o.style.opacity = String(cl(1.25 - Math.abs(d) * 0.38) * edge);
        o.style.zIndex = String(st.zIndex);
      });
      bgs.forEach((b, i) => (b.style.opacity = String(cl(1 - Math.abs(i - a)))));
      const nk = Math.round(cl(a, 0, TREKS.length - 1));
      if (nk !== k) {
        k = nk;
        orbs.forEach((o, i) => o.classList.toggle("on", i === k));
        dots.forEach((d, i) => d.classList.toggle("on", i === k));
        const t = TREKS[k];
        swapWhole(vals[0], String(t.days));
        swapWhole(vals[1], t.lvl);
        swapWhole(vals[2], t.alt);
        swapWhole(vals[3], t.px);
      }
    });
    // click a round photo: scroll the arc to it
    const clicks = orbs.map((o, i) => {
      const h = () => {
        const top = sec.getBoundingClientRect().top + scrollY;
        const span = sec.offsetHeight - innerHeight;
        window.__lenis?.scrollTo(top + (i / (TREKS.length - 1)) * span, { duration: 1.2 });
      };
      o.addEventListener("click", h);
      return () => o.removeEventListener("click", h);
    });
    return () => {
      off();
      clicks.forEach((c) => c());
    };
  }, []);
  const a = DEST_STATIC;
  const t = TREKS[a];
  return (
    <section id="dest" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "220vh" }} data-name="Treks">
      <div className="stage ct-full">
      <div className="bgs">
        {TREKS.map((k, i) => (
          <div key={k.n} className={`bg${i === a ? " on" : ""}`} style={{ backgroundImage: `url(${img(k.img)})` }} />
        ))}
      </div>
      <div className="shade" />
      <div className="copy">
        <span className="chip glass">
          <b>New</b> Season 2026 departures are open
        </span>
        <h2>
          Walk where <span className="script">the road ends</span>
        </h2>
        <p className="lede">Six Himalayan treks, planned end to end: permits, guides, tea houses and the flights in between. You only pack.</p>
        <a className="pill glass" href="#deps">
          Explore all treks <span className="arr">↗</span>
        </a>
      </div>
      <div className="wheel">
        {TREKS.map((k, i) => (
          <div key={k.n} className={`orb${i === a ? " on" : ""}`} data-i={i} style={orbStyle(i, a)} {...(i === 3 ? { "data-hover-demo": "" } : {})}>
            <svg viewBox="0 0 194 194" aria-hidden>
              <circle cx="97" cy="97" r="91" />
            </svg>
            <div className="ph" style={{ backgroundImage: `url(${img(k.img + "-sm")})` }} />
            <div className="lab">
              <span className="script">{k.n}</span>
              <span className="r">{k.r}</span>
              <span className="pr">
                {k.days} days · from {k.px} <Sample />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pager" aria-hidden>
        {TREKS.map((k, i) => (
          <i key={k.n} className={i === a ? "on" : ""} />
        ))}
      </div>
      <div className="dcard glass">
        <div>
          <div className="k">Days</div>
          <div className="val" data-k="days">
            <span>{t.days}</span>
          </div>
        </div>
        <div>
          <div className="k">Level</div>
          <div className="val" data-k="lvl">
            <span>{t.lvl}</span>
          </div>
        </div>
        <div>
          <div className="k">Max altitude</div>
          <div className="val" data-k="alt">
            <span>{t.alt}</span>
          </div>
        </div>
        <div>
          <div className="k">
            From <Sample />
          </div>
          <div className="val" data-k="px">
            <span>{t.px}</span>
          </div>
        </div>
        <a className="pill solid" href="#trip">
          View trip <span className="arr">↗</span>
        </a>
      </div>
      <PlaneRest sec="dest" rot={-32} scale={0.8} f0={0.08} f1={0.92} style={{ left: "calc(100% - 172px)", top: "calc(50% + 102px)" }} />
      </div>
    </section>
  );
}
