"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HERO_FILMS, PLACES } from "../content";
import { frameAt, hexLerp, loadFilm, table, type Film } from "../lib/film";
import { clamp, follow, isStatic, lerp, onLift, onTick, pinProgress, smooth } from "../lib/motion";
import { PlaneRest, Sample } from "./bits";

const B1 = 0.34; // EVEREST → ANNAPURNA
const B2 = 0.66; // ANNAPURNA → LADAKH
const SLOT: [number, number][] = [
  [0, 0.4],
  [0.28, 0.72],
  [0.6, 1],
]; // which part of the pin each film scrubs through
const FEATHER = 90;

function skyAt(i: number, t: number): [string, string] {
  const tab = HERO_FILMS[i].sky;
  let k = 1;
  while (k < tab.length - 1 && t > tab[k][0]) k++;
  const u = clamp((t - tab[k - 1][0]) / (tab[k][0] - tab[k - 1][0] || 1));
  const c = hexLerp(tab[k - 1][1], tab[k][1], u).match(/\d+/g)!.map(Number);
  const top = c.map((v, j) => Math.round(v * 0.62 + [11, 26, 51][j] * 0.38));
  return [`rgb(${c.join(",")})`, `rgb(${top.join(",")})`];
}

/**
 * 1 · Hero · HR42 + M945 (cloud-slide place swap over a flight film), from hero-1 (mine).
 * Pinned 260 %: each film scrubs by video time with a push-in; a cloud bank slides across at each place change; the
 * facts bar swaps whole; the altimeter counts. A self-playing intro runs from the loader until the scroll overtakes it
 * (lessons 64, 81); at rest the view keeps breathing (slow push + drift).
 */
