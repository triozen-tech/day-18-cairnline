"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { clamp, easeInOut, isStatic, lerp, onLift, onTick, smooth } from "../lib/motion";

type Anchor = { el: HTMLElement; hide: boolean; rot: number; s: number; s0: number; s1: number };

/**
 * F1 + M35: the paper plane folded from a trail map travels down the page (one driver, lesson 31). Its position comes
 * from the scroll position only, so it flies correctly at any speed and backwards: it rests at each section's anchor
 * (data-plane, the same spots ?static=1 draws), flies an arc between them turning along its path, bobs and flutters
 * at rest, leaves a fading dotted trail and hides above the clouds where marked.
 * The same driver fades the X97 cloud seams (only while a boundary crosses the screen, never under the nav at rest)
 * and gives every glass pill its magnetic pull (U68).
 */
export default function PlaneTravel() {
  const planeRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const plane = planeRef.current!;
    const trail = trailRef.current!;
    const tctx = trail.getContext("2d")!;
    const size = () => {
      trail.width = innerWidth;
      trail.height = innerHeight;
    };
    size();
    addEventListener("resize", size);

    let anchors: Anchor[] = [];
    const build = () => {
      const vh = innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      anchors = [...document.querySelectorAll<HTMLElement>("[data-plane]")].map((el) => {
        const sec = el.closest("section, footer") as HTMLElement;
        const T = sec.getBoundingClientRect().top + scrollY;
        const pinned = sec.classList.contains("ct-pin");
        const base = pinned ? T : T - vh * 0.5;
        const span = pinned ? sec.offsetHeight - vh : vh;
        const f0 = +(el.dataset.f0 || 0), f1 = +(el.dataset.f1 || 1);
        return { el, hide: el.hasAttribute("data-hide"), rot: +(el.dataset.rot || -12), s: +(el.dataset.s || 1), s0: Math.min(max, base + f0 * span), s1: Math.min(max, base + f1 * span) };
      });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(document.body);

    const posOf = (a: Anchor) => {
      if (a.hide) return { x: innerWidth * 0.8, y: -170, o: 0, r: -34, s: 0.8 };
      const r = a.el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, o: 1, r: a.rot, s: a.s };
    };

    const intro = { on: true, t: 0, started: false };
    const offLift = onLift(() => {
      intro.started = true;
      gsap.to(intro, { t: 1, duration: 1.3, ease: "power2.inOut", delay: 0.05, onComplete: () => (intro.on = false) });
    });

    const cur = { x: innerWidth / 2, y: innerHeight / 2, r: 0, o: 0, s: 1 };
    const pts: { x: number; y: number; o: number }[] = [];
    const stamp = document.querySelector<HTMLElement>("#foot .stamp");
    const seams = [...document.querySelectorAll<HTMLElement>(".ct-seam")];

    const off = onTick((time) => {
      // seams: visible only while their boundary crosses the middle of the screen
      const vh = innerHeight;
      seams.forEach((sm) => {
        const y = sm.getBoundingClientRect().top;
        // fully on whenever the join itself is on screen, so no frame ever shows a hard edge between two photos
        // (a join is only on screen while scrolling between sections; at rest every stage covers the screen)
        const o = smooth(-110, -10, y) * (1 - smooth(vh + 10, vh + 110, y));
        sm.style.opacity = o.toFixed(3);
        sm.style.setProperty("--py", `${((y - vh / 2) * -0.08).toFixed(1)}px`);
      });

      if (!anchors.length) return;
      const s = scrollY;
      let tgt;
      const i = anchors.findIndex((a) => s < a.s0);
      if (i === -1) tgt = posOf(anchors[anchors.length - 1]);
      else if (i === 0) tgt = posOf(anchors[0]);
      else {
        const A = anchors[i - 1], B = anchors[i];
        if (s <= A.s1) tgt = posOf(A);
        else {
          const t = easeInOut(clamp((s - A.s1) / Math.max(1, B.s0 - A.s1)));
          const pa = posOf(A), pb = posOf(B);
          const p = (u: number) => ({ x: lerp(pa.x, pb.x, u), y: lerp(pa.y, pb.y, u) - Math.sin(Math.PI * u) * 150 });
          const q = p(t), q2 = p(Math.min(1, t + 0.02));
          const path = (Math.atan2(q2.y - q.y, q2.x - q.x) * 180) / Math.PI;
          const mid = clamp(Math.min(t, 1 - t) * 3.2);
          tgt = { x: q.x, y: q.y, o: lerp(pa.o, pb.o, t), r: lerp(lerp(pa.r, pb.r, t), path, mid), s: lerp(pa.s, pb.s, t) };
        }
      }
      if (intro.on) {
        const t = intro.t;
        const lx = innerWidth / 2 + 40, ly = innerHeight / 2 - 40;
        tgt = { x: lerp(lx, tgt.x, t), y: lerp(ly, tgt.y, t) - Math.sin(Math.PI * t) * 120, o: intro.started ? 1 : 0, r: lerp(-24, tgt.r, t), s: lerp(1.1, tgt.s, t) };
      }
      const k = intro.on ? 1 : 0.2;
      cur.x = lerp(cur.x, tgt.x, k);
      cur.y = lerp(cur.y, tgt.y, k);
      cur.r = lerp(cur.r, tgt.r, k);
      cur.o = lerp(cur.o, tgt.o, k);
      cur.s = lerp(cur.s, tgt.s, k);
      const bob = Math.sin(time * 2.2) * 4, flut = Math.sin(time * 3.1) * 2;
      plane.style.transform = `translate(${(cur.x - 48).toFixed(1)}px,${(cur.y - 28 + bob).toFixed(1)}px) rotate(${(cur.r + flut).toFixed(2)}deg) scale(${cur.s.toFixed(3)})`;
      plane.style.opacity = cur.o.toFixed(3);
      if (stamp) {
        const r = stamp.getBoundingClientRect();
        const near = Math.hypot(r.left + r.width / 2 - cur.x, r.top + r.height / 2 - cur.y) < 40 && cur.o > 0.5;
        stamp.classList.toggle("landed", near);
      }
      // fading dotted trail
      const rad = (cur.r * Math.PI) / 180;
      pts.push({ x: cur.x - 40 * cur.s * Math.cos(rad), y: cur.y + bob - 40 * cur.s * Math.sin(rad), o: cur.o });
      if (pts.length > 46) pts.shift();
      tctx.clearRect(0, 0, trail.width, trail.height);
      pts.forEach((p, j) => {
        if (j % 3) return;
        tctx.fillStyle = `rgba(255,255,255,${((j / pts.length) * 0.7 * p.o).toFixed(3)})`;
        tctx.beginPath();
        tctx.arc(p.x, p.y, 2.4, 0, 7);
        tctx.fill();
      });
    });

    // U68: magnetic pull on every glass pill
    let mag: HTMLElement | null = null;
    const mm = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(".ct-page .pill") as HTMLElement | null;
      if (mag && mag !== el) {
        gsap.to(mag, { "--mx": "0px", "--my": "0px", duration: 0.5, ease: "power3.out" });
        mag = null;
      }
      if (!el) return;
      mag = el;
      const r = el.getBoundingClientRect();
      gsap.to(el, { "--mx": `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px`, "--my": `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`, duration: 0.4, ease: "power3.out" });
    };
    addEventListener("mousemove", mm);

    return () => {
      off();
      offLift();
      ro.disconnect();
      removeEventListener("resize", size);
      removeEventListener("mousemove", mm);
    };
  }, []);

  return (
    <>
      <canvas className="ct-trail" ref={trailRef} aria-hidden />
      <svg className="ct-plane" ref={planeRef} viewBox="0 0 96 56" aria-hidden>
        <use href="#ct-planeart" />
      </svg>
    </>
  );
}
