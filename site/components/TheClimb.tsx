"use client";

import { useEffect, useRef } from "react";
import { CAMPS, fmt, img, oxygen, seeded } from "../content";
import { clamp, follow, isStatic, lerp, onTick, pinProgress } from "../lib/motion";

/** The stitched mountain (a7a + a7b), sharpened + grained at 1150 px wide: shown as a centred column (sides = night sky). */
export const CLIMB_W = 1150;
export const CLIMB_H = 2791;
const NAV_SAFE = 132; // pins fade out before they reach the nav

/** Altitude, night temperature and trail day at an image y (px), interpolated between the camps. */
function readAt(yImg: number) {
  const ys = CAMPS.map((c) => c.y * CLIMB_H);
  if (yImg >= ys[0]) return { alt: CAMPS[0].alt, temp: CAMPS[0].temp, day: CAMPS[0].day };
  for (let i = 1; i < CAMPS.length; i++)
    if (yImg >= ys[i]) {
      const t = (ys[i - 1] - yImg) / (ys[i - 1] - ys[i]);
      return { alt: lerp(CAMPS[i - 1].alt, CAMPS[i].alt, t), temp: lerp(CAMPS[i - 1].temp, CAMPS[i].temp, t), day: Math.round(lerp(CAMPS[i - 1].day, CAMPS[i].day, t)) };
    }
  const c = CAMPS[CAMPS.length - 1];
  return { alt: c.alt, temp: c.temp, day: c.day };
}

const starField = (seed: number, n: number) => {
  const r = seeded(seed);
  return Array.from({ length: n }, () => `${(r() * 1440).toFixed(0)}px ${(r() * 520).toFixed(0)}px 0 ${r() > 0.85 ? 1 : 0}px rgba(255,255,255,${(0.45 + r() * 0.55).toFixed(2)})`).join(",");
};
const STARS = starField(77, 60);
const STARS_B = starField(91, 45); // second layer twinkles out of step with the first

/**
 * 3 · The Climb (signature) · SY10 + M946 "scroll down, climb up".
 * Pinned 320 %: the view starts at Lukla (bottom of the mountain) and the whole mountain moves DOWN as you scroll, so you
 * climb to Base Camp and the summit; HUD altitude 2,860 → 5,364 m, oxygen, typical night temperature, trail day; the
 * nearest camp pin lights; frost creeps in, the sky turns to night with stars. Scroll-position driven both ways;
 * stars twinkle and pins pulse when you stop.
 */