export default function FlightHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = root.current!;
    if (isStatic()) return;
    const hs = [...sec.querySelectorAll<HTMLElement>(".hs")];
    const cans = hs.map((h) => h.querySelector("canvas")!);
    const ctxs = cans.map((c) => c.getContext("2d")!);
    const names = [...sec.querySelectorAll<HTMLElement>(".hname h1")];
    const vals = [...sec.querySelectorAll<HTMLElement>(".hbar .val")];
    const wipe = sec.querySelector<HTMLElement>(".cloudwipe")!;
    const altV = sec.querySelector<HTMLElement>(".alt .v span")!;
    const ticks = sec.querySelector<HTMLElement>(".alt .ticks")!;
    const films: Film[] = PLACES.map((p, i) => loadFilm(p.film, HERO_FILMS[i].t0, HERO_FILMS[i].t1, `hero-film-${i}`));
    const drawn = [false, false, false];

    const sizeAll = () => {
      hs.forEach((h) => (h.style.transform = "none"));
      cans.forEach((c, i) => {
        c.width = hs[i].offsetWidth;
        c.height = hs[i].offsetHeight;
      });
    };
    sizeAll();
    addEventListener("resize", sizeAll);

    function draw(i: number, t: number) {
      const f = films[i];
      if (!f.imgs.length || !f.imgs[0].complete) return;
      const c = cans[i], x = ctxs[i], W = c.width, H = c.height;
      const shift = table(HERO_FILMS[i].shift, t);
      const [sky, skyTop] = skyAt(i, t);
      const iw = (H * 16) / 9, ix = (W - iw) / 2;
      const g = x.createLinearGradient(0, 0, 0, shift + FEATHER);
      g.addColorStop(0, skyTop);
      g.addColorStop(1, sky);
      x.fillStyle = g;
      x.fillRect(0, 0, W, shift + FEATHER);
      const [a, b, k] = frameAt(f, t);
      x.globalAlpha = 1;
      x.drawImage(f.imgs[a], ix, shift, iw, H);
      if (k > 0.001 && b !== a) {
        x.globalAlpha = k;
        x.drawImage(f.imgs[b], ix, shift, iw, H);
        x.globalAlpha = 1;
      }
      const fe = x.createLinearGradient(0, shift, 0, shift + FEATHER);
      fe.addColorStop(0, sky);
      fe.addColorStop(1, sky.replace("rgb(", "rgba(").replace(")", ",0)"));
      x.fillStyle = fe;
      x.fillRect(0, shift - 1, W, FEATHER + 1);
      if (!drawn[i]) {
        drawn[i] = true;
        hs[i].classList.add("live");
      }
    }

    // intro: plays by itself from the loader lift until the scroll overtakes it
    const intro = { v: 0 };
    let introTw: gsap.core.Tween | null = null;
    const offLift = onLift(() => {
      introTw = gsap.to(intro, { v: 0.15, duration: 5, ease: "none" });
      gsap.fromTo(names[0], { y: 80, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power3.out", delay: 0.15, clearProps: "opacity,scale" });
      gsap.fromTo(sec.querySelectorAll(".hsub, .hbar, .alt"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.35, clearProps: "opacity" });
    });

    let shown = 0, idx = -1;
    const off = onTick((time, dt) => {
      const r = sec.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      shown = follow(shown, Math.max(pinProgress(sec), intro.v), dt, 9);
      const s = shown;
      const breathe = 1 + 0.018 * (0.5 - 0.5 * Math.cos(time * 0.55)); // slow life at rest
      const drift = Math.sin(time * 0.31) * 6;
      // visibility of each place: swap windows around B1, B2
      const c1 = clamp((s - (B1 - 0.06)) / 0.12), c2 = clamp((s - (B2 - 0.06)) / 0.12);
      const vis = [1 - smooth(0.2, 0.6, c1), Math.min(smooth(0.3, 0.75, c1), 1 - smooth(0.2, 0.6, c2)), smooth(0.3, 0.75, c2)];
      const xs = [-18 * smooth(0.2, 0.6, c1), c1 < 0.75 ? 18 * (1 - smooth(0.3, 0.75, c1)) : -18 * smooth(0.2, 0.6, c2), 18 * (1 - smooth(0.3, 0.75, c2))];
      hs.forEach((h, i) => {
        if (vis[i] <= 0.002) {
          h.style.opacity = "0";
          return;
        }
        const u = clamp((s - SLOT[i][0]) / (SLOT[i][1] - SLOT[i][0]));
        const t = lerp(HERO_FILMS[i].t0, HERO_FILMS[i].t1, u);
        draw(i, t);
        h.style.opacity = String(vis[i]);
        h.style.transform = `translate3d(${xs[i]}%,0,0) translateX(${drift}px) scale(${(1 + 0.12 * u) * breathe})`;
      });
      // names
      // names crossfade (overlapping), so a place name is readable at every point of the swap
      const nOut = [smooth(0.3, 0.62, c1), smooth(0.3, 0.62, c2)], nIn = [smooth(0.38, 0.7, c1), smooth(0.38, 0.7, c2)];
      const nv = [1 - nOut[0], Math.min(nIn[0], 1 - nOut[1]), nIn[1]];
      const nx = [-30 * nOut[0], nIn[0] < 1 ? 30 * (1 - nIn[0]) : -30 * nOut[1], 30 * (1 - nIn[1])];
      names.forEach((n, i) => {
        if (i === 0 && gsap.isTweening(n)) return;
        n.style.opacity = String(nv[i]);
        n.style.transform = `translateX(${nx[i]}%)`;
      });
      // cloud bank crossing (only during a swap)
      const cw = c1 > 0 && c1 < 1 ? c1 : c2 > 0 && c2 < 1 ? c2 : -1;
      wipe.style.transform = cw < 0 ? "translateX(120%)" : `translateX(${lerp(70, -100, cw)}%)`;
      // facts bar swaps whole
      const k = s < B1 ? 0 : s < B2 ? 1 : 2;
      if (k !== idx) {
        idx = k;
        vals.forEach((v) => [...v.children].forEach((c, j) => c.classList.toggle("on", j === k)));
        sec.dataset.place = String(k);
      }
      // exit: name, script line, altimeter and facts bar fade out over the last 5 % of the pin, before the stage rises
      // under the nav and before the cloud seam reaches the bar (raw scroll position, so it is exact both ways)
      const raw = pinProgress(sec);
      sec.style.setProperty("--exit", (r.bottom < innerHeight - 1 ? 1 : smooth(0.95, 0.998, raw)).toFixed(3));
      altV.textContent = Math.round(4200 + s * 2200).toLocaleString("en-IN");
      ticks.style.transform = `translateY(${s * 200}px)`;
    });

    // "Go there ↗" pill follows the pointer over the view (U26)
    const pill = document.getElementById("ct-gothere")!;
    let px = 0, py = 0, tx = 0, ty = 0, on = false;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY + 34;
      // hidden over any button, link or the facts bar, and never drawn over one
      const over = !!(e.target as HTMLElement).closest(".pill,.hbar,a,button");
      const pw = pill.offsetWidth / 2 + 10, ph = pill.offsetHeight / 2 + 10;
      const hits = [...sec.querySelectorAll<HTMLElement>("a, button, .hbar")].some((el) => {
        const b = el.getBoundingClientRect();
        return tx + pw > b.left && tx - pw < b.right && ty + ph > b.top && ty - ph < b.bottom;
      });
      on = !over && !hits && +(getComputedStyle(sec).getPropertyValue("--exit") || 0) < 0.5;
    };
    const leave = () => (on = false);
    sec.addEventListener("mousemove", move);
    sec.addEventListener("mouseleave", leave);
    const offPill = onTick(() => {
      px += (tx - px) * 0.2;
      py += (ty - py) * 0.2;
      pill.style.opacity = on ? "1" : "0";
      pill.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%) scale(${on ? 1 : 0.9})`;
    });

    return () => {
      off();
      offPill();
      offLift();
      introTw?.kill();
      removeEventListener("resize", sizeAll);
      sec.removeEventListener("mousemove", move);
      sec.removeEventListener("mouseleave", leave);
    };
  }, []);

  const fields = [
    { k: "Region", v: (p: (typeof PLACES)[number]) => p.region },
    { k: "Highest point", v: (p: (typeof PLACES)[number]) => p.high },
    { k: "Best months", v: (p: (typeof PLACES)[number]) => p.best },
    { k: "Days", v: (p: (typeof PLACES)[number]) => p.days },
  ];
  return (
    <section id="hero" ref={root} className="ct-sec ct-pin" style={{ ["--pin" as string]: "260vh" }} data-name="Flying in">
      <div className="stage ct-full">
        {PLACES.map((p, i) => {
          const f = HERO_FILMS[i];
          const shift = table(f.shift, f.t0);
          return (
            <div key={p.name} className={`hs${i === 0 ? " on" : ""}`} data-place={i} style={{ ["--shift" as string]: `${shift}px`, ["--sky" as string]: f.sky[0][1] }}>
              <div className="film" style={{ backgroundImage: `url(${p.film}/frame_0001.webp)` }} />
              <canvas aria-hidden />
            </div>
          );
        })}
        <div className="shade" />
        <div className="cloudwipe" aria-hidden />
        <div className="hname">
          {PLACES.map((p, i) => (
            <h1 key={p.name} className={i === 0 ? "on" : ""}>
              {p.name}
            </h1>
          ))}
        </div>
        <div className="hsub">
          <span className="script">Fly over it before you book.</span>
          <a className="pill glass" href="#trip" data-hover-demo>
            Plan this trek <span className="arr">↗</span>
          </a>
        </div>
        <div className="alt">
          <div className="ruler">
            <div className="ticks" />
          </div>
          <div className="v">
            <small>FLYING AT</small>
            <span>4,200</span> m
          </div>
        </div>
        <div className="hbar glass">
          {fields.map((f) => (
            <div key={f.k}>
              <div className="k">{f.k}</div>
              <div className="val">
                {PLACES.map((p, i) => (
                  <span key={p.name} className={i === 0 ? "on" : ""}>
                    {f.v(p)}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="k">
              From <Sample />
            </div>
            <div className="val">
              {PLACES.map((p, i) => (
                <span key={p.name} className={i === 0 ? "on" : ""}>
                  {p.from}
                </span>
              ))}
            </div>
          </div>
          <a className="pill solid" href="#dest">
            See all treks <span className="arr">↗</span>
          </a>
        </div>
        <PlaneRest sec="hero" rot={-14} f0={0} f1={0.9} style={{ left: "88%", top: "16%" }} />
      </div>
      <div className="ct-gothere" id="ct-gothere" aria-hidden>
        Go there ↗
      </div>
    </section>
  );
}
