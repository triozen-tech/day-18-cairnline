"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FOOT_NOTE, img } from "../content";
import { PlaneRest, ridgePoints } from "./bits";
import { isStatic, onTick } from "../lib/motion";

/**
 * 8 · Footer · FO05 + M75 (rises from behind a horizon).
 * Static: the sun up, CAIRNLINE standing in its ridge cut, the plane landed on the postcard stamp.
 * Round 3 raises the sun and the word on the clock when the footer arrives.
 */
export default function SunriseFooter() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const sec = root.current!;
    const send = sec.querySelector<HTMLButtonElement>(".send .pill")!;
    const sh = () => {
      send.classList.add("sent");
      send.innerHTML = "Sent ✓";
    };
    send.addEventListener("click", sh);
    if (isStatic()) return () => send.removeEventListener("click", sh);
    const sun = sec.querySelector<HTMLElement>(".sun")!;
    const word = sec.querySelector<SVGTextElement>(".wordmark text")!;
    const items = sec.querySelectorAll<HTMLElement>(".copy > *, .postcard");
    let on = false;
    let tl: gsap.core.Timeline | null = null;
    const reset = () => {
      tl?.kill();
      gsap.set(sun, { y: 240, opacity: 0.2 });
      gsap.set(word, { y: 130, opacity: 0 });
      gsap.set(items, { y: 40, opacity: 0 });
    };
    reset();
    const bg = sec.querySelector<HTMLElement>(".bg")!;
    const off = onTick(() => {
      const top = sec.getBoundingClientRect().top;
      // the view rises with the footer: Kanchenjunga is already in the visible top part while the footer arrives
      bg.style.transform = `translate3d(0,${(-Math.max(0, Math.min(top, innerHeight)) * 0.5).toFixed(1)}px,0)`;
      if (!on && top < innerHeight * 0.92) {
        on = true;
        tl = gsap.timeline()
          .to(sun, { y: 0, opacity: 1, duration: 2.6, ease: "power2.out" }, 0)
          .to(word, { y: 0, opacity: 1, duration: 1.3, ease: "power3.out" }, 0.15)
          .to(items, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.1);
      } else if (on && top > innerHeight * 0.98) {
        on = false;
        reset();
      }
    });
    return () => {
      off();
      tl?.kill();
      send.removeEventListener("click", sh);
    };
  }, []);
  const ridge = ridgePoints(5, 24, 50, 80, 70);
  const poly = ["0,0", ...ridge.map(([x, y]) => `${x},${y}`), "1440,0"].join(" ");
  const line = ridge.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <footer id="foot" ref={root} className="ct-sec ct-full" data-name="See you up there">
      <div className="bg" style={{ backgroundImage: `url(${img("goechala")})` }} />
      <div className="sun" />
      <div className="fshade" />
      <div className="copy">
        <h2>
          The mountains <span className="script">are waiting.</span>
        </h2>
        <p className="lede">Tell us the view you want to wake up to. A trip designer writes back within a day.</p>
      </div>
      <div className="postcard glass">
        <div>
          <b>Write to a trip designer</b>
          <p>Dates, fitness, the trek you&apos;ve been dreaming about. We&apos;ll plan the rest.</p>
        </div>
        <div className="stamp">
          <span className="stxt">
            PLACE
            <br />
            STAMP
          </span>
          <PlaneRest sec="foot" rot={-8} scale={0.8} f0={0.7} f1={1} style={{ left: "50%", top: "50%" }} />
        </div>
        <form className="send">
          <input placeholder="you@example.com" aria-label="Your email" />
          <button type="button" className="pill solid">
            Send <span className="arr">↗</span>
          </button>
        </form>
      </div>
      <div className="wordmark">
        <svg viewBox="0 0 1440 240" aria-label="Cairnline">
          <defs>
            <mask id="ct-ridgeMask">
              <rect width="1440" height="240" fill="#fff" />
              <polygon points={poly} fill="#000" />
            </mask>
            <linearGradient id="ct-wmG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="rgba(255,255,255,.55)" />
            </linearGradient>
          </defs>
          <g mask="url(#ct-ridgeMask)">
            <text x="720" y="228" textAnchor="middle" fontFamily="'Red Hat Display Variable', sans-serif" fontWeight="900" fontSize="236" textLength="1300" lengthAdjust="spacingAndGlyphs" fill="url(#ct-wmG)">
              CAIRNLINE
            </text>
          </g>
          <polyline points={line} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.5" strokeDasharray="2 7" />
        </svg>
      </div>
      <div className="fcols">
        <span>{FOOT_NOTE}</span>
        <nav>
          <a href="#dest">Treks</a>
          <a href="#deps">Departures</a>
          <a href="#stays">Stays</a>
          <a href="#hero">Back to the top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