export default function TheClimb() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    if (isStatic()) return;
    const track = sec.querySelector<HTMLElement>(".track")!;
    const pins = [...sec.querySelectorAll<HTMLElement>(".camp")];
    const title = sec.querySelector<HTMLElement>(".title")!;
    const [hAlt, hO2, hT, hD] = ["alt", "o2", "t", "d"].map((k) => sec.querySelector<HTMLElement>(`[data-h="${k}"]`)!);
    const frost = sec.querySelector<HTMLElement>(".frost")!;
    const night = sec.querySelector<HTMLElement>(".night")!;
    const stars = [...sec.querySelectorAll<HTMLElement>(".stars")];
    const rope = sec.querySelector<HTMLElement>(".rope i")!;
    let p = 0, lit = -1;
    const off = onTick((_t, dt) => {
      const r = sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      p = follow(p, pinProgress(sec), dt, 8);
      const vh = innerHeight;
      const y = -(CLIMB_H - vh) * (1 - p);
      track.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      const titleOp = 1 - clamp((p - 0.04) / 0.08);
      title.style.opacity = String(titleOp);
      title.style.transform = `translateY(${(-40 * (1 - titleOp)).toFixed(1)}px)`;
      // the reading follows the climb: Lukla at the start, Base Camp at ~62 %, then the summit view (HUD holds)
      const y0 = CAMPS[0].y * CLIMB_H, y1 = CAMPS[CAMPS.length - 1].y * CLIMB_H;
      const yRead = lerp(y0, y1, clamp(p / 0.62));
      const rd = readAt(yRead);
      hAlt.textContent = fmt(rd.alt);
      hO2.textContent = String(oxygen(rd.alt));
      hT.textContent = String(Math.round(rd.temp));
      hD.textContent = `Day ${rd.day}`;
      // nearest camp lights; pins fade near the nav and under the title while it shows
      let best = 0, bd = 1e9;
      pins.forEach((el, i) => {
        const sy = CAMPS[i].y * CLIMB_H + y;
        const d = Math.abs(CAMPS[i].y * CLIMB_H - yRead);
        if (d < bd) {
          bd = d;
          best = i;
        }
        let o = clamp((sy - NAV_SAFE) / 60);
        if (titleOp > 0 && sy < 540) o *= 1 - titleOp;
        el.style.opacity = o.toFixed(3);
        el.style.pointerEvents = o > 0.5 ? "" : "none";
      });
      if (best !== lit) {
        lit = best;
        pins.forEach((el, i) => el.classList.toggle("on", i === best));
      }
      frost.style.opacity = (clamp((p - 0.3) / 0.6) * 0.9).toFixed(3);
      night.style.opacity = (clamp((p - 0.4) / 0.6) * 0.8).toFixed(3);
      stars.forEach((st) => (st.style.opacity = clamp((p - 0.45) / 0.5).toFixed(3)));
      rope.style.height = `${(p * 100).toFixed(2)}%`;
    });
    return off;
  }, []);

  const top = CAMPS[CAMPS.length - 1];
  return (
    <section id="climb" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "320vh" }} data-name="The Climb">
      <div className="stage">
        <div className="track" style={{ height: CLIMB_H }}>
          <div className="col" style={{ width: CLIMB_W, height: CLIMB_H }}>
            <div className="mountain" style={{ backgroundImage: `url(${img("climb")})` }} />
            {CAMPS.map((c, i) => (
              <div
                key={c.name}
                className={`camp${i === CAMPS.length - 1 ? " on" : ""}`}
                style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}
                {...(i === CAMPS.length - 1 ? { "data-hover-demo": "" } : {})}
              >
                <div className="pin glass">
                  <i />
                  <b>{c.name}</b>
                  <span>{fmt(c.alt)} m</span>
                </div>
                <div className="more glass">
                  <b>
                    Day {c.day} · night {c.temp}°C <small>(typical Oct–Nov)</small>
                  </b>
                  {c.note}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="night" aria-hidden />
        <div className="stars" aria-hidden style={{ boxShadow: STARS }} />
        <div className="stars b" aria-hidden style={{ boxShadow: STARS_B }} />
        <div className="frost" aria-hidden />
        <div className="hudlayer">
          <div className="hud glass">
            <div className="row">
              <span className="k">Altitude</span>
              <span className="v">
                <span data-h="alt">{fmt(top.alt)}</span> m
              </span>
            </div>
            <div className="row">
              <span className="k">Oxygen</span>
              <span className="v">
                <span data-h="o2">{oxygen(top.alt)}</span>%
              </span>
            </div>
            <div className="row">
              <span className="k">Night (typical)</span>
              <span className="v">
                <span data-h="t">{top.temp}</span>°C
              </span>
            </div>
            <div className="row">
              <span className="k">Trail day</span>
              <span className="v" data-h="d">
                Day {top.day}
              </span>
            </div>
          </div>
          <div className="rope" aria-hidden>
            <i style={{ height: "100%" }} />
          </div>
        </div>
        <div className="title">
          <h2>
            Scroll down.
            <br />
            <span className="script">Climb up.</span>
          </h2>
          <p className="lede">Eight days from Lukla to Everest Base Camp, one scroll. Watch the air thin before your legs do.</p>
        </div>
        <i className="ct-plane-anchor" data-plane data-hide data-sec="climb" data-f0="0.05" data-f1="0.95" />
      </div>
    </section>
  );
}
