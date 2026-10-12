import type { SiteMeta, Theme } from "@/lib/site";

// Cairnline Treks · Day 18 · "Alpine Glass" (see site/DESIGN.md).

export const meta: SiteMeta = {
  name: "Cairnline Treks",
  title: "Cairnline Treks · Fly over it before you book",
  description: "Himalayan treks planned end to end: Everest Base Camp, Annapurna, Ladakh and more. Concept website.",
  loaderText: "Cairnline",
  // The site draws its own I38 map-folds-into-a-plane loader (site/components/MapLoader.tsx).
  loader: false,
  // the kit's custom cursor ring is off: the user records with the real pointer (record mode keeps its own cursor)
  cursor: false,
  record: { duration: 37 },
};

export const theme: Theme = {
  bg: "#0E1621",
  surface: "#16212F",
  text: "#F4F6F8",
  muted: "rgba(244,246,248,.74)",
  accent: "#E8577E",
  accentText: "#FFFFFF",
  line: "rgba(255,255,255,.32)",
  fontDisplay: "'Red Hat Display Variable', system-ui, sans-serif",
  fontBody: "'Red Hat Display Variable', system-ui, sans-serif",
  radius: 22,
};
