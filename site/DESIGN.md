# Cairnline Treks · Day 18 · DESIGN.md

**Mode: FULL (Max)**: recorded 1440×900 reels from Round 2 (must PASS), full screenshots and reports.

**Status: Round 0 approved by the user (2026-10-11) with 4 changes (brand → Cairnline Treks, hand-scrolled reel, checked trek facts, asset fallbacks), all written in below. Fixed layout approved by the user (2026-10-11), the "Alpine Glass" mockup `day18/refs/layouts/a-alpine-glass.html` (+ `scenes.js`), with every motion previewed. The Stays section was changed at the user's request to gyro 3D tilt cards. Next: the user generates assets (V1 first, as a test) and pastes back the prompts that ran. Round 1 waits until the user says Day 17 is finished.**

**Round 3 (2026-10-12): done**, after the Round 2 fixes.
- **Nav:** turns to frosted glass once the page leaves the top.
- **Hero exit:** the name, script line, altimeter and facts bar fade out over the last 5 % of the hero pin.
- **Destinations arrival:** the backdrop rises out of the seam with a zoom, and the arc, pager and card fade in only once the stage lands.
- **Clouds:**
  - Hero swap: a textured noise cloud bank.
  - Seams: 3 layers each, every layer with its own size, height, speed and offset. Dark seams use soft, low-contrast mist.
- **"Go there" pill:** hides near any button, link or the facts bar.
- **Loupe:** a 2.4× crop from the 2K photos.
- **The Climb:** a dark pool behind the title, plus a second star layer.
- **Other fixes:** brighter chart labels, the kit's cursor ring turned off, the cursor date back to Nov 14, and a fainter, slower sky light.
- **Check take:** `recordings/day-18-cairnline-r3-test.mp4`.

**Round 2 (2026-10-12): motion built**, after the Round 1 fixes.
- **Round 1 fixes:**
  - Hero names sit in the clear sky band: each film is lowered by a measured, time-based shift and its own sky colour continues above it. V3 uses its 4.6–6.5 s, where the sky returns.
  - The seams are rebuilt as noise-rendered cumulus that only show while a boundary crosses the screen.
  - A13 is the redo image (✦ cleaned, re-cut).
  - Trip chart: D12 ends at Lukla 2,860 m, the Day 8 caption reads "night at Gorak Shep tea house", and the plane rests between the chips and the marker.
  - Seats use 12 dots everywhere (● booked ○ left), and Tengboche is 3,860 m everywhere.
  - The stamp text hides under the plane.
- **Pins:** sticky stages read the live scroll position: hero 260vh · Destinations 220vh · Climb 320vh · Trip 170vh · When to go 200vh · Stays 130vh.
- **The Climb:** starts at Lukla. The HUD reading follows the climb's progress (Base Camp at about 62 %), then the summit view.
- **Idle life on camera:** a page-wide "sky light" (soft drifting sun patches with a linear waver, screen blend; lessons 70, 71) keeps every pause alive.
- **Check take:** `recordings/day-18-cairnline-r2-test.mp4`, hand-style wheel scroll with real hovers. freezedetect: none; frame-diff: no stretch ≥ 0.3 s.

**Round 1 (2026-10-12): static build done** (`?static=1`, all 8 sections + loader + nav, real assets; screenshots in `recordings/day-18-r1-static/`). Climb = stitched A, shown as a centred 1150 px column (the 1.4× full-width stretch looked soft). Loader still is shown with `?loader=1` until Round 2 animates it.

**Brand: Cairnline Treks** (fictional; the name in the plan belongs to a real Indian travel company, so it is not used anywhere). Footer wordmark: **CAIRNLINE**. Logo: a small cairn of three stacked stones in a circle. Day folder `day18/cairnline-treks-kit`, repo later `day-18-cairnline`.

Travel agency for Himalayan treks (₹ sample prices). Reel hook: "Fly over the mountains before you book." **Travelling-object day** (every 3rd site): a paper plane folded from a trail map.

Rules for today: desktop 1440×900 only · no real-brand look-alikes · **no AI faces, hands or people** (landscapes, trails, tea houses, tents, gear only) · footer "Concept website by Triozen Tech" · every price and figure labelled as a sample · MIT/ISC/Apache code only (GSAP as already set up in the kit) · motion always on (only `?static=1` turns it off) · no Flow/Veo prompts in this file except under "Prompts (as run)".

Uniqueness: **7 of 8 different** from each of the last 3 sites (the nav is the N1 family, as on Day 17, but a different layout, NV19, and a different motion), see the sites log.

## References (lesson 129: layout path)

The user's inbox had two references, both "mine": **hero-1** (clip) and **destinations-1** (still). The user asked for every other section to be designed in the same style, so the page was built as one fixed full-page layout, not as per-section board picks.

- **hero-1 · mine:** a giant white place name centred over a full-screen view, a sideways cloud slide to the next place, a "Go there" pill on the cursor, a glass facts bar along the bottom. We take the swap, the pill and the bar. We do not take its photos, people or brand.
- **destinations-1 · mine:** a full-bleed moody photo, a script headline with a glass "New" chip, an arc of round destination photos on the right with script names and a dot pager, glass buttons. We take the arc, the type pairing, the chip and the glass.
- **All other sections: ours**, in the same photo-led, glassy style.
- Nothing copies a real brand's site. Logo, copy and imagery are ours.

## Recording: the user scrolls by hand

The reel is filmed by hand at 1440×900, so:
- **Every scroll-linked motion works at any speed, forward and back.** Scrubs are tied to scroll position only (never one-way `once` triggers for anything that changes with the scroll), with light smoothing (`scrub: 0.5–0.8`) so a fast flick still reads. Swaps (place names, trek card, "Now" word, month card) are decided from the current position, so going back shows the right state.
- **When the scroll stops, the view stays alive:** the hero film keeps a slow time-based push-in and drift on top of the scrub, clouds and seams drift, the plane bobs and flutters, Destinations' backdrop breathes, the Climb's stars twinkle and pins pulse, the season particles fall, the stay cards sway, the footer sun and light band move. Nothing depends on a hold timer.
- **Intros self-play:** the loader, the hero's first name, section copy arrivals and the departure rows printing down play by themselves on arrival (and reset when scrolled back above the section, so a second take plays them again).
- **Click demos are hover/click by the user** (date chip, Add to trip bag, Hold my seat). The engine's record cursor and `data-hover-demo` stay in as a **backup only**; nothing depends on them, and every `data-record-hold` is optional.
- **The reel time table below is a pause guide:** where to slow down or stop, and roughly for how long.

## Trek facts (checked online 2026-10-11, used the same everywhere)

