// All text + data for Cairnline Treks. Trek facts follow site/DESIGN.md → "Trek facts" (checked online 2026-10-11).
// Prices, ratings, seats and stay rates are samples (labelled on the page).

export const IMG = "/images/cairnline";
export const img = (name: string) => `${IMG}/${name}.webp`;

export const NAV_LINKS = [
  { href: "#dest", label: "Treks" },
  { href: "#climb", label: "The Climb" },
  { href: "#trip", label: "Trip" },
  { href: "#seasons", label: "When to go" },
  { href: "#stays", label: "Stays" },
  { href: "#deps", label: "Departures" },
];

/** Hero places: first frame of each flight film + the facts bar. */
export const PLACES = [
  { name: "Everest", film: "/frames/cairnline-v1", region: "Khumbu, Nepal", high: "5,545 m", best: "Mar–May · Oct–Nov", days: "12 days", from: "₹1,45,000" },
  { name: "Annapurna", film: "/frames/cairnline-v2", region: "Gandaki, Nepal", high: "5,416 m", best: "Mar–May · Oct–Nov", days: "16 days", from: "₹96,000" },
  { name: "Ladakh", film: "/frames/cairnline-v3", region: "Leh, India", high: "5,260 m", best: "Jun–Sep", days: "9 days", from: "₹34,000" },
];

/**
 * How each hero film is framed so the place name sits in clear sky (y ≈ 150–330) and the summit stays visible below
 * it: the film is lowered by `shift` px (measured from the peak line over time) and its own sky colour continues
 * above it. t0/t1 = the seconds of the film the hero uses (V3: its sky only returns after 4.3 s).
 */
export const HERO_FILMS = [
  { t0: 0, t1: 8, shift: [[0, 90], [3, 84], [8, 76]] as [number, number][], sky: [[0, "#5583a2"], [8, "#5383a2"]] as [number, string][] },
  { t0: 0, t1: 8, shift: [[0, 214], [2.25, 197], [4.5, 171], [7.5, 145], [8, 142]] as [number, number][], sky: [[0, "#62a7d6"], [8, "#4e9ed1"]] as [number, string][] },
  { t0: 4.6, t1: 6.5, shift: [[4.6, 310], [4.86, 275], [5.43, 223], [6.0, 192], [6.5, 173]] as [number, number][], sky: [[4.6, "#0d7cc9"], [5.43, "#0d6bb9"], [6.5, "#0d63ae"]] as [number, string][] },
];

export type Trek ={ n: string; r: string; days: number; lvl: string; alt: string; px: string; img: string };
export const TREKS: Trek[] = [
  { n: "Everest Base Camp", r: "Khumbu, Nepal", days: 12, lvl: "Challenging", alt: "5,545 m", px: "₹1,45,000", img: "everest" },
  { n: "Annapurna Circuit", r: "Gandaki, Nepal", days: 16, lvl: "Challenging", alt: "5,416 m", px: "₹96,000", img: "annapurna" },
  { n: "Markha Valley", r: "Ladakh, India", days: 9, lvl: "Moderate", alt: "5,260 m", px: "₹34,000", img: "ladakh" },
  { n: "Valley of Flowers", r: "Uttarakhand, India", days: 6, lvl: "Easy–moderate", alt: "4,329 m", px: "₹16,900", img: "flowers" },
  { n: "Kedarkantha", r: "Uttarakhand, India", days: 5, lvl: "Easy · winter", alt: "3,810 m", px: "₹14,500", img: "kedarkantha" },
  { n: "Goecha La", r: "West Sikkim, India", days: 11, lvl: "Moderate", alt: "≈4,600 m", px: "₹29,500", img: "goechala" },
];
/** Which trek sits in the centre of the arc in ?static=1 (the scroll turns the arc in Round 2). */
export const DEST_STATIC = 3;

/** The Climb camps on the stitched mountain (x, y = fractions of the image, measured on a7-climb-stitched). */
export const CAMPS = [
  { name: "Lukla", alt: 2860, x: 0.321, y: 0.942, temp: 5, day: 1, note: "Airstrip on a cliff, first tea house" },
  { name: "Namche Bazaar", alt: 3440, x: 0.214, y: 0.758, temp: 1, day: 2, note: "Market town, bakeries, first Everest view" },
  { name: "Tengboche", alt: 3860, x: 0.545, y: 0.665, temp: -2, day: 4, note: "Monastery on a ridge" },
  { name: "Dingboche", alt: 4410, x: 0.409, y: 0.561, temp: -6, day: 5, note: "Stone walls and yak pastures" },
  { name: "Lobuche", alt: 4940, x: 0.603, y: 0.489, temp: -9, day: 7, note: "Moraine camp under Nuptse" },
  { name: "Everest Base Camp", alt: 5364, x: 0.292, y: 0.437, temp: -12, day: 8, note: "Tents on the Khumbu glacier, via Gorak Shep 5,164 m" },
];
export const oxygen = (alt: number) => Math.round(100 * Math.exp(-alt / 7900));

