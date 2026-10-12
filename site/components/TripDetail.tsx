"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { DATES, DAYS, EBC_PRICE, INCLUDES, TRIP_PHOTOS, TRIP_STATIC_DAY, fmt, img } from "../content";
import { clamp, flyToBag, follow, isStatic, lerp, onTick, pinProgress } from "../lib/motion";
import { PlaneRest, Sample } from "./bits";

const CW = 800;
const CH = 170;
/** Elevation → chart y. The top band (0–44) stays free so the resting plane never touches the day chips. */
const yOf = (a: number) => 56 + ((5600 - a) / (5600 - 2400)) * 100;
const xOf = (i: number) => 40 + i * ((CW - 60) / 11);
const PLANE_UP = 30; // plane rests this far above the marker (px)
const caption = (i: number) => `Day ${i + 1} · ${fmt(DAYS[i][0])} m · ${DAYS[i][4]}`;

/**
 * 4 · Trip detail (product detail) · BK02 + M8 (SVG line draw-on).
 * Pinned 170 %: the elevation line draws day by day, the marker and the chip highlight slide along, the photo and
 * caption change by trail stage. Hovers: loupe on the photo, date chips, stepper with a rolling total, Add to trip bag
 * (a plane copy flies into the nav bag).
 */
export default function TripDetail() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    const st = isStatic();
    const days = [...sec.querySelectorAll<HTMLButtonElement>(".days button")];
    const dayHl = sec.querySelector<HTMLElement>(".days .hl")!;
    const photos = [...sec.querySelectorAll<HTMLElement>(".mainph .p")];
    const thumbs = [...sec.querySelectorAll<HTMLElement>(".thumbs div")];
    const capT = sec.querySelector<HTMLElement>(".cap b")!;
    const capS = sec.querySelector<HTMLElement>(".cap span")!;
    const dayTxt = sec.querySelector<HTMLElement>(".daytxt")!;
    const clip = sec.querySelector<SVGRectElement>("#ct-elclip rect")!;
    const marker = sec.querySelector<HTMLElement>(".marker")!;
    const anchor = sec.querySelector<HTMLElement>(".plot [data-plane]")!;
    const offs: (() => void)[] = [];

    let cur = -1, ph = -1;
    const showPhoto = (k: number) => {
      if (k === ph) return;
      ph = k;
      photos.forEach((p, i) => p.classList.toggle("on", i === k));
      thumbs.forEach((t, i) => t.classList.toggle("on", i === k));
    };
    const slideHl = (hl: HTMLElement, btn: HTMLElement, instant = false) => {
      const to = { x: btn.offsetLeft, width: btn.offsetWidth };
      if (instant) gsap.set(hl, to);
      else gsap.to(hl, { ...to, duration: 0.5, ease: "power3.out", overwrite: true });
    };
    const setDay = (i: number, instant = false) => {
      if (i === cur) return;
      cur = i;
      days.forEach((b, k) => b.classList.toggle("on", k === i));
      slideHl(dayHl, days[i], instant);
      const d = DAYS[i];
      capT.textContent = d[2];
      capS.textContent = caption(i);
      dayTxt.innerHTML = `<b>Day ${i + 1}</b> · ${d[1]}`;
      showPhoto(d[3]);
    };
    days.forEach((b, i) => {
      const h = () => setDay(i);
      b.addEventListener("click", h);
      offs.push(() => b.removeEventListener("click", h));
    });
    thumbs.forEach((t, i) => {
      const h = () => showPhoto(i);
      t.addEventListener("click", h);
      offs.push(() => t.removeEventListener("click", h));
    });

    // booking: date chips, stepper + rolling total, Add to trip bag
    const dates = [...sec.querySelectorAll<HTMLButtonElement>(".dates button")];
    const dateHl = sec.querySelector<HTMLElement>(".dates .hl")!;
    dates.forEach((b) => {
      const h = () => {
        dates.forEach((x) => x.classList.toggle("on", x === b));
        slideHl(dateHl, b);
      };
      b.addEventListener("click", h);
      offs.push(() => b.removeEventListener("click", h));
    });
    let pax = 2;
    const paxEl = sec.querySelector<HTMLElement>(".ctl span")!;
    const total = sec.querySelector<HTMLElement>(".total .big")!;
    const tv = { v: EBC_PRICE * pax };
    const setPax = (n: number) => {
      pax = clamp(n, 1, 8);
      paxEl.textContent = String(pax);
      gsap.to(tv, { v: EBC_PRICE * pax, duration: 0.5, ease: "power2.out", onUpdate: () => (total.textContent = `₹${fmt(tv.v)}`) });
    };
    const [minus, plus] = [...sec.querySelectorAll<HTMLButtonElement>(".ctl button")];
    const m = () => setPax(pax - 1), p = () => setPax(pax + 1);
    minus.addEventListener("click", m);
    plus.addEventListener("click", p);
    const add = sec.querySelector<HTMLButtonElement>(".addbtn")!;
    const addH = () => flyToBag(add);
    add.addEventListener("click", addH);
    offs.push(() => {
      minus.removeEventListener("click", m);
      plus.removeEventListener("click", p);
      add.removeEventListener("click", addH);
    });

    // loupe (2.4×) over the main photo
    const mainph = sec.querySelector<HTMLElement>(".mainph")!;
    const loupe = sec.querySelector<HTMLElement>(".loupe")!;
    // sharp 2.4× of exactly the point under the pointer, taken from the full 2K photo (cover geometry of the .p box)
    const IW = 2752, IH = 1536, Z = 2.4;
    const lm = (e: MouseEvent) => {
      const r = mainph.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const k = photos.findIndex((p) => p.classList.contains("on"));
      const sc = Math.max(r.width / IW, r.height / IH), dw = IW * sc, dh = IH * sc;
      const fx = (x - (r.width - dw) / 2) / dw, fy = (y - (r.height - dh) / 2) / dh;
      const inner = loupe.clientWidth, bw = dw * Z, bh = dh * Z;
      loupe.style.backgroundImage = `url(${img(TRIP_PHOTOS[Math.max(0, k)] + "-2k")})`;
      loupe.style.backgroundSize = `${bw}px ${bh}px`;
      loupe.style.backgroundPosition = `${inner / 2 - fx * bw}px ${inner / 2 - fy * bh}px`;
      loupe.style.left = `${x}px`;
      loupe.style.top = `${y}px`;
    };
    mainph.addEventListener("mousemove", lm);
    offs.push(() => mainph.removeEventListener("mousemove", lm));

    requestAnimationFrame(() => {
      slideHl(dateHl, dates[0], true);
      if (st) slideHl(dayHl, days[TRIP_STATIC_DAY], true);
    });
    if (st) return () => offs.forEach((o) => o());

    // scroll: the chart draws day by day
    let pr = 0;
    setDay(0, true);
    const off = onTick((_t, dt) => {
      const r = sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      pr = follow(pr, pinProgress(sec), dt, 8);
      const q = clamp((pr - 0.04) / 0.86), f = q * 11;
      const i0 = Math.floor(f), i1 = Math.min(11, i0 + 1), t = f - i0;
      const mx = lerp(xOf(i0), xOf(i1), t), my = lerp(yOf(DAYS[i0][0]), yOf(DAYS[i1][0]), t);
      clip.setAttribute("width", String(mx + 1));
      marker.style.left = `${(mx / CW) * 100}%`;
      marker.style.top = `${(my / CH) * 100}%`;
      anchor.style.left = `calc(${(mx / CW) * 100}% + 10px)`;
      anchor.style.top = `calc(${(my / CH) * 100}% - ${PLANE_UP}px)`;
      setDay(Math.round(f));
    });
    return () => {
      off();
      offs.forEach((o) => o());
    };
  }, []);

  const di = TRIP_STATIC_DAY;
  const d = DAYS[di];
  const elev = DAYS.map((x, i) => `${i ? "L" : "M"}${xOf(i).toFixed(1)} ${yOf(x[0]).toFixed(1)}`).join(" ");
  const fill = `${elev} L${xOf(11).toFixed(1)} ${CH} L${xOf(0).toFixed(1)} ${CH} Z`;
  const mx = xOf(di);
  const my = yOf(d[0]);
  const pax = 2;
  const grid = [5500, 4000, 2500];
  return (
    <section id="trip" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "170vh" }} data-name="Trip detail">
      <div className="stage ct-full">
        <div className="bg" style={{ backgroundImage: `url(${img("everest")})` }} />
        <div className="grid">
          <div className="gal">
            <div className="top">
              <div className="mainph">
                {TRIP_PHOTOS.map((p, i) => (
                  <div key={p} className={`p${i === d[3] ? " on" : ""}`} style={{ backgroundImage: `url(${img(p)})` }} />
                ))}
                <div className="cap glass">
                  <b>{d[2]}</b>
                  <span>{caption(di)}</span>
                </div>
                <div className="loupe" />
              </div>
              <div className="thumbs">
                {TRIP_PHOTOS.map((p, i) => (
                  <div key={p} className={i === d[3] ? "on" : ""} style={{ backgroundImage: `url(${img(p + "-sm")})` }} />
                ))}
              </div>
            </div>
            <div className="chart glass">
              <div className="hd">
                <b>Day by day</b>
                <span>ELEVATION · METRES</span>
              </div>
              <div className="days">
                <span className="hl" aria-hidden />
                {DAYS.map((_, i) => (
                  <button type="button" key={i} className={i === di ? "on" : ""}>
                    D{i + 1}
                  </button>
                ))}
              </div>
              <div className="plot">
                <svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="ct-ef" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="rgba(232,87,126,.55)" />
                      <stop offset="1" stopColor="rgba(232,87,126,0)" />
                    </linearGradient>
                    <clipPath id="ct-elclip">
                      <rect x="0" y="0" width={CW} height={CH} />
                    </clipPath>
                  </defs>
                  <g stroke="rgba(255,255,255,.12)">
                    <path d={grid.map((a) => `M0 ${yOf(a).toFixed(1)}H800`).join("")} />
                  </g>
                  <g clipPath="url(#ct-elclip)">
                    <path className="elevfill" d={fill} />
                    <path className="elev" d={elev} vectorEffect="non-scaling-stroke" />
                  </g>
                </svg>
                {grid.map((a) => (
                  <span key={a} className="ylab" style={{ top: `${(yOf(a) / CH) * 100}%` }}>
                    {fmt(a)}
                  </span>
                ))}
                <i className="marker" style={{ left: `${(mx / CW) * 100}%`, top: `${(my / CH) * 100}%` }} />
                <PlaneRest sec="trip" rot={-18} scale={0.55} f0={0.12} f1={0.9} style={{ left: `calc(${(mx / CW) * 100}% + 10px)`, top: `calc(${(my / CH) * 100}% - ${PLANE_UP}px)` }} />
              </div>
              <div className="daytxt">
                <b>Day {di + 1}</b> · {d[1]}
              </div>
            </div>
          </div>
          <aside className="book glass">
            <div>
              <div className="k">Everest region · 12 days</div>
              <h3>
                Everest Base Camp
                <br />
                &amp; Kala Patthar
              </h3>
              <div className="rate">
                ★ 4.9 · 1,240 trekkers <Sample />
              </div>
            </div>
            <div>
              <div className="k">Departure</div>
              <div className="dates">
                <span className="hl" aria-hidden />
                {DATES.map((x, i) => (
                  <button type="button" key={x.d} className={i === 0 ? "on" : ""} {...(x.d === "Nov 14" ? { "data-hover-demo": "click" } : {})}>
                    {x.d}
                    <small>{x.left} left</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="step">
              <div className="k" style={{ margin: 0 }}>
                Trekkers
              </div>
              <div className="ctl">
                <button type="button" aria-label="One less trekker">
                  −
                </button>
                <span>{pax}</span>
                <button type="button" aria-label="One more trekker">
                  +
                </button>
              </div>
            </div>
            <div className="incl">
              {INCLUDES.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            <div className="total">
              <div>
                <small>
                  TOTAL <Sample />
                </small>
                <div className="big">₹{fmt(EBC_PRICE * pax)}</div>
              </div>
              <small>₹{fmt(EBC_PRICE)} per person · twin sharing</small>
            </div>
            <button type="button" className="pill solid addbtn" data-hover-demo="click">
              Add to trip bag <span className="arr">↗</span>
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
