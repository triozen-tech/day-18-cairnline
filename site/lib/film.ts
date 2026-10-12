"use client";

// Scroll films for the hero: WebP frame sequences picked by VIDEO TIME (manifest `times`), two neighbour frames
// blended so a scrub never steps (lessons 1, 2). Frames load during the loader (the loader's % is the real load).
import { loading } from "@/lib/loading";

export type Film = {
  times: number[];
  imgs: HTMLImageElement[];
  loaded: number;
  ready: Promise<void>;
};

type Manifest = { count: number; ext: string; pad: number; prefix: string; times: number[] };

/** Load every frame of /frames/<dir> whose time lies in [t0, t1] (plus one frame either side). */
export function loadFilm(dir: string, t0: number, t1: number, taskId: string): Film {
  const film: Film = { times: [], imgs: [], loaded: 0, ready: Promise.resolve() };
  loading.register(taskId);
  film.ready = fetch(`${dir}/manifest.json`)
    .then((r) => r.json() as Promise<Manifest>)
    .then((m) => {
      let a = m.times.findIndex((t) => t >= t0);
      let b = m.times.length - 1 - [...m.times].reverse().findIndex((t) => t <= t1);
      a = Math.max(0, a - 1);
      b = Math.min(m.times.length - 1, b + 1);
      const idx = Array.from({ length: b - a + 1 }, (_, k) => a + k);
      film.times = idx.map((i) => m.times[i]);
      return new Promise<void>((resolve) => {
        let done = 0;
        film.imgs = idx.map((i) => {
          const img = new Image();
          img.decoding = "async";
          const fin = () => {
            done++;
            film.loaded = done / idx.length;
            loading.update(taskId, film.loaded);
            if (done === idx.length) resolve();
          };
          img.onload = () => img.decode().catch(() => {}).finally(fin);
          img.onerror = fin;
          img.src = `${dir}/${m.prefix}${String(i + 1).padStart(m.pad, "0")}.${m.ext}`;
          return img;
        });
      });
    })
    .catch(() => loading.update(taskId, 1));
  return film;
}

/** The two frames around video time t and the blend between them. */
export function frameAt(film: Film, t: number): [number, number, number] {
  const T = film.times;
  if (!T.length) return [0, 0, 0];
  if (t <= T[0]) return [0, 0, 0];
  if (t >= T[T.length - 1]) return [T.length - 1, T.length - 1, 0];
  let lo = 0, hi = T.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (T[mid] <= t) lo = mid;
    else hi = mid;
  }
  return [lo, hi, (t - T[lo]) / (T[hi] - T[lo])];
}

/** Piecewise-linear lookup in a [[x, y], …] table. */
export function table(tab: [number, number][], x: number) {
  if (x <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) {
    const [x0, y0] = tab[i - 1], [x1, y1] = tab[i];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return tab[tab.length - 1][1];
}
export function hexLerp(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
}
