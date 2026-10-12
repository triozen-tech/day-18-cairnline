"use client";

import { useEffect, useRef } from "react";
import { STAYS, img } from "../content";
import { Sample } from "./bits";
import { clamp, easeInOut, follow, isStatic, lerp, onScreen, onTick, pinProgress } from "../lib/motion";

/**
 * 6 · Stays on the trail · LS01 + M31 (3D tilt-in from depth), gyro tilt cards (the user's pick).
 * Each photo is 3 depth layers: the full photo (back), a code haze (middle), the cut-out house/tents (front).
 * Static: the cards standing; Round 2 stands them up one by one, Round 4 adds the gyro tilt, glare and glow.
 */
export default function StayCards() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const sec = root.current!;
    if (isStatic()) return;
    const far = sec.querySelector<HTMLElement>(".far")!;
    const cards = [...sec.querySelectorAll<HTMLElement>(".stay")].map((el, i) => ({
      el, i, layers: [...el.querySelectorAll<HTMLElement>(".ly")], stand: 1, rx: 0, ry: 0, mx: null as number | null, my: 0,
    }));
    const offs = cards.map((c) => {
      const mv = (e: MouseEvent) => {
        const r = c.el.getBoundingClientRect();
        c.mx = (e.clientX - r.left) / r.width;
        c.my = (e.clientY - r.top) / r.height;
      };
      const lv = () => (c.mx = null);
      c.el.addEventListener("mousemove", mv);
      c.el.addEventListener("mouseleave", lv);
      return () => {
        c.el.removeEventListener("mousemove", mv);
        c.el.removeEventListener("mouseleave", lv);
      };
    });
    let p = 0;
    const off = onTick((t, dt) => {
      if (!onScreen(sec, 0)) return;
      p = follow(p, pinProgress(sec), dt, 8);
      far.style.transform = `translateY(${(-p * 40).toFixed(1)}px) scale(1.04)`;
      cards.forEach((c) => {
        const target = 1 - easeInOut(clamp((p * 1.15 - c.i * 0.13) / 0.42));
        c.stand = follow(c.stand, target, dt, 12);
        const hover = c.mx !== null || c.el.classList.contains("is-hover");
        let tx: number, ty: number;
        if (c.mx !== null) {
          tx = -(c.my - 0.5) * 18;
          ty = (c.mx - 0.5) * 22;
        } else if (hover) {
          tx = Math.cos(t * 2.4) * 9; // record cursor resting on the card: circle the tilt
          ty = Math.sin(t * 2.4) * 11;
        } else {
          tx = Math.sin(t * 0.8 + c.i * 1.7) * 3; // idle sway
          ty = Math.cos(t * 0.6 + c.i * 1.3) * 4.5;
        }
        c.rx = lerp(c.rx, tx, 0.1);
        c.ry = lerp(c.ry, ty, 0.1);
        const lift = hover ? -10 : 0;
        c.el.style.transform = `translateY(${(c.stand * 60 + lift).toFixed(1)}px) rotateX(${(c.stand * 72 + c.rx).toFixed(2)}deg) rotateY(${(c.ry * (1 - c.stand)).toFixed(2)}deg)`;
        c.el.style.opacity = (0.25 + 0.75 * (1 - c.stand)).toFixed(3);
        c.layers.forEach((l) => {
          const d = +(l.dataset.d || 0);
          l.style.transform = `translate(${(c.ry * d * 1.5).toFixed(1)}px,${(-c.rx * d * 1.5).toFixed(1)}px) scale(${1 + d * 0.012})`;
        });
        c.el.style.setProperty("--gx", `${(50 + c.ry * 3.2).toFixed(1)}%`);
        c.el.style.setProperty("--gy", `${(32 - c.rx * 3.2).toFixed(1)}%`);
      });
    });
    return () => {
      off();
      offs.forEach((o) => o());
    };
  }, []);
  return (
    <section id="stays" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "130vh" }} data-name="Stays">
      <div className="stage ct-full">
      <div className="far" style={{ backgroundImage: `url(${img("glacier")})` }} />
      <div className="veil" />
      <div className="stayhead">
        <h2>
          Sleep <span className="script">above the clouds</span>
        </h2>
        <p className="lede">Family-run tea houses, heated camps and a Ladakhi guesthouse. Each one checked by our guides every season.</p>
      </div>
      <div className="stayrow">
        {STAYS.map((s, i) => (
          <article key={s.n} className="stay glass" {...(i === 1 ? { "data-hover-demo": "" } : {})}>
            <div className="glare" />
            <div className="glow" />
            <div className="ph">
              <div className="ly back" data-d="0.35" style={{ backgroundImage: `url(${img(s.img)})` }} />
              <div className="ly haze" data-d="1" />
              <div className="ly front" data-d="1.9" style={{ backgroundImage: `url(${img(s.img + "-cut")})` }} />
              <div className="xtra">
                {s.x.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </div>
            <div className="body">
              <b>{s.n}</b>
              <div className="meta">
                <span>{s.a}</span>
                <span>{s.r}</span>
              </div>
              <div className="row2">
                <div className="px">
                  {s.px} <small>/night</small> <Sample />
                </div>
                <span className="go">View stay ↗</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <i className="ct-plane-anchor" data-plane data-hide data-sec="stays" data-f0="0.05" data-f1="0.95" />
      </div>
    </section>
  );
}