| Trek | Region | Days (ours) | Highest point | Level | Best months | From (sample, per person, twin sharing) |
|---|---|---|---|---|---|---|
| Everest Base Camp & Kala Patthar | Khumbu, Nepal | 12 (Kathmandu → Kathmandu, Lukla flights included) | Kala Patthar 5,545 m (Base Camp 5,364 m) | Challenging | Mar–May · Oct–Nov | **₹1,45,000** |
| Annapurna Circuit | Gandaki, Nepal | 16 | Thorong La 5,416 m | Challenging | Mar–May · Oct–Nov | **₹96,000** |
| Markha Valley | Ladakh, India | 9 (incl. 2 acclimatisation days in Leh) | Kongmaru La 5,260 m | Moderate | Jun–Sep | **₹34,000** |
| Goecha La | West Sikkim, India | 11 (Yuksom → Yuksom) | View Point 1 ≈ 4,600 m (the pass itself, 4,940 m, is closed to trekkers) | Moderate | Apr–May · Oct–Nov | **₹29,500** |
| Valley of Flowers & Hemkund Sahib | Chamoli, Uttarakhand | 6 | Hemkund Sahib 4,329 m (valley ≈ 3,660 m) | Easy–moderate | Jul–Aug (park open Jun–Oct only; no departures outside it) | **₹16,900** |
| Kedarkantha | Uttarkashi, Uttarakhand | 5 | Summit 3,810 m | Easy (winter snow) | Dec–Apr | **₹14,500** |

Price ladder: the short Uttarakhand treks are cheapest, Everest with the Lukla flights is the most. Sources disagree on a few heights (Lobuche 4,910–4,940 m, Kongmaru La 5,100–5,275 m, Kala Patthar 5,545 or 5,644 m); we use one figure each, as above and below.

**The Climb camps (EBC, Day = trail day of our 12-day plan):** Lukla 2,860 m (Day 1) · Namche Bazaar 3,440 m (Day 2) · Tengboche 3,860 m (Day 4) · Dingboche 4,410 m (Day 5) · Lobuche 4,940 m (Day 7) · Everest Base Camp 5,364 m (Day 8, via Gorak Shep ≈ 5,164 m). HUD night temperatures are labelled "typical Oct–Nov night": 5 · 1 · −2 · −6 · −9 · −12 °C. Oxygen shown as % of sea level, from the altitude (≈ 70 % at Lukla → ≈ 51 % at Base Camp).

**Trip detail days (EBC):** D1 Lukla → Phakding 2,610 · D2 Namche 3,440 · D3 Namche rest 3,440 · D4 Tengboche 3,860 · D5 Dingboche 4,410 · D6 Dingboche rest (Nangkartshang hike) 4,410 · D7 Lobuche 4,940 · D8 Gorak Shep + Base Camp 5,364 · D9 Kala Patthar sunrise 5,545 → Pheriche · D10 Namche 3,440 · D11 Lukla 2,860 · D12 fly to Kathmandu 1,400.

**When to go (by month, from the best months above):** Jan, Feb Kedarkantha · Mar Kedarkantha, Everest BC, Annapurna Circuit · Apr Everest BC, Annapurna, Goecha La, Kedarkantha · May Everest BC, Annapurna, Goecha La · Jun Markha Valley · Jul, Aug Valley of Flowers, Markha Valley · Sep Markha Valley · Oct, Nov Everest BC, Annapurna, Goecha La · Dec Kedarkantha. The mini map shows the 6 treks as dots (west → east: Markha, Kedarkantha, Valley of Flowers, Annapurna, Everest, Goecha La), each lit in its best months.

**Departures (sample, all inside the best months):** Oct 24 Everest BC (4 seats left) · Oct 31 Annapurna Circuit (7) · Nov 7 Goecha La (3) · Nov 14 Everest BC (2) · Dec 19 Kedarkantha (9) · Dec 26 Kedarkantha (6). Trip detail date chips (EBC): Oct 24 · Nov 14 · Mar 20 · Apr 10 (2027), matching the table's seats. No Valley of Flowers or Markha departures this season (both summer only).

Hero facts bar: Everest · Khumbu, Nepal · 5,545 m · Mar–May · Oct–Nov · 12 days · ₹1,45,000 | Annapurna · Gandaki, Nepal · 5,416 m · Mar–May · Oct–Nov · 16 days · ₹96,000 | Ladakh · Leh, India · 5,260 m · Jun–Sep · 9 days · ₹34,000.

## Choices

| Menu | Pick | Why (this site) |
|---|---|---|
| Look | **L16 glass & chrome, "alpine glass" edition**: full-bleed Himalayan photography under frosted glass pills, cards and bars; cool dawn light; every section is a view, and the UI floats on it like frost on a window | it is the style of the user's two references; a travel page sells the view first |
| Palette | **Alpenglow glass**: ink `#0E1621`, ink-2 `#16212F`, snow `#F4F6F8`, muted `rgba(244,246,248,.74)`, glass `rgba(255,255,255,.13)` with a `.32` line, **accent alpenglow rose `#E8577E`** (fills behind white text use `#C63D66`, lesson 124), script tint `#FFD9C9` | the pink of sunrise on snow; not the category reflex (no forest green, no sky-blue accent) |
| Type | **Red Hat Display (500–900) + Red Hat Mono**, accent **Lobster Two Bold Italic** for script words (`@fontsource-variable/red-hat-display`, `@fontsource-variable/red-hat-mono`, `@fontsource/lobster-two`, all OFL). New pair, to be added to DESIGN-MENU as T31 | a bold geometric sans for giant place names (hero-1) plus a script accent (destinations-1); mono for altitudes, dates and samples |
| Nav | **N1 family as NV19 scrollspy header**: transparent bar (logo · 6 links · "Now ‹section›" · glass Trip bag pill); its bottom edge is a **mountain-ridge line with a dot that climbs it** as the page scrolls | the progress reads as a trail, and the bag reacts on camera |
| Hero | **HR42 full-screen slideshow over the aerial flight film**: EVEREST → ANNAPURNA → LADAKH swap with a sideways cloud slide, the film pushes in with the scroll, altimeter rail, glass facts bar | hero-1's swap, made cinematic with the plan's flight film; not a portal (nothing grows to full screen) |
| Section shape | **S13 cloud seam (new)**: soft cloud banks drift across every section boundary, parallax with the scroll | sections hand over through clouds, like flying |
| Cards | **C5 frosted glass** (+ C8 round photos in Destinations) | the references' glass pills and round thumbnails |
| Signature | **The Climb: "scroll down, climb up"** | the visitor climbs from Lukla to Everest Base Camp by scrolling: one tall mountain moves down, altitude rises, oxygen and temperature fall, frost creeps in, the sky turns night-blue |
| Loader | **I38 (new): a trail map folds into a paper plane**, real 0–100 counter, then two cloud halves part | starts the travelling object's story |
| Travelling object | **F1 waypoint travel + M35 path-follow + F8**: a paper plane folded from a trail map (code-drawn SVG, 3 faces, map texture) with a dotted trail | travel, maps and "fly over it" in one object; no extra Flow image |

**Eases:** arrivals `cubic-bezier(0.22,1,0.36,1)` (0.6–1.1 s), swaps `power3.out` 0.35–0.5 s, highlights `power3.out` 0.5 s; linear for scrubs and drift. Calm and cinematic, never bouncy (the only `back.out` is the bag count bump).

## Section plan (8 sections + loader + nav)

