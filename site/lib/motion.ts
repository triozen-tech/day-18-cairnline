"use client";

// Shared motion helpers for Cairnline Treks. The engine's GSAP/Lenis setup stays in lib/ (never edited per site).
// Every scroll-linked effect reads the CURRENT scroll position (sticky stage + pinProgress), so it plays the same at
// any speed, forward and back (the user records by hand). Only ?static=1 turns motion off.
import { gsap, prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __ctLifted?: boolean;
  }
}

export const isStatic = () => prefersReducedMotion();
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Frame-rate independent follow (≈ GSAP scrub 0.5–0.8): moves `cur` toward `target`. */
export const follow = (cur: number, target: number, dt: number, rate = 9) => cur + (target - cur) * (1 - Math.exp(-dt * rate));

/** One ticker for the whole site: fn(time s, dt s). Returns an unsubscribe. */
export function onTick(fn: (time: number, dt: number) => void) {
  let last = -1;
  const h = (time: number) => {
    const dt = last < 0 ? 1 / 60 : Math.min(0.1, time - last);
    last = time;
    fn(time, dt);
  };
  gsap.ticker.add(h);
  return () => gsap.ticker.remove(h);
}

/** 0→1 while a tall pin wrapper scrolls past its sticky 100vh stage (0 = stage reaches the top, 1 = it leaves). */
export function pinProgress(wrapper: HTMLElement) {
  const r = wrapper.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? clamp(-r.top / span) : clamp(-r.top / window.innerHeight);
}

/** Is any part of the element on screen (with a margin)? */
export function onScreen(el: Element, margin = 100) {
  const r = el.getBoundingClientRect();
  return r.bottom > -margin && r.top < window.innerHeight + margin;
}

/** The site's own loader lifts (its cloud halves start parting): the hero intro starts on that frame (lesson 80). */
export function onLift(fn: () => void) {
  if (window.__ctLifted || isStatic()) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("ct:lift", h, { once: true });
  return () => window.removeEventListener("ct:lift", h);
}
export function signalLift() {
  window.__ctLifted = true;
  window.dispatchEvent(new Event("ct:lift"));
}

/** Swap a text box whole: the old line lifts out, then the new one rises in (lessons 85, 100). */
export function swapWhole(box: HTMLElement, text: string) {
  const cur = box.querySelector("span:not(.out)") as HTMLElement | null;
  if (cur && cur.textContent === text) return;
  if (cur) {
    cur.classList.add("out");
    setTimeout(() => cur.remove(), 450);
  }
  const s = document.createElement("span");
  s.textContent = text;
  s.className = "in";
  box.appendChild(s);
  requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove("in")));
}

/** F8: a paper-plane copy flies an arc from an element into the nav Trip bag; the bag owns the count (lesson 136). */
export function flyToBag(fromEl: Element) {
  const bag = document.getElementById("ct-bag");
  if (!bag) return;
  const a = fromEl.getBoundingClientRect();
  const b = bag.getBoundingClientRect();
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox", "0 0 96 56");
  el.classList.add("ct-fly-copy");
  el.innerHTML = '<use href="#ct-planeart"/>';
  document.body.appendChild(el);
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
  const cx = (x0 + x1) / 2 - 120, cy = Math.min(y0, y1) - 160;
  const at = (t: number) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  const o = { t: 0 };
  gsap.to(o, {
    t: 1,
    duration: 1.1,
    ease: "power2.inOut",
    onUpdate() {
      const [x, y] = at(o.t);
      const [x2, y2] = at(Math.min(1, o.t + 0.02));
      const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
      el.style.transform = `translate(${x - 35}px,${y - 20}px) rotate(${ang}deg) scale(${1 - o.t * 0.6})`;
    },
    onComplete() {
      el.remove();
      window.dispatchEvent(new Event("ct:bag"));
    },
  });
}