/** EBC trip, 12 days (checked list): [altitude m, line, short title, photo index, caption after the altitude]. */
export const DAYS: [number, string, string, number, string][] = [
  [2610, "Fly Kathmandu → Lukla, walk to Phakding", "Lukla → Phakding", 0, "night in Phakding"],
  [3440, "Over the high suspension bridges to Namche Bazaar", "Phakding → Namche", 0, "night in Namche"],
  [3440, "Rest day in Namche, first view of Everest", "Namche rest day", 0, "night in Namche"],
  [3860, "Rhododendron forest to Tengboche monastery", "Namche → Tengboche", 1, "night at Tengboche"],
  [4410, "Into the Imja valley, Dingboche", "Tengboche → Dingboche", 1, "night in Dingboche"],
  [4410, "Acclimatise: hike to Nangkartshang", "Dingboche rest day", 1, "night in Dingboche"],
  [4940, "Along the moraine to Lobuche", "Dingboche → Lobuche", 2, "night in Lobuche"],
  [5364, "Gorak Shep (5,164 m), then Everest Base Camp", "Lobuche → Base Camp", 2, "night at Gorak Shep tea house"],
  [5545, "Sunrise on Kala Patthar, down to Pheriche", "Kala Patthar sunrise", 3, "night in Pheriche"],
  [3440, "Long descent back to Namche", "Pheriche → Namche", 3, "night in Namche"],
  [2860, "Last walk to Lukla, farewell dinner", "Namche → Lukla", 3, "night in Lukla"],
  [2860, "Morning flight from Lukla back to Kathmandu", "Lukla → Kathmandu", 3, "flight out from Lukla"],
];
/** Trip gallery by trail stage: D1–3 bridge, D4–6 Everest, D7–8 glacier, D9–12 dusk. */
export const TRIP_PHOTOS = ["bridge", "everest", "glacier", "dusk"];
/** Day shown in ?static=1 (index 7 = Day 8, Base Camp); Round 2 draws the chart day by day with the scroll. */
export const TRIP_STATIC_DAY = 7;
export const DATES = [
  { d: "Oct 24", left: 4 },
  { d: "Nov 14", left: 2 },
  { d: "Mar 20", left: 10 },
  { d: "Apr 10", left: 12 },
];
export const INCLUDES = ["Permits", "Guide + porter", "Tea houses", "Lukla flights", "All meals on trail"];
export const EBC_PRICE = 145000;

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const BEST = [
  "Kedarkantha",
  "Kedarkantha",
  "Kedarkantha · Everest BC · Annapurna Circuit",
  "Everest BC · Annapurna · Goecha La · Kedarkantha",
  "Everest BC · Annapurna · Goecha La",
  "Markha Valley",
  "Valley of Flowers · Markha Valley",
  "Valley of Flowers · Markha Valley",
  "Markha Valley",
  "Everest BC · Annapurna · Goecha La",
  "Everest BC · Annapurna · Goecha La",
  "Kedarkantha",
];
/** Mini map, west → east; m = best-month indexes (match the facts table). */
export const REGIONS = [
  { n: "Markha", x: 30, y: 56, m: [5, 6, 7, 8] },
  { n: "Kedarkantha", x: 100, y: 62, m: [11, 0, 1, 2, 3] },
  { n: "Flowers", x: 160, y: 84, m: [6, 7] },
  { n: "Annapurna", x: 215, y: 104, m: [2, 3, 4, 9, 10] },
  { n: "Everest", x: 275, y: 128, m: [2, 3, 4, 9, 10] },
  { n: "Goecha La", x: 335, y: 146, m: [3, 4, 9, 10] },
];
export const SEASON_OF = (m: number) => (m === 11 || m <= 1 ? 0 : m <= 4 ? 1 : m <= 8 ? 2 : 3);
export const SEASONS = [
  { name: "Snow season", img: "season-winter" },
  { name: "Rhododendron bloom", img: "season-spring" },
  { name: "Monsoon green", img: "season-monsoon" },
  { name: "Clear autumn", img: "season-autumn" },
];
/** Month shown in ?static=1 (October); the ring turns Jan → Dec with the scroll in Round 2. */
export const SEASON_STATIC_MONTH = 9;

export const STAYS = [
  { n: "Namche Stone House", a: "3,440 m", r: "8 rooms", px: "₹4,800", img: "stay-stone", x: ["Hot shower", "Bakery downstairs", "Everest view deck"] },
  { n: "Gokyo Lakeside Camp", a: "4,750 m", r: "6 heated tents", px: "₹6,200", img: "stay-tents", x: ["Heated domes", "Stargazing guide", "Oxygen on site"] },
  { n: "Hemis Guesthouse", a: "3,600 m", r: "12 rooms", px: "₹3,900", img: "stay-ladakh", x: ["Courtyard meals", "Rooftop tea", "Library"] },
  { n: "Tengboche Tea House", a: "3,860 m", r: "10 rooms", px: "₹4,200", img: "stay-teahouse", x: ["Monastery next door", "Yak-wool blankets", "Sunrise porch"] },
];

/** Departures (sample), all inside each trek's best months. */
export const DEPS = [
  { d: "Oct 24", wd: "Sat", trek: "Everest Base Camp", r: "Khumbu, Nepal", days: 12, lvl: "Challenging", px: "₹1,45,000", seats: 4 },
  { d: "Oct 31", wd: "Sat", trek: "Annapurna Circuit", r: "Gandaki, Nepal", days: 16, lvl: "Challenging", px: "₹96,000", seats: 7 },
  { d: "Nov 7", wd: "Sat", trek: "Goecha La", r: "West Sikkim, India", days: 11, lvl: "Moderate", px: "₹29,500", seats: 3 },
  { d: "Nov 14", wd: "Sat", trek: "Everest Base Camp", r: "Khumbu, Nepal", days: 12, lvl: "Challenging", px: "₹1,45,000", seats: 2 },
  { d: "Dec 19", wd: "Sat", trek: "Kedarkantha", r: "Uttarakhand, India", days: 5, lvl: "Easy · winter", px: "₹14,500", seats: 9 },
  { d: "Dec 26", wd: "Sat", trek: "Kedarkantha", r: "Uttarakhand, India", days: 5, lvl: "Easy · winter", px: "₹14,500", seats: 6 },
];

export const FOOT_NOTE = "Concept website by Triozen Tech · all prices and figures are samples";

export const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

/** Small seeded random (same output on server and client). */
export function seeded(seed: number) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}