| # | Section | Layout | Reference | Built how |
|---|---|---|---|---|
| 0 | Loader | — | ours | map square with contour lines + dotted red route folds into the plane; counter; cloud halves part |
| — | Nav | **NV19** | ours | transparent bar, ridge-line progress dot, whole-word "Now" swap, glass Trip bag pill |
| 1 | Hero | **HR42** | **hero-1 · mine** | V1–V3 films full-screen, giant place name, script line "Fly over it before you book." + glass "Plan this trek ↗", altimeter rail left, glass facts bar (region · highest point · best months · days · from ₹ sample) + "See all treks" |
| 2 | Destinations | **GL10** (as an arc) | **destinations-1 · mine** | full-bleed backdrop of the centred trek, script headline "Walk where the road ends", glass "New" chip, arc of 6 round trek photos with script names, dot pager, glass trek card (days · level · max altitude · from ₹) |
| 3 | The Climb (signature) | **SY10** (altitude rope) | ours | one tall mountain image (valley → Base Camp), dotted trail, 6 camp pins, glass HUD (altitude · oxygen · night temp · trail day), rope progress at the right edge |
| 4 | Trip detail (product detail) | **BK02** | ours | main photo with loupe + 4 thumbs, day chips D1–D12, elevation chart, sticky glass booking card (dates, trekkers, inclusions, total, Add to trip bag) |
| 5 | When to go | **SY14** | ours | ring of 12 months around a round view whose weather changes, "Best in ‹month›" glass card, mini map of 6 regions |
| 6 | Stays on the trail | **LS01** | ours (changed to the user's pick: gyro tilt cards) | wide heading row, 4 tall glass cards in one row; each photo is 3 depth layers |
| 7 | Departures & prices | **LS05** | ours | glass rate rows (date · trek · days · level · price · seats left · Hold my seat), month chips |
| 8 | Footer | **FO05** | ours | statement "The mountains are waiting.", glass postcard to a trip designer (stamp = plane landing spot), giant CAIRNLINE with ridge-cut letter tops, rising sun, links, "Concept website by Triozen Tech · all prices and figures are samples" |

No layout code twice, none used by Days 15–17.

## Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | **I38 NEW · map folds into a paper plane** | CSS motion from the first paint (lesson 11): the map's halves fold up on the centre crease, the plane appears and flies off top-right; real 0→100 counter + bar (hero frames preload behind it, lesson 3); two cloud halves slide apart while the first place name rises | self-plays, 2.4 s; the hero film is already moving as the clouds part (lesson 4) |
| — | Nav | NV19 | **M422** progress line (as a ridge) | the dot rides the ridge line with page progress; the "Now" word swaps whole (old lifts out 0.15 s, then the new wipes in, lesson 85) | scroll-driven |
| 1 | Hero | HR42 | **M945 NEW · cloud-slide place swap over a flight film** | pinned ~260 %: each film scrubs by video time with a slow push-in; at each change a soft cloud bank sweeps across, the old view and name slide out left, the new ones in from the right, the facts bar crossfades whole; altimeter 4,200 → 6,400 m; the plane takes off from the loader and parks in the sky top-right. A self-playing intro runs until the scroll overtakes it (lessons 64, 81) | hand scroll; intro self-plays; idle push-in keeps going |
| 2 | Destinations | GL10 | **M444** images on a giant arc | pinned ~220 %: the arc of round photos turns with the scroll; the centred trek grows, gets a ring and shows its price line; the backdrop crossfades to it; the trek card swaps whole (lesson 100); copy rises in on arrival | scrub, one hover hold |
| 3 | **The Climb** | SY10 | **M946 NEW · scroll down, climb up** | pinned ~320 %: the tall mountain moves DOWN as you scroll, so the view climbs Lukla → Namche → Tengboche → Dingboche → Lobuche → Base Camp; HUD altitude 2,860 → 5,364 m, oxygen 70 → 51 %, typical night temp 5 → −12 °C, Day 1 → 8; the nearest camp pin lights; frost creeps in from the edges and the sky darkens to night with stars; rope fills. Different from Day 13 (route draws with a marker): here the whole view climbs and the air changes | scrub both ways; time-based life when stopped: stars twinkle, pins pulse, frost shimmer (lesson 9) |
| 4 | Trip detail | BK02 | **M8** SVG line draw-on | pinned ~170 %: the elevation line and its rose fill draw day by day, the day marker rides it, the day chip highlight slides along (U25), the main photo and caption change by trail stage | scrub, two click holds |
| 5 | When to go | SY14 | **M30** dial / rotate on scroll | pinned ~200 %: the month ring turns Jan → Dec, the top month fills white; the round view crossfades by season (snow · bloom · monsoon · clear autumn) with weather particles on a small canvas; the "Best in" card swaps whole; region dots light with a halo | scrub; particles keep the view alive |
| 6 | Stays | LS01 | **M31** 3D tilt-in from depth | pinned ~130 %: the 4 cards start lying flat and faded and stand up one by one (left → right, rotateX 72° → 0, from the bottom edge), then sway gently while idle | scrub, then one hover hold |
| 7 | Departures | LS05 | **M9** print-out line by line | rows print down one by one (clip from the top, 0.14 s apart), "seats left" counts down from 16 to each row's number (M3 support); resets when scrolled back above, so it replays | self-plays on arrival |
| 8 | Footer | FO05 | **M75** rises from behind a horizon | on enter, on the clock (lesson 77): the sun rises behind the ridge, CAIRNLINE rises behind its ridge cut, the copy and postcard arrive; clouds keep drifting, a coarse slow light band keeps the end screen alive (lessons 35, 55) | plays once on screen |
| ✈ | Paper plane | — | **F1 + M35** (+ **F8** copies) | one driver (lesson 31), position from the scroll only, so it flies correctly at any speed and backwards: anchors per section with hold windows; between them the plane flies an arc (lift 150 px), turns along its path, banks, bobs and flutters at rest, leaves a fading dotted trail; hides above the clouds where marked | never pauses in record mode; calm easing |

No code used twice. Hero (M945) and signature (M946) repeat no earlier site's hero or signature (every SITES-LOG row checked). The hero is not a portal.

**Transitions:** every boundary uses **X97 NEW · cloud seam** (two cloud banks at different speeds and depths, drifting with time + parallax with scroll; static blur only, lesson 36), plus: Hero → Destinations the cloud bank from the last swap carries on into the seam · Destinations → Climb **X2** colour wash to the valley's colour · Trip → When to go **X2** to the ring's navy · Departures → Footer the dusk sky brightens to dawn under the seam. Seams are opaque enough to hide the boundary and never leave an empty frame (lessons 14, 88).

## Hover map

| Element | Where | Hover effect | Code | Record cursor |
|---|---|---|---|---|
| View cursor pill | Hero | a white "Go there ↗" pill follows the pointer over the view (hides over buttons) | U26 | rides along on the hero stop |
| Glass pill button | everywhere | an alpenglow gradient rises from below (sky → rose → peach), arrow tips up-right; magnetic pull | U30 + U68 | `data-hover-demo` "Plan this trek ↗" |
| Nav link | Nav | a dotted route underline draws left → right | U35 | — |
| Trip bag pill | Nav | lifts; count bumps on every add | ours | — |
| Round trek photo | Destinations | ring draws around it, photo scales 6 %, price line opens ("6 days · from ₹16,900*" on Valley of Flowers); click turns the arc to it | ours | `data-hover-demo` (Valley of Flowers) |
| Camp pin | The Climb | pin lifts; a glass card opens (night, temperature, one line about the camp); pulsing dot | U124 | `data-hover-demo` (Base Camp) |
| Main trip photo | Trip detail | 2.4× round loupe follows the pointer | ours | — |
| Day / date / month chips | Trip, Departures | one white highlight slides to the chip (Flip on the highlight only, lesson 52) | U25 | backup: `data-hover-demo="click"` date "Nov 14" |
| Trekker stepper | Trip detail | button grows and fills glass; total rolls to the new value | U133 | — |
| Add to trip bag | Trip detail | white fills up from below, text turns ink; click = a plane copy arcs into the bag (F8), count bumps | U30 + F8 | `data-hover-demo="click"` |
| Month on the ring | When to go | previews that month (season view, best card, map dots) | ours | — |
| Stay card | Stays | **gyro tilt** toward the pointer (±9° X, ±11° Y); the 3 photo layers move apart (depth 0.35 / 1 / 1.9); a glare follows the tilt; warm lantern glow; card lifts 10 px; extras slide up; "View stay ↗" nudges | U66 + U80 | `data-hover-demo` (Gokyo camp); the record cursor circles on the card so the tilt plays |
| Departure row | Departures | row lifts and brightens, the next free seat dot turns rose, "Hold my seat" slides in | U138 + U121 | `data-hover-demo` row 2, then `="click"` Hold my seat (plane copy to the bag) |
| Send | Footer | becomes "Sent ✓" with a fill swap | U72 | — |
| Footer link / social | Footer | directional underline, icon lift | U64 | — |

## Product detail plan

| Interaction | Section | How it works here | From |
|---|---|---|---|
| Summit loupe | Trip detail | 2.4× round lens follows the pointer over the main photo | ours (PS13 idea) |
| Gallery | Trip detail | main photo + 4 thumbs; changes by trail stage with the day, or on thumb click | ours |
| Day chips + elevation chart | Trip detail | D1–D12 chips with a sliding highlight; the chart draws day by day; caption "Day 4 · 3,860 m · night at Tengboche" | ours |
| Departure date chips | Trip detail | Oct 24 · Nov 14 · Mar 20 · Apr 10 with "n left" (matches Departures); sliding highlight | ours |
| Group size + live total | Trip detail | − / + stepper (1–8); total rolls (₹1,45,000 × trekkers, sample) | ours |
| Inclusions | Trip detail | chips: Permits · Guide + porter · Tea houses · Lukla flights · All meals on trail | ours |
| Sticky booking card | Trip detail | glass card beside the gallery, stays put while the chart draws | BK02 |
| Add to trip bag | Trip detail → Nav | plane copy flies an arc into the bag (F8), count bumps, bag glows | ours |
| Price preview | Destinations | price line opens on the centred / hovered trek; trek card swaps whole | destinations-1 · mine + ours |
| Hold a seat | Departures | "Hold my seat" → "Held ✓", plane copy flies to the bag | ours |

All prices: "sample", per person, twin sharing.

## Travelling object · paper plane path (F1)

The plane is code-drawn (3 SVG faces with a contour-map texture and a red dotted route). It lands only in empty space and never covers text (lessons 53, 99).

| # | Section | What it does | Where it rests | Visible |
|---|---|---|---|---|
| 0 | Loader | the map folds into it; it flies off top-right | — | yes |
| 1 | Hero | takes off as the clouds part and arcs into the empty sky | top-right sky, above the place name (~73 %, 24 %), nose −14° | yes |
| 2 | Destinations | glides down along the arc | just below-right of the centred round photo, like a "chosen" tag, scale 0.8 | yes |
| 3 | The Climb | climbs out of the top of the screen ("above the clouds") | hidden | no |
| 4 | Trip detail | drops in onto the elevation chart | rides 40 px above the day marker as it moves | yes |
| 5 | When to go | flies up and out | hidden | no |
| 6 | Stays | — | hidden | no |
| 7 | Departures | dives in from the top | left of row 2 (Oct 31 · Annapurna Circuit), scale 0.75; the "Hold my seat" copy flies from that row to the bag | yes |
| 8 | Footer | final glide | lands on the postcard's stamp, scale 0.8: the journey ends | yes |

F8 copies: Add to trip bag (Trip detail) and Hold my seat (Departures). Each arcs into the nav bag and the count bumps (bag owns the count through one event, lesson 136).

## Record cursor path (backup only: the user scrolls and clicks by hand; nothing depends on it)

1. **Hero:** hover "Plan this trek ↗" (the "Go there" pill rides with it).
2. **Destinations:** hover the Valley of Flowers round photo (ring draws, price line opens).
3. **The Climb:** hover the Base Camp pin at the top of the climb (card opens).
4. **Trip detail:** click date "Nov 14" (Oct 24 is preselected; the highlight slides to Nov 14).
5. **Trip detail:** click **Add to trip bag** (the plane copy flies to the bag, count 0 → 1). The pointer stays on the button until the plane lands (lesson 111).
6. **Stays:** hover the Gokyo Lakeside Camp card; the pointer circles slowly on it, so the gyro tilt, glare and lantern glow play.
7. **Departures:** hover row 2 (seat dot lights, "Hold my seat" slides in).
8. **Departures:** click **Hold my seat** ("Held ✓", plane copy to the bag, count 1 → 2).

Every stop sits inside a `data-record-hold` ≤ 1.2 s with ambient life during it (drifting clouds, film push-in, idle sway; lessons 8, 74). The cursor stays off headlines.

## Reel time table: pause guide for the hand-scrolled take (target 37.0 s, allowed 34–38 s, loader included)

"Cursor" = what to hover or click yourself while paused (the record cursor does the same only as a backup).

| Time (s) | Section / step | Length | Cursor |
|---|---|---|---|
| 0.0–2.4 | Loader: map folds into the plane, counter, clouds part | 2.4 | — |
| 2.4–3.4 | Hero intro: EVEREST rises, film moves, plane parks in the sky | 1.0 | — |
| 3.4–4.3 | Hero hold | 0.9 | **hover** Plan this trek |
| 4.3–5.8 | Cloud slide → ANNAPURNA | 1.5 | — |
| 5.8–7.3 | Cloud slide → LADAKH | 1.5 | — |
| 7.3–7.9 | Cloud seam into Destinations | 0.6 | — |
| 7.9–10.0 | Arc turns: Everest → Annapurna → Markha → Valley of Flowers | 2.1 | — |
| 10.0–10.9 | Destinations hold | 0.9 | **hover** Valley of Flowers |
| 10.9–12.0 | Arc turns: Kedarkantha → Goecha La | 1.1 | — |
| 12.0–12.6 | Seam + colour wash into the valley | 0.6 | — |
| 12.6–17.4 | The Climb: 6 camps (0.8 s each), HUD, frost, night sky | 4.8 | — |
| 17.4–18.3 | Climb hold at Base Camp | 0.9 | **hover** Base Camp pin |
| 18.3–18.9 | Seam into Trip detail | 0.6 | — |
| 18.9–20.9 | Chart draws D1 → D8, photos change | 2.0 | — |
| 20.9–21.8 | Trip pause | 0.9 | **click** Nov 14 |
| 21.8–23.0 | Trip hold: plane copy flies to the bag | 1.2 | **click** Add to trip bag |
| 23.0–24.0 | Chart finishes D9 → D12 | 1.0 | — |
| 24.0–24.6 | Seam + navy wash into When to go | 0.6 | — |
| 24.6–28.2 | Month ring turns Jan → Dec (0.3 s each), weather changes | 3.6 | — |
| 28.2–28.8 | Seam into Stays | 0.6 | — |
| 28.8–30.6 | Cards stand up one by one | 1.8 | — |
| 30.6–31.5 | Stays hold: gyro tilt + glow | 0.9 | **hover** Gokyo camp card |
| 31.5–32.1 | Seam into Departures | 0.6 | — |
| 32.1–33.1 | Rows print down, seats count down | 1.0 | — |
| 33.1–34.3 | Departures hold | 1.2 | **hover** row 2 → **click** Hold my seat |
| 34.3–34.9 | Seam into the footer | 0.6 | — |
| 34.9–37.0 | Footer: sun + wordmark rise, plane lands on the stamp, clouds drift | 2.1 | — |

8 cursor stops (3 clicks, 5 hovers). Total 37.0 s.

## Assets

Source rule: **Flow stills + Veo films + code motion. No Blender**: no turntable signature (lesson 113). All stills share one look: crisp Himalayan dawn/day light, cool blue shadows with a warm alpenglow on the snow, natural colour, slight haze in the distance. **No people, faces, hands, animals with riders or vehicles in any image.** Every Flow still gets the ✦ check + clean (lessons 92, 112, 116) **before** it goes to Veo; every Veo clip gets its watermark cropped (lesson 7) and its last seconds checked for dissolves (lesson 114). Notes for the director, not prompts: lesson 90 (Veo turns "mist"/"fog" words into heavy fog) and lesson 115 (Flow edits need the attachment thumbnail visible).

| ID | What it shows | Used in | Size · type | Source | Code fallback | Picked file |
|---|---|---|---|---|---|---|
| **A1** | Aerial view over the Everest massif at sunrise: snow ridges in the foreground, Everest and Lhotse ahead, a clear sky band at the top for the name, wide empty middle | V1 start frame · Destinations "Everest Base Camp" · Trip photo D4–D6 + thumb · round photo crop | 16:9, 2752×1536 PNG/JPG | Flow (Nano Banana) | — (needed) | `raw/a1-everest-clean.jpg` ✅ |
| **A2** | Aerial view over the Annapurna range in golden morning light, green terraced foothills below, snow peaks ahead | V2 start · Destinations "Annapurna Circuit" · season "monsoon" fallback | 16:9, 2752×1536 | Flow | — (needed) | `raw/a2-annapurna-clean.jpg` ✅ |
| **A3** | Aerial view over Ladakh's dry, banded brown mountains with a few snow tops, deep blue sky, a river valley winding through | V3 start · Destinations "Markha Valley" | 16:9, 2752×1536 | Flow | — (needed) | `raw/a3-ladakh-clean.jpg` ✅ |
| **V1 (test first)** | Smooth forward flight over A1's ridges (slow, steady, no turns, the camera keeps its height; peaks stay in place, only the ground passes below) | Hero place 1 (scroll-scrubbed by video time) | Veo 8 s, 16:9 1080p MP4, start frame **A1** only (no end frame, lesson 114) | Flow (Veo) | A1 still + code push-in + drifting cloud layers | `raw/v1-everest.mp4` ✅ passed the test → `public/frames/cairnline-v1` |
| **V2** | Same flight style over A2 (**only if V1 passes the test**) | Hero place 2 | Veo 8 s, start **A2** | Flow (Veo) | A2 + code push-in | `raw/v2-annapurna-crop.mp4` (top 12 % + sides cropped, 1.14×) ✅ → `cairnline-v2` |
| **V3** | Same flight style over A3 (**only if V1 passes the test**) | Hero place 3 | Veo 8 s, start **A3** | Flow (Veo) | A3 + code push-in | `raw/v3-ladakh-crop.mp4` (blur cropped, 1.08×) ⚠ tilts up with two fast stretches (see Video plan) → `cairnline-v3` |
| **A4** | Valley of Flowers: a wide green alpine meadow full of wildflowers, a stream, snow peaks behind | Destinations · season "bloom" fallback | 16:9, 2752×1536 | Flow | code-drawn meadow (mockup scene) | `raw/a4-valley-flowers.jpg` ✅ |
| **A5** | Kedarkantha in winter: snowy pine forest on a ridge, a clear summit, soft blue light | Destinations · season "snow" fallback | 16:9, 2752×1536 | Flow | code scene | `raw/a5-kedarkantha.jpg` ✅ |
| **A6** | Goecha La at sunrise: Kanchenjunga glowing pink, layered dark ridges below with the lower third calm and dark (for the wordmark) | Destinations "Goecha La" · **Footer background** | 16:9, 2752×1536 | Flow | code scene | `raw/a6-goechala.jpg` ✅ |
| **A7a** | The Climb, upper half: Everest Base Camp area and the summit massif from below, glacier and moraine at the bottom edge, night-blue sky at the top | The Climb (stitched with A7b) | 9:16, 1536×2752 | Flow | code-drawn ridge layers (as the mockup), graded to match | `raw/a7a-climb-top.jpg` (came as a 1028×1536 portrait inside a 16:9 grey canvas) |
| **A7b** | The Climb, lower half: the same valley continuing down: moraine → Dingboche fields → Tengboche ridge → forest and the Lukla valley, with a thin dotted-trail-friendly path (no people) | The Climb | 9:16, 1536×2752, **Flow edit attaching A7a** so its top edge continues A7a's bottom edge | Flow (edit) | code layers | `raw/a7b-climb-bottom.jpg` (same padding; continues A7a exactly from its row 959) |
|  | → stitched vertically with a feathered seam to ~1536×5300, scaled to 1440 wide; camp pins placed by measuring the stitched image | | WebP, ≤ 2.5 MB | code (stitch) | | `raw/a7-climb-stitched.jpg` 1028×2495 · **picked by the user** → sharpened + fine grain at 1150 wide (`raw/a7-climb-1150-sharp.png`), shown as a centred 1150 px column with a night-sky gradient on the sides |
| **A7 (fallback)** | **If the A7a/A7b join doesn't read as one mountain:** one tall still, valley at the bottom → Base Camp and summit massif at the top, night-blue sky above | The Climb (shorter climb: ~1,660 px of travel at 1440 wide, the pin is shortened to match) | 9:16, 1536×2752 | Flow | code layers | `raw/a7-climb-single.jpg` → panel `raw/a7-climb-single-tall.jpg` 1028×1536 (backup) |
| **A8** | Trail day: a suspension bridge with prayer-flag lines over a river gorge in rhododendron forest, morning light (no people) | Trip photo D1–D3 + thumb | 16:9, 2752×1536 | Flow | A2 crop | `raw/a8-bridge.jpg` ✅ near-flag pseudo-script repainted as plain cloth in code (2026-10-12) |
| **A9** | High trail: the Khumbu glacier and moraine near Base Camp, a few empty tents far away, blue cold light | Trip photo D7–D9 + thumb | 16:9, 2752×1536 | Flow | A1 crop, desaturated | `raw/a9-glacier.jpg` ✅ |
| **A10** | Dusk from Kala Patthar: Everest's last light, purple-rose sky, deep blue ridges | Trip photo D10–D12 + thumb · **Departures background** | 16:9, 2752×1536 | Flow | code dusk scene | `raw/a10-dusk.jpg` ✅ |
| **A11** | When to go base: one valley view with a snow peak behind and a meadow + a small tea house in front, clear autumn day | Season "clear autumn" | 1:1, 2048×2048 | Flow | A1 crop | `raw/a11-season-autumn.jpg` ✅ (2032² aligned set; the 16:9 run is rejected) |
| **A11b–d** | The same view as A11, pixel-aligned: **b** winter (snow everywhere), **c** spring (rhododendron bloom, pink and red on the slopes), **d** monsoon (deep green, wet rocks, low cloud in the valley) | Seasons crossfade (the weather particles stay code) | 1:1, 2048×2048, **Flow edits attaching A11** | Flow (edit) | A5 / A4 / A2 crops in the round view | `raw/a11b-season-winter.jpg` · `a11c-season-spring.jpg` · `a11d-season-monsoon.jpg` ✅ aligned to A11, 2032² |
| **A12** | Namche stone house at night: warm windows, stone walls, snow peak under stars behind | Stays card 1 (3 layers) | 1:1, 2048×2048 | Flow | code scene | `raw/a12-stay-stone.jpg` ✅ (door plaque painted out) |
| **A13** | Gokyo lakeside camp at night: 3 glowing heated dome tents by a turquoise lake, peaks under stars | Stays card 2 | 1:1, 2048×2048 | Flow | code scene | `raw/a13-stay-tents.jpg` ✅ person-shaped shadows painted out, tent glow rebuilt (2026-10-12); cut-out redone |
| **A14** | Hemis monastery guesthouse by day: white walls, maroon window frames, dry brown Ladakh hills, blue sky | Stays card 3 | 1:1, 2048×2048 | Flow | code scene | `raw/a14-stay-ladakh.jpg` ✅ |
| **A15** | Tengboche tea house in the morning: a small lodge on a green ridge, Ama Dablam behind | Stays card 4 | 1:1, 2048×2048 | Flow | code scene | `raw/a15-stay-teahouse.jpg` ✅ |
|  | **Stay depth layers:** for A12–A15, the foreground building/tents → `npm run cutout` (BiRefNet, lesson 33) = front layer; the full photo = back layer; a code haze layer sits between them (3 layers, as in the mockup) | Stays | transparent PNG → WebP | code | single photo + code haze parallax | `raw/stays-cut/a12–a15.png` ✅ |
| **Plane** | Paper plane folded from a trail map (3 faces, contour texture, red dotted route) | Loader · traveller · F8 copies · **cover object** (exported PNG) | inline SVG | **code** | — | code |
| **Map** | Trail map with contour lines and a dotted route | Loader | inline SVG pattern | **code** | — | code |
| **Clouds** | Cloud banks for the hero swap and the seams | Hero · seams | CSS radial gradients (static blur) | **code** | — | code |
| **Weather** | Snow · petals · rain · dust particles | When to go | canvas | **code** | — | code |

Totals: **20 Flow stills** (A1–A15, A7b, A11b–d) and **up to 3 Veo films** (V1–V3).

**V1 test (the user's rule):** V1 is generated first. Claude checks it on a contact sheet (warping, melting ridges, sudden zoom, cross-dissolve, lesson 114). **If it warps or zooms badly, V2 and V3 are skipped and all three places use their still (A1–A3) + code push-in + drifting cloud layers**, and V1 is not used either. If credits run short later, cut in this order: A11b–d (season fallbacks), then A8–A10 (crops of A1/A2).

**Asset check · Batch 1–2 stills (2026-10-11):**
- **Sizes:** all 15 came in at 2K, none at 1K. The 16:9 stills are 2752×1536 and A11–A15 are 2048×2048. **A7a came in 16:9 (2752×1536), not the 9:16 the plan asks for.**
- **✦ mark:** all 15 had one, at the same spot (2639,1423 on 16:9 · 1928,1928 on 1:1). Painted out with a pixel clone and checked at 100% plus a high-pass. A1's clean copy is `raw/a1-everest-clean.jpg`, the Veo start frame. The originals are kept outside the repo in `day18/raw-orig/`. The file name of A7a had a leading space; it's fixed.
- **Zoom check:**
  - A8: the prayer flags carry printed pseudo-script lines and a small figure. ❌
  - A12: a tiny white plaque above the door, now painted out. ✅
  - A13: no logos on the tents, but person-shaped shadows show inside the middle and right tents. ❌
  - A14 and A15: no people, no signs. ✅
- **Cut-outs:** BiRefNet, in `raw/stays-cut/`.
  - A12: the house, plus a neighbour's roof corner at the right; trim it in the build.
  - A13: the 3 tents with bits of guy-line.
  - A14: the house.
  - A15: the hut; its left edge is cut by the frame.

**Asset check · Batch 3 + Veo (2026-10-11):**
- **Sizes:**
  - All stills are 2K; none came in at 1K. The season edits are 2048².
  - **A7a, A7b and A7 are not 9:16 files.** Each came as a 2752×1536 (16:9) canvas holding a portrait picture of about 1028×1536 in the middle (x 862–1890), with grey padding or outpainted fill beside it.
  - Usable climb pixels are therefore only 1028 wide, which is about 1.4× upscaling at 1440 wide.
  - The films are 1920×1080, 24 fps, 8.0 s, 192 frames.
- **✦ mark:**
  - A11c and A11d: cleaned with a pixel clone and checked at 100%.
  - A11b: no mark (high-pass checked).
  - A7b and A7: the mark sits in the padding, outside the picture, so the crop removes it.
  - None of the Veo films carries a burned-in ✦ (their start stills were cleaned).
- **Seasons:**
  - Feature-match offsets against A11 (SIFT + RANSAC):
    - A11b winter: scale 1.0005 · shift −0.5, −0.7 px
    - A11c spring: 0.9999 · +0.1, +0.3 px
    - A11d monsoon: 1.0001 · −1.3, +0.7 px (only 21 inliers, because of the clouds)
  - All four were warped onto A11 and cropped to the same 2032² (8 px off each edge); the residual is ≤ 0.7 px, the measurement noise.
  - The house and trail edges match. The monsoon peak was redrawn under the clouds, so its outline differs; the clouds cover that in the crossfade.
- **Climb stitch:**
  - A7b's top 300 px repeat A7a's rows 959–1260, at the same scale (112 matched points).
  - Stitched at that offset, with a smoothstep seam over A7a's rows 1040–1200 (the glacier band). A7a's own moraine and pond below the seam are dropped.
  - Result: `raw/a7-climb-stitched.jpg`, 1028×2495. The seam can't be seen at 100%.
- **Veo:**
  - **V1 passed the test** (steady, no warping, no zoom). There's a one-frame hitch at 5.29 s, a 2× step, which neighbour-frame blending hides.
  - **V2:** cropped to `crop=1688:950:116:130` and scaled to 1920×1080 (1.137×). All 192 frames scanned with a dark-blob detector: 154 flagged before the crop, **0 after**. The crop also removes the Veo mark.
  - **V3 also has propeller blur**: a translucent blob at the bottom-right edge (x ≥ 1790, y 850–970) from about 2.0 to 4.8 s. It was cropped to `crop=1776:999:0:40` and scaled to 1920×1080 (1.08×), saved as `raw/v3-ladakh-crop.mp4`. The crop also removes the Veo mark, and the bottom-right corner is clean at 2.0–5.0 s.
- **V3** tilts up (the river leaves the bottom and the sky grows to about a third of the frame). It runs fast at 0.6–2.8 s and 3.0–6.0 s (steps up to 13× the calm ones), with a calm stretch at 2.8–3.0 s and after 6.5 s.
  - No film has a dissolve or jump in its last second, so nothing was trimmed.

**Video plan (measured):**
- **V1:** 0–8 s, even, 16 fps.
- **V2 (cropped):** 0–8 s, even, 16 fps.
- **V3 (cropped):** 0–6.5 s; 6.5–8 s is nearly still and was dropped to fit the budget. `segs` 0–0.6 @8 · 0.6–2.8 @14 · 2.8–3.0 @8 · 3.0–6.0 @14 · 6.0–6.5 @8.
  - The first run, at 28 fps in the fast stretches, came out at 24.3 MB, too big.
  - In Round 2, give 0.6–2.8 and 3.0–6.0 more scroll through FilmPin `segments`, so the tilt feels even at any scroll speed.
- **Watermark:** V1 uses the kit's `delogo` (mark at x 1865–1896, y 1044–1055). V2 and V3 get `"delogo": ""` because they are pre-cropped (a per-clip override added to `scripts/make_frames.py`).
- **Frames:** desk 1600 wide, ≤ 12 MB each. Results:
  - `cairnline-v1`: 129 frames, q44, 11.1 MB
  - `cairnline-v2`: 129 frames, q68, 11.0 MB
  - `cairnline-v3`: 85 frames, q40, 11.7 MB
  - Each WebP frame is a standalone image, so seeking is smooth both ways. The keyframe rule only applies to `<video>` files.
  - All three sets are preloaded during the loader (hero, `eager` + `blockLoader`).

Frames: V1–V3 through the `video-frames` skill (`site/frames.json` + `npm run film-frames`), by video time, the watermark painted out, ≤ 12 MB each. Scrub videos get every frame as a keyframe (lesson 102). Hero films are preloaded during the loader (lesson 3).

## Prompts (as run)

Recorded word for word as pasted by the user. Date for all: **2026-10-11**.
- **Stills:** Nano Banana Pro, 2K. Batches 1–2 ran at x4, and so did Batch 3.
- **Films:** Veo, 8 s, 16:9, start frame only (no end frame).

### A1 · 16:9 · no attachment · → `a1-everest-clean.jpg`
```
Aerial photograph flying high over the Everest massif at sunrise. Snow-covered ridges and glaciers fill the bottom third of the frame; Everest and Lhotse rise ahead in the centre-right distance with a soft pink alpenglow on their snow faces. The top quarter of the frame is a clean, clear pale-blue dawn sky with nothing in it. Cool blue shadows in the valleys, a light haze far away, natural colours, crisp sharp detail, wide-angle, photorealistic. No people, no aircraft, no buildings, no text, no logos.
```

### A2 · 16:9 · no attachment · → `a2-annapurna-clean.jpg`
```
Aerial photograph flying over the Annapurna mountain range in warm golden morning light. Green terraced foothills and a winding river valley fill the bottom third of the frame; the big snow peaks of the range stand ahead across the middle; the top quarter is a clean, clear blue sky. Natural colours, crisp sharp detail, a light haze in the far distance, wide-angle, photorealistic. No people, no aircraft, no buildings in the foreground, no text, no logos.
```

### A3 · 16:9 · no attachment · → `a3-ladakh-clean.jpg`
```
Aerial photograph flying over the high desert mountains of Ladakh on a clear morning. Dry, banded brown and ochre mountain ridges with a few snow-capped tops, a turquoise river winding through a deep valley in the bottom third, and a deep blue clean sky in the top quarter. Strong clear sunlight, natural colours, crisp sharp detail, wide-angle, photorealistic. No people, no aircraft, no roads, no buildings, no text, no logos.
```

### A4 · 16:9 · no attachment · → `a4-valley-flowers.jpg`
```
A wide alpine meadow high in the Himalaya in summer, covered in wildflowers in pink, purple, yellow and white, a clear stream winding through the middle, green slopes on both sides and snow peaks behind under a soft blue sky with a few white clouds. Soft morning light, natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no animals, no tents, no buildings, no text, no logos.
```

### A5 · 16:9 · no attachment (missed in the first run, ran separately) · → `a5-kedarkantha.jpg`
```
A snowy Himalayan ridge in winter: a forest of tall pine trees heavy with fresh snow on the slopes, a clean snowy summit ridge in the centre, distant snow peaks behind, a clear pale-blue sky. Soft cool blue morning light, sparkling snow, natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no footprints, no tents, no buildings, no text, no logos.
```

### A6 · 16:9 · no attachment · → `a6-goechala.jpg`
```
Sunrise view of Kanchenjunga from a high Himalayan valley: the huge snow massif glows pink and gold in the upper middle of the frame, layered dark blue ridges fill the lower part, and the bottom third of the frame is calm, dark and simple with no bright details. Clear sky shading from soft peach to blue. Natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no tents, no buildings, no text, no logos.
```

### A7a · 9:16 · no attachment · → `a7a-climb-top.jpg` (delivered as a portrait inside a 16:9 canvas)
```
Tall vertical landscape photograph looking up at the highest part of the Everest region from the Khumbu glacier. At the bottom edge: grey glacier moraine, rocks and ice. In the middle: the icefall and the huge snow faces of the summit massif. At the top: a deep night-blue sky fading from dusk, with the first faint stars. Cold blue light on the snow with a last soft pink glow on the highest peak. Natural colours, crisp sharp detail, photorealistic. No people, no tents, no buildings, no text, no logos.
```

### A8 · 16:9 · no attachment · → `a8-bridge.jpg` (result: near flags carry pseudo-script; open)
```
A long steel suspension bridge high over a deep river gorge in a Himalayan forest, strings of plain coloured prayer flags along its cables, red rhododendron trees in bloom on the steep green slopes, a fast turquoise river far below, snow peaks just visible in the distance. Soft morning light, natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no animals, no writing on the flags, no text, no logos.
```

### A9 · 16:9 · no attachment · → `a9-glacier.jpg`
```
The Khumbu glacier near Everest Base Camp: a wide river of grey rock-covered ice and white ice pinnacles winding between huge snow mountains, a few small empty yellow tents far away on the moraine, cold clear blue light, a pale blue sky. Natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no flags, no text, no logos.
```

### A10 · 16:9 · no attachment · → `a10-dusk.jpg`
```
Dusk view of Everest from a high rocky viewpoint: the summit catches the last orange-pink light, the sky above shades from soft rose to deep purple-blue, the ridges below are deep blue and calm, a few stars appearing at the top. Natural colours, crisp sharp detail, wide-angle landscape photograph, photorealistic. No people, no prayer flags, no buildings, no text, no logos.
```

### A11 · 1:1 · no attachment (also ran once at 16:9 by mistake; that run is rejected) · → `a11-season-autumn.jpg`
```
A Himalayan valley on a clear autumn day: in front, a small stone tea house with a blue tin roof standing on a golden-brown meadow; a stone trail leading past it; behind, a tall snow peak under a clean deep-blue sky. Bright clear light, natural colours, crisp sharp detail, landscape photograph, photorealistic. No people, no animals, no text, no logos, no writing on the house.
```

### A12 · 1:1 · no attachment · → `a12-stay-stone.jpg` (tiny door plaque painted out)
```
A two-storey stone mountain lodge at night in a Himalayan village, standing clearly in the foreground with clean edges, its windows glowing warm orange, stone walls and a dark wooden roof, a few stone steps in front. Behind it, a big snow peak lit softly by moonlight under a sky full of stars. Natural colours, crisp sharp detail, photorealistic. No people, no animals, no text, no signs, no logos.
```

### A13 · 1:1 · no attachment · → `a13-stay-tents.jpg` (result: person-shaped shadows in two tents; open)
```
Three dome tents glowing warm from inside at night, standing clearly in the foreground with clean edges on the stony shore of a turquoise mountain lake, snow peaks behind under a sky full of stars, the lake reflecting the peaks. Natural colours, crisp sharp detail, photorealistic. No people, no shadows of people, no text, no logos on the tents.
```

### A14 · 1:1 · no attachment · → `a14-stay-ladakh.jpg`
```
A small traditional Ladakhi guesthouse by day, standing clearly in the foreground with clean edges: thick white-washed walls, dark maroon wooden window frames, a flat roof with a stack of wood on top. Behind it, dry brown banded mountains under a deep blue sky with a few white clouds. Strong clear sunlight, natural colours, crisp sharp detail, photorealistic. No people, no animals, no prayer flags, no text, no signs, no logos.
```

### A15 · 1:1 · no attachment · → `a15-stay-teahouse.jpg`
```
A small wooden and stone tea house lodge on a green ridge in the morning, standing clearly in the foreground with clean edges, a blue roof and a little front porch with a bench. Behind it, a sharp tall snow peak shaped like a pointed tooth, under a clear blue sky. Soft morning light, natural colours, crisp sharp detail, photorealistic. No people, no animals, no text, no signs, no logos.
```

### A7b · 9:16 · attached a7a-climb-top only · → `a7b-climb-bottom.jpg` (one take continued below a7a); `a7-climb-single.jpg` (another take drew the whole climb in one image, kept as backup)
```
Use the attached image as the top part of one tall mountain view. Create the part of the same mountain directly below it, as if the camera looks further down the same valley. The top edge of the new image must continue the bottom edge of the attached image seamlessly: same moraine, same rocks, same colours. Going down the frame: rocky moraine, then small stone-walled fields of a high village, then a green ridge with a few small stone houses, then pine and rhododendron forest, and at the very bottom a green river valley in warm morning light. A thin dirt trail winds up through the whole view. Natural colours, crisp sharp detail, photorealistic. No people, no animals, no text, no logos.
```

### A11b · 1:1 · attached a11-season-autumn only · → `a11b-season-winter.jpg`
```
Edit the attached image only. Keep every pixel of the layout identical: same tea house, same trail, same peak, same framing and camera angle. Change only the season to deep winter: fresh white snow covers the meadow, the trail, the tea house roof and the slopes; the sky stays clear blue. Do not move, resize or redraw anything. No people, no text.
```

### A11c · 1:1 · attached a11-season-autumn only · → `a11c-season-spring.jpg`
```
Edit the attached image only. Keep every pixel of the layout identical: same tea house, same trail, same peak, same framing and camera angle. Change only the season to spring: the meadow turns fresh green and the slopes are covered in blooming red and pink rhododendron bushes; snow remains only on the high peak. Do not move, resize or redraw anything. No people, no text.
```

### A11d · 1:1 · attached a11-season-autumn only · → `a11d-season-monsoon.jpg`
```
Edit the attached image only. Keep every pixel of the layout identical: same tea house, same trail, same peak, same framing and camera angle. Change only the season to monsoon: everything is deep wet green, the stones are dark and wet, the sky is grey and soft white clouds hang low in the valley, partly hiding the peak. Do not move, resize or redraw anything. No people, no text.
```

### V1 · Veo · 16:9 · 8 s · start frame a1-everest-clean only · → `v1-everest.mp4` (passed the V1 test)
```
A slow, steady forward flight straight ahead over the snowy ridges, like a quiet drone moving at the same height. The ridges below pass smoothly under the camera; the big mountains ahead stay in the same place and come very slightly closer. No turns, no tilting, no zoom, no cuts, no speed changes. The light and colours stay exactly the same the whole time. Nothing new appears. No birds, no aircraft, no people, no text.
```

### V2 · Veo · 16:9 · 8 s · start frame a2-annapurna only (same prompt as V1; the result showed propeller blur at the top, which gets cropped) · → `v2-annapurna.mp4` → `v2-annapurna-crop.mp4`
```
A slow, steady forward flight straight ahead over the snowy ridges, like a quiet drone moving at the same height. The ridges below pass smoothly under the camera; the big mountains ahead stay in the same place and come very slightly closer. No turns, no tilting, no zoom, no cuts, no speed changes. The light and colours stay exactly the same the whole time. Nothing new appears. No birds, no aircraft, no people, no text.
```

### V3 · Veo · 16:9 · 8 s · start frame a3-ladakh only · → `v3-ladakh.mp4` → `v3-ladakh-crop.mp4` (result: tilts up with two fast stretches; propeller blur bottom-right at 2.0–4.8 s, cropped)
```
A slow, steady forward flight straight ahead over the brown mountain ridges, like a quiet drone moving at the same height. The ridges below pass smoothly under the camera; the big mountains ahead stay in the same place and come very slightly closer. No turns, no tilting, no zoom, no cuts, no speed changes. The light and colours stay exactly the same the whole time. Nothing new appears. No birds, no aircraft, no people, no text.
```

