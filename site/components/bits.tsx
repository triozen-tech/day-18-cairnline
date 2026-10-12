import type { CSSProperties } from "react";
import { img, seeded } from "../content";

/** Shared SVG art: the trail-map contour pattern and the paper plane folded from it (3 faces). Rendered once. */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <pattern id="ct-contours" width="240" height="240" patternUnits="userSpaceOnUse">
          <rect width="240" height="240" fill="#f3ead8" />
          <g fill="none" stroke="#b89a6c" strokeWidth="1.1" opacity=".75">
            <path d="M30 180c20-40 60-70 100-60s70 50 90 30" />
            <path d="M40 196c24-44 66-80 108-68s64 54 84 34" />
            <path d="M70 160c10-30 40-50 70-40s40 30 50 20" />
            <path d="M90 146c8-18 28-30 48-24s28 18 34 12" />
            <path d="M108 134c6-10 16-16 28-12s16 10 20 6" />
            <path d="M10 60c40 10 60-20 100-10s60 30 120 10" />
            <path d="M10 76c40 12 66-18 104-8s62 32 126 12" />
            <path d="M10 40c50 8 70-14 110-6s70 22 120 6" />
          </g>
          <path d="M40 210 C80 150 120 170 150 120 S200 70 220 40" fill="none" stroke="#C63D66" strokeWidth="2.2" strokeDasharray="2 6" strokeLinecap="round" />
          <circle cx="220" cy="40" r="5" fill="#C63D66" />
        </pattern>
        <g id="ct-mapart">
          <rect width="240" height="240" fill="url(#ct-contours)" />
          <path d="M120 0v240M0 120h240" stroke="#c9b48e" strokeWidth="1" opacity=".6" />
        </g>
        <g id="ct-planeart">
          <path d="M4 30 L92 6 L40 40 Z" fill="#f6efe0" />
          <path d="M4 30 L92 6 L34 52 Z" fill="url(#ct-contours)" opacity=".95" />
          <path d="M40 40 L92 6 L46 50 Z" fill="#d9c7a4" />
          <path d="M4 30 L92 6" stroke="#9d8662" strokeWidth=".9" />
          <path d="M40 40 L92 6" stroke="#8f7754" strokeWidth=".9" />
        </g>
      </defs>
    </svg>
  );
}

/** The cairn logo: three stacked stones in a ring, the top one alpenglow rose. */
export function CairnLogo({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 34 34" width={size} height={size} aria-hidden>
      <circle cx="17" cy="17" r="16" fill="none" stroke="#fff" strokeWidth="1.6" />
      <ellipse cx="17" cy="24" rx="8" ry="3.2" fill="#fff" />
      <ellipse cx="17" cy="18.2" rx="5.6" ry="2.6" fill="#fff" />
      <ellipse cx="17" cy="13.2" rx="3.6" ry="2.1" fill="#E8577E" />
    </svg>
  );
}

/**
 * The paper plane resting in a section (its landing spot). Round 2 replaces these with one travelling plane that
 * reads the same spots (data-plane anchors), so the static page already shows where it lands.
 */
export function PlaneRest({ sec, rot = -12, scale = 1, style, f0, f1 }: { sec: string; rot?: number; scale?: number; style?: CSSProperties; f0?: number; f1?: number }) {
  return (
    <i className="ct-plane-anchor" data-plane data-sec={sec} data-rot={rot} data-s={scale} data-f0={f0} data-f1={f1} style={style}>
      <svg className="ct-plane-rest" viewBox="0 0 96 56" style={{ transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})` }} aria-hidden>
        <use href="#ct-planeart" />
      </svg>
    </i>
  );
}

/** A soft cloud bank made of radial puffs (deterministic, so server and client match). */
export function CloudBank({ n, seed, h, className }: { n: number; seed: number; h: number; className?: string }) {
  const r = seeded(seed);
  const puffs = Array.from({ length: n }, (_, i) => {
    const w = 180 + r() * 380;
    return { left: (i / n) * 100 + r() * 4, top: r() * (h - w * 0.55), w };
  });
  return (
    <div className={className} aria-hidden>
      {puffs.map((p, i) => (
        <i key={i} style={{ left: `${p.left.toFixed(2)}%`, top: `${p.top.toFixed(1)}px`, width: `${p.w.toFixed(0)}px`, height: `${(p.w * 0.6).toFixed(0)}px` }} />
      ))}
    </div>
  );
}

/**
 * X97 cloud seam between two sections: two layers of soft cumulus (pre-rendered from noise, tileable, lit from the
 * top with blue undersides) drifting at different speeds. Lower opacity over dark sections. PlaneTravel fades a seam
 * in only while its boundary crosses the middle of the screen, so no band ever sits under the nav at rest.
 */
export function Seam({ k, tone }: { k: number; tone: "light" | "dark" }) {
  const r = seeded(101 + k * 17);
  const tex = tone === "dark" ? ["cloud-dark-b", "cloud-dark-a", "cloud-c"] : ["cloud-b", "cloud-c", "cloud-a"];
  const layers = tex.map((t, i) => {
    const bw = Math.round(1900 + r() * 1100); // tile width varies per layer and seam: never a row of identical puffs
    const bh = Math.round(128 + r() * 64);
    return {
      cls: ["back", "mid", "front"][i],
      style: {
        backgroundImage: `url(${img(t)})`,
        ["--bw" as string]: `${bw}px`,
        ["--bh" as string]: `${bh}px`,
        height: `${bh}px`,
        ["--dur" as string]: `${Math.round([170, 120, 85][i] * (0.8 + r() * 0.5))}s`,
        animationDelay: `${(-r() * 80).toFixed(1)}s`,
        top: `${Math.round(-bh * [0.72, 0.62, 0.58][i] + (r() - 0.5) * 18)}px`,
        backgroundPositionX: `${Math.round(r() * bw)}px`,
      },
    };
  });
  return (
    <div className={`ct-seam ${tone}`} data-seam aria-hidden>
      {layers.map((l) => (
        <div key={l.cls} className={`cl ${l.cls}`} style={l.style} />
      ))}
    </div>
  );
}

/** The small "sample" label every price and figure carries. */
export function Sample({ children = "sample" }: { children?: string }) {
  return <span className="ct-sample">{children}</span>;
}

/** A dotted ridge line (nav progress, footer wordmark cut). */
export function ridgePoints(seed: number, step: number, lo: number, hi: number, start: number, width = 1440) {
  const r = seeded(seed);
  let y = start;
  const pts: [number, number][] = [];
  for (let x = 0; x <= width; x += step) {
    y = Math.min(hi, Math.max(lo, y + (r() - 0.5) * 30));
    pts.push([x, +y.toFixed(1)]);
  }
  return pts;
}
