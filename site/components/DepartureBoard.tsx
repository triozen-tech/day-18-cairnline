"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DEPS, img } from "../content";
import { flyToBag, isStatic, onTick } from "../lib/motion";
import { PlaneRest, Sample } from "./bits";

/** Seats per group: one rule everywhere. Filled dot = booked, empty dot = seat left; the count matches the dots. */
export const GROUP = 12;

/**
 * 7 · Departures & prices · LS05 + M9 (print-out line by line).
 * The rows print down one by one when the table arrives and the seats count down to each row's number; scrolled back
 * above, it resets so the next take plays it again. Hovers: row lift + next seat lights + Hold my seat (→ Held ✓, a
 * plane copy flies to the bag); month chips with a sliding highlight.
 */
export default function DepartureBoard() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    const offs: (() => void)[] = [];
    const filt = [...sec.querySelectorAll<HTMLButtonElement>(".filt button")];
    const fhl = sec.querySelector<HTMLElement>(".filt .hl")!;
    const rows = [...sec.querySelectorAll<HTMLElement>(".trow:not(.head)")];
    const slide = (b: HTMLElement, instant = false) => {
      const to = { x: b.offsetLeft - 5, width: b.offsetWidth };
      if (instant) gsap.set(fhl, to);
      else gsap.to(fhl, { ...to, duration: 0.5, ease: "power3.out", overwrite: true });
    };
    requestAnimationFrame(() => slide(filt[0], true));
    filt.forEach((b) => {
      const h = () => {
        filt.forEach((x) => x.classList.toggle("on", x === b));
        slide(b);
        const mth = b.textContent!.trim();
        rows.forEach((r) => r.classList.toggle("dim", mth !== "All" && r.dataset.m !== mth));
      };
      b.addEventListener("click", h);
      offs.push(() => b.removeEventListener("click", h));
    });
    sec.querySelectorAll<HTMLButtonElement>(".hold").forEach((b) => {
      const h = () => {
        if (b.classList.contains("held")) return;
        b.classList.add("held");
        b.textContent = "Held ✓";
        flyToBag(b);
      };
      b.addEventListener("click", h);
      offs.push(() => b.removeEventListener("click", h));
    });
    if (isStatic()) return () => offs.forEach((o) => o());

    // print-out on arrival, reset above
    let printed = false;
    let tl: gsap.core.Timeline | null = null;
    const setSeats = (r: HTMLElement, left: number) => {
      const dots = r.querySelectorAll(".dots i");
      dots.forEach((d, k) => d.classList.toggle("f", k < GROUP - left));
      r.querySelector(".seats .n")!.textContent = `${left} left`;
    };
    const reset = () => {
      tl?.kill();
      rows.forEach((r) => {
        gsap.set(r, { clipPath: "inset(0 0 100% 0)", y: -14 });
        setSeats(r, GROUP);
      });
    };
    const play = () => {
      tl = gsap.timeline();
      rows.forEach((r, i) => {
        const to = +r.dataset.seats!;
        const o = { v: GROUP };
        tl!.to(r, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.6, ease: "power2.out" }, i * 0.14)
          .to(o, { v: to, duration: 1.2, ease: "power2.out", onUpdate: () => setSeats(r, Math.round(o.v)) }, 0.25 + i * 0.14);
      });
    };
    reset();
    const off = onTick(() => {
      const top = sec.getBoundingClientRect().top;
      if (!printed && top < innerHeight * 0.45) {
        printed = true;
        play();
      } else if (printed && top > innerHeight * 0.95) {
        printed = false;
        reset();
      }
    });
    return () => {
      off();
      tl?.kill();
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <section id="deps" ref={root} className="ct-sec ct-full" data-name="Departures">
      <div className="bg" style={{ backgroundImage: `url(${img("dusk")})` }} />
      <div className="shade" />
      <div className="inner">
        <div className="hd">
          <h2>
            Next <span className="script">departures</span>
          </h2>
          <div className="filt glass">
            <span className="hl" aria-hidden />
            {["All", "Oct", "Nov", "Dec"].map((m, i) => (
              <button type="button" key={m} className={i === 0 ? "on" : ""}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="table">
          <div className="trow head">
            <span>Date</span>
            <span>Trek</span>
            <span>Days</span>
            <span>Level</span>
            <span>
              Price <Sample />
            </span>
            <span className="seathd">
              Seats of {GROUP} <Sample />
              <em className="legend">
                <i className="f" /> booked <i /> left
              </em>
            </span>
            <span />
          </div>
          {DEPS.map((d, i) => (
            <div key={d.d + d.trek} className="trow glass" data-m={d.d.slice(0, 3)} data-seats={d.seats} {...(i === 1 ? { "data-hover-demo": "" } : {})}>
              {i === 1 && <PlaneRest sec="deps" rot={-4} scale={0.75} f0={0.25} f1={0.8} style={{ left: -52, top: "50%" }} />}
              <div className="d">
                {d.d}
                <small>{d.wd} · 2026</small>
              </div>
              <div className="t">
                {d.trek}
                <small>{d.r}</small>
              </div>
              <div>{d.days} days</div>
              <div>{d.lvl}</div>
              <div className="p">{d.px}</div>
              <div className="seats">
                <span className="dots">
                  {Array.from({ length: GROUP }, (_, k) => (
                    <i key={k} className={k < GROUP - d.seats ? "f" : ""} />
                  ))}
                </span>
                <span className="n">{d.seats} left</span>
              </div>
              <button type="button" className="pill solid hold" {...(i === 1 ? { "data-hover-demo": "click" } : {})}>
                Hold my seat
              </button>
            </div>
          ))}
        </div>
        <div className="note">Sample dates, prices and seats · concept site · prices per person, twin sharing</div>
      </div>
    </section>
  );
}
