"use client";

import { useEffect, useRef } from "react";
import { BEST, MONTHS, MONTH_FULL, REGIONS, SEASONS, SEASON_OF, SEASON_STATIC_MONTH, img } from "../content";
import { follow, isStatic, onScreen, onTick, pinProgress } from "../lib/motion";

const R = 262;
const place = (i: number, f: number) => {
  const th = (((i - f) * 30 - 90) * Math.PI) / 180;
  return `translate(${(R * Math.cos(th)).toFixed(1)}px,${(R * Math.sin(th)).toFixed(1)}px)`;
};

/**
 * 5 · When to go · SY14 + M30 (dial / rotate on scroll).
 * Pinned 200 %: the month ring turns Jan → Dec, the month at the top fills white, the round view crossfades between
 * the four aligned season stills with weather particles, the "Best in" card and the mini-map dots follow the month.
 * Hovering a month previews it. The particles keep the view alive when you stop.
 */
export default function SeasonRing() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    if (isStatic()) return;
    const btns = [...sec.querySelectorAll<HTMLButtonElement>(".months button")];
    const views = [...sec.querySelectorAll<HTMLElement>(".disc .p")];
    const bestK = sec.querySelector<HTMLElement>(".best .k")!;
    const bestT = sec.querySelector<HTMLElement>(".best .t")!;
    const lbl = sec.querySelector<HTMLElement>(".disc .lbl .script")!;
    const dots = [...sec.querySelectorAll<SVGGElement>(".rdot")];
    const cv = sec.querySelector<HTMLCanvasElement>(".wx")!;
    const x = cv.getContext("2d")!;
    let f = 0, m = -1, s = -1, preview: number | null = null;

    const setMonth = (k: number) => {
      if (k === m) return;
      m = k;
      btns.forEach((b, i) => b.classList.toggle("on", i === k));
      bestK.textContent = `Best in ${MONTH_FULL[k]}`;
      bestT.classList.remove("swap");
      void bestT.offsetWidth;
      bestT.textContent = BEST[k];
      bestT.classList.add("swap");
      dots.forEach((d, i) => d.classList.toggle("on", REGIONS[i].m.includes(k)));
      const ns = SEASON_OF(k);
      if (ns !== s) {
        s = ns;
        views.forEach((v, i) => v.classList.toggle("on", i === s));
        lbl.classList.remove("swap");
        void lbl.offsetWidth;
        lbl.textContent = SEASONS[s].name;
        lbl.classList.add("swap");
      }
    };
    const hov = btns.map((b, i) => {
      const en = () => {
        preview = i;
        setMonth(i);
      };
      const lv = () => (preview = null);
      b.addEventListener("mouseenter", en);
      b.addEventListener("mouseleave", lv);
      return () => {
        b.removeEventListener("mouseenter", en);
        b.removeEventListener("mouseleave", lv);
      };
    });

    const P = Array.from({ length: 140 }, (_, i) => ({ x: (i * 97) % 440, y: (i * 53) % 440, v: 0.5 + ((i * 37) % 100) / 100, r: ((i * 61) % 100) / 100 }));
    const off = onTick((time, dt) => {
      if (!onScreen(sec, 0)) return;
      f = follow(f, pinProgress(sec) * 11, dt, 8);
      btns.forEach((b, i) => (b.style.transform = place(i, f)));
      if (preview === null) setMonth(Math.round(f));
      // weather inside the round view
      x.clearRect(0, 0, 440, 440);
      const k = dt * 60;
      P.forEach((p) => {
        if (s === 0) {
          p.y += p.v * 1.2 * k;
          p.x += Math.sin(p.y / 30 + p.r * 6) * 0.6 * k;
          x.fillStyle = "rgba(255,255,255,.9)";
          x.beginPath();
          x.arc(p.x, p.y, 1.2 + p.r * 2.2, 0, 7);
          x.fill();
        } else if (s === 1) {
          p.y += p.v * 0.6 * k;
          p.x += (0.8 + Math.sin(p.y / 40) * 0.6) * k;
          x.fillStyle = p.r > 0.5 ? "rgba(232,87,126,.9)" : "rgba(255,190,210,.9)";
          x.save();
          x.translate(p.x, p.y);
          x.rotate(p.y / 30 + time);
          x.fillRect(-3, -1.5, 6, 3);
          x.restore();
        } else if (s === 2) {
          p.y += (9 + p.v * 5) * k;
          p.x -= 2 * k;
          x.strokeStyle = "rgba(220,235,255,.55)";
          x.lineWidth = 1.2;
          x.beginPath();
          x.moveTo(p.x, p.y);
          x.lineTo(p.x + 3, p.y - 16);
          x.stroke();
        } else {
          p.y -= p.v * 0.25 * k;
          x.fillStyle = `rgba(255,236,200,${0.15 + p.r * 0.35})`;
          x.beginPath();
          x.arc(p.x, p.y, 1 + p.r * 1.5, 0, 7);
          x.fill();
        }
        if (p.y > 450) p.y = -10;
        if (p.y < -10) p.y = 450;
        if (p.x > 450) p.x = -10;
        if (p.x < -10) p.x = 450;
      });
    });
    return () => {
      off();
      hov.forEach((h) => h());
    };
  }, []);

  const m = SEASON_STATIC_MONTH;
  const s = SEASON_OF(m);
  return (
    <section id="seasons" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "200vh" }} data-name="When to go">
      <div className="stage ct-full">
        <div className="copy">
          <h2>
            When <span className="script">to go</span>
          </h2>
          <p className="lede">Every month has a mountain at its best. Turn the year and we&apos;ll show you where.</p>
          <div className="best glass">
            <div className="k">Best in {MONTH_FULL[m]}</div>
            <div className="t">{BEST[m]}</div>
          </div>
        </div>
        <div className="ringwrap">
          <div className="ringline" />
          <div className="disc">
            {SEASONS.map((x, i) => (
              <div key={x.name} className={`p${i === s ? " on" : ""}`} style={{ backgroundImage: `url(${img(x.img)})` }} />
            ))}
            <canvas className="wx" width={440} height={440} />
            <div className="lbl">
              <span className="script">{SEASONS[s].name}</span>
            </div>
          </div>
          <div className="months">
            {MONTHS.map((name, i) => (
              <button type="button" key={name} className={i === m ? "on" : ""} style={{ transform: place(i, m) }}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="minimap">
          <div className="k">Best treks this month</div>
          <svg viewBox="0 0 360 220">
            <path d="M10 70 C70 40 120 60 170 80 S260 130 350 150" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="22" strokeLinecap="round" opacity=".25" />
            <path d="M10 70 C70 40 120 60 170 80 S260 130 350 150" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" strokeDasharray="3 6" />
            {REGIONS.map((r) => (
              <g key={r.n} className={`rdot${r.m.includes(m) ? " on" : ""}`} transform={`translate(${r.x} ${r.y})`}>
                <circle className="h" r="14" />
                <circle className="c" r="7" />
                <text x="0" y="28" textAnchor="middle">
                  {r.n}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <i className="ct-plane-anchor" data-plane data-hide data-sec="seasons" data-f0="0.05" data-f1="0.95" />
      </div>
    </section>
  );
}
