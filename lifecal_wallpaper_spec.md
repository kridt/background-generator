# Life-Grid Wallpaper Image API (Next.js / Vercel) — Claude Code Build Spec

Build an endpoint that behaves like:

`/days?height=2778&width=1284` → returns **image/png** (a wallpaper) that updates by date.

The wallpaper is a **year progress dot grid** (365/366 dots). Dots represent each day of the current year:
- Past days: light/white dots
- Future days: dim/transparent dots
- Today: highlighted dot (e.g. orange)
- Birthdays (friends/family): special colors on the corresponding day (optionally visible even if in the future)

The design should resemble the sample lockscreen “year calendar” style (dense dot grid centered vertically).

---

## 0) Deliverable Checklist

Claude must produce a repo that includes:

- ✅ Next.js App Router project (TypeScript)
- ✅ Image endpoint at `GET /days` returning **PNG**
- ✅ Query parameters:
  - `width` (int)
  - `height` (int)
  - optional `date=YYYY-MM-DD` for testing
  - optional `tz` (IANA timezone string) OR default UTC (choose one and implement)
- ✅ Birthdays support with at least 2 categories:
  - family (purple)
  - friends (blue)
- ✅ Configurable dataset source:
  - Start with local JSON file
  - Provide a clear interface to later swap to Google Sheets / DB
- ✅ Caching strategy (Edge friendly)
- ✅ Local dev instructions + deployment instructions (Vercel)
- ✅ Example URLs

Keep output minimalistic and lockscreen-friendly (dark background, no clutter).

---

## 1) Tech Choices (Do Exactly This)

- Framework: **Next.js 14+** (App Router)
- Runtime: **Edge** (fast image generation)
- Image generation: `next/og` **ImageResponse**
- Rendering strategy:
  - Generate SVG string for dot grid
  - Render SVG into PNG via `ImageResponse` by embedding it in an `<img>` data URI
- TypeScript: Yes

No external image libraries are required.

---

## 2) Endpoint Contract

### Route
`GET /days`

### Query parameters
- `width`: integer (default: 1284, clamp 600..3000)
- `height`: integer (default: 2778, clamp 900..4000)
- `date`: optional `YYYY-MM-DD` (for testing). If not provided, use “today”.
- `tz`: optional timezone (recommended). If not implemented, use UTC consistently.

### Response
- `Content-Type: image/png`
- Cache headers: `public, s-maxage=3600, stale-while-revalidate=86400` (or similar)

### Examples
- `/days?width=1284&height=2778`
- `/days?width=1170&height=2532`
- `/days?width=1290&height=2796&date=2026-02-22`

---

## 3) Visual Design Spec

### Background
- Dark gradient or solid dark:
  - Top: `#0B0F14`
  - Bottom: `#0A0D11`

### Dot grid
- One dot per day of year
- Layout: row-major, left-to-right, top-to-bottom
- Dense grid similar to sample:
  - Suggested columns: `19`
  - Rows: `ceil(totalDays / cols)`
- Grid area should be centered with generous padding:
  - `topPad = 18% of height`
  - `bottomPad = 18% of height`
  - `sidePad = 12% of width`

### Dot styles
Colors (exact):
- Past day: `#E6E8EB`
- Future day: `rgba(230,232,235,0.18)`
- Today: `#FF6A00`
- Friend birthday: `#2F80ED`
- Family birthday: `#9B51E0`

Rules:
- Today overrides past/future colors.
- Birthdays override base color (even if in future) — implement this behavior first.
- Dot radius computed from spacing:
  - `r = max(5, round(min(cellX, cellY) * 0.18))`

### Optional footer (small)
A single line centered near bottom (like demo):
- Example: `123d left · 66%`
- Today number (days left) can be orange for emphasis.

Keep text small and muted so the grid remains the hero.

---

## 4) Date + Year Math Requirements

Implement correctly for leap years.

Functions needed:
- `daysInYear(year)` returns 365 or 366
- `dayOfYear(date)` returns 1..365/366
- Derive `todayIndex = dayOfYear - 1`

For dot i (0-based) => date is:
`Date.UTC(year, 0, 1 + i)`

Use consistent timezone logic:
- If you implement `tz`, compute “today” based on that timezone.
- If not, use UTC everywhere so the image is stable.

---

## 5) Birthdays Data Model

Create a local file:

`data/birthdays.json`

Format:
```json
{
  "birthdays": [
    { "name": "Mom", "month": 8, "day": 15, "type": "family" },
    { "name": "Alex", "month": 2, "day": 22, "type": "friend" }
  ]
}
```

Rules:
- month is 1..12
- day is 1..31
- type in {"family","friend"}

Birthday matching:
- Match by month/day only (year irrelevant)
- If multiple birthdays on same date:
  - family wins over friend for dot color (priority rule)
- Later you may want multi-layer dots or ring effects, but **do not implement now**.

---

## 6) File/Folder Structure

Create:
```
lifecal-wallpaper/
  app/
    days/
      route.tsx
    layout.tsx
    page.tsx
  data/
    birthdays.json
  lib/
    date.ts
    birthdays.ts
    render.ts
  README.md
  package.json
  tsconfig.json
  next.config.js (if needed)
```

What each file does:
- `app/days/route.tsx`: HTTP handler + ImageResponse
- `lib/date.ts`: all date/year math + parsing
- `lib/birthdays.ts`: loading + matching + color selection
- `lib/render.ts`: SVG generation function
- `data/birthdays.json`: initial dataset
- `README.md`: how to run + deploy + example endpoints

---

## 7) Implementation Details (Code Requirements)

### 7.1 `lib/date.ts`
Must include:
- `clamp(n,min,max)`
- `parseDateParam(dateStr)` -> Date in UTC
- `daysInYearUTC(year)`
- `dayOfYearUTC(date)`

Keep these pure and testable.

### 7.2 `lib/birthdays.ts`
Must include:
- `loadBirthdays()` reads JSON
- `isBirthday(dateUTC, entry)` month/day match
- `birthdayColor(dateUTC)` returns friend/family color or null
- Priority: family > friend

### 7.3 `lib/render.ts`
Must include:
- `renderYearGridSvg({ width, height, dateUTC, birthdays })` returns SVG string
- Implement layout math from spec
- For each day:
  - compute dot position
  - compute fill color based on past/future/today + birthday override
- Include footer text

SVG output must be valid and self-contained.

### 7.4 `app/days/route.tsx`
Must:
- Parse query params and clamp
- Determine target date (today or `date=` override)
- Load birthdays from local JSON (synchronously is fine for small file)
- Generate SVG
- Return `new ImageResponse(...)` producing PNG

Set headers:
- `Content-Type: image/png`
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

Set:
```ts
export const runtime = "edge";
```

---

## 8) Exact Reference Implementation (Pasteable)

Claude should use this as the baseline and split into files per structure.

### `app/days/route.tsx`
```ts
import { ImageResponse } from "next/og";
import { clamp, parseDateOrTodayUTC } from "@/lib/date";
import { loadBirthdays } from "@/lib/birthdays";
import { renderYearGridSvg } from "@/lib/render";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const width = clamp(Number(searchParams.get("width") ?? 1284), 600, 3000);
  const height = clamp(Number(searchParams.get("height") ?? 2778), 900, 4000);

  const dateParam = searchParams.get("date"); // YYYY-MM-DD optional
  const dateUTC = parseDateOrTodayUTC(dateParam);

  const birthdays = loadBirthdays();

  const svg = renderYearGridSvg({ width, height, dateUTC, birthdays });

  return new ImageResponse(
    (
      <div style={{ width, height, display: "flex" }}>
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
          width={width}
          height={height}
          style={{ width, height }}
        />
      </div>
    ),
    {
      width,
      height,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
```

### `lib/date.ts`
```ts
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function parseDateOrTodayUTC(dateStr: string | null): Date {
  if (!dateStr) return new Date();
  // Expect YYYY-MM-DD
  const y = Number(dateStr.slice(0, 4));
  const m = Number(dateStr.slice(5, 7));
  const d = Number(dateStr.slice(8, 10));
  if (!y || !m || !d) return new Date();
  return new Date(Date.UTC(y, m - 1, d));
}

export function daysInYearUTC(year: number) {
  const a = Date.UTC(year, 0, 1);
  const b = Date.UTC(year + 1, 0, 1);
  return Math.round((b - a) / 86400000);
}

export function dayOfYearUTC(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const cur = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((cur - start) / 86400000) + 1;
}
```

### `lib/birthdays.ts`
```ts
import data from "@/data/birthdays.json";

export type BirthdayType = "family" | "friend";

export type Birthday = {
  name: string;
  month: number; // 1..12
  day: number;   // 1..31
  type: BirthdayType;
};

export function loadBirthdays(): Birthday[] {
  return (data as any).birthdays as Birthday[];
}

export function isBirthday(dateUTC: Date, b: Birthday) {
  return dateUTC.getUTCMonth() + 1 === b.month && dateUTC.getUTCDate() === b.day;
}

export function birthdayTypeForDate(dateUTC: Date, birthdays: Birthday[]): BirthdayType | null {
  const hasFamily = birthdays.some((b) => b.type === "family" && isBirthday(dateUTC, b));
  if (hasFamily) return "family";
  const hasFriend = birthdays.some((b) => b.type === "friend" && isBirthday(dateUTC, b));
  if (hasFriend) return "friend";
  return null;
}
```

### `lib/render.ts`
```ts
import { dayOfYearUTC, daysInYearUTC } from "@/lib/date";
import { Birthday, birthdayTypeForDate } from "@/lib/birthdays";

const COLORS = {
  bgTop: "#0B0F14",
  bgBottom: "#0A0D11",
  past: "#E6E8EB",
  future: "rgba(230,232,235,0.18)",
  today: "#FF6A00",
  friend: "#2F80ED",
  family: "#9B51E0",
  textMuted: "rgba(230,232,235,0.6)",
};

export function renderYearGridSvg(opts: {
  width: number;
  height: number;
  dateUTC: Date;
  birthdays: Birthday[];
}) {
  const { width, height, dateUTC, birthdays } = opts;

  const year = dateUTC.getUTCFullYear();
  const totalDays = daysInYearUTC(year);
  const todayIndex = dayOfYearUTC(dateUTC) - 1;

  const cols = 19;
  const rows = Math.ceil(totalDays / cols);

  const topPad = Math.round(height * 0.18);
  const bottomPad = Math.round(height * 0.18);
  const sidePad = Math.round(width * 0.12);

  const gridTop = topPad;
  const gridBottom = height - bottomPad;
  const gridHeight = gridBottom - gridTop;

  const cellX = (width - sidePad * 2) / (cols - 1);
  const cellY = gridHeight / (rows - 1);
  const r = Math.max(5, Math.round(Math.min(cellX, cellY) * 0.18));

  const daysLeft = totalDays - (todayIndex + 1);
  const pct = Math.round(((todayIndex + 1) / totalDays) * 100);

  let circles = "";
  for (let i = 0; i < totalDays; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cx = sidePad + col * cellX;
    const cy = gridTop + row * cellY;

    const dotDate = new Date(Date.UTC(year, 0, 1 + i));
    const bType = birthdayTypeForDate(dotDate, birthdays);

    let fill = i < todayIndex ? COLORS.past : COLORS.future;
    if (i === todayIndex) fill = COLORS.today;

    // Birthdays override base
    if (bType === "family") fill = COLORS.family;
    else if (bType === "friend") fill = COLORS.friend;

    circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
  }

  const footerY = height - Math.round(height * 0.12);
  const fontSize = Math.round(height * 0.022);

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.bgTop}"/>
      <stop offset="100%" stop-color="${COLORS.bgBottom}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${circles}
  <text x="${width / 2}" y="${footerY}" text-anchor="middle"
    font-family="system-ui, -apple-system, Segoe UI, Roboto"
    font-size="${fontSize}" fill="${COLORS.textMuted}">
    <tspan fill="${COLORS.today}">${daysLeft}d</tspan>
    <tspan> left · </tspan>
    <tspan>${pct}%</tspan>
  </text>
</svg>
`.trim();
}
```

### `data/birthdays.json`
```json
{
  "birthdays": [
    { "name": "Mom", "month": 8, "day": 15, "type": "family" },
    { "name": "Alex", "month": 2, "day": 22, "type": "friend" }
  ]
}
```

---

## 9) README Requirements

`README.md` must include:

### Run locally
```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000/days?width=1284&height=2778`
- `http://localhost:3000/days?width=1284&height=2778&date=2026-02-22`

### Deploy to Vercel
- Push to GitHub
- Import into Vercel
- Test:
  - `https://YOURDOMAIN.vercel.app/days?width=1284&height=2778`

### Update birthdays
Edit `data/birthdays.json` and redeploy.

---

## 10) Future Extensions (Don’t Implement Yet)

Only document these as “next steps”:

- Pull birthdays from Google Sheets (editable without redeploy)
- Add categories: “milestones”, “travel”, “deadlines”
- Add “today ring pulse” animation (but note: PNG output cannot animate; would require video/live wallpaper)
- Add timezone support (`tz`) reliably
- Add caching per (date,width,height) key with KV/Edge cache

---

## 11) Claude Code Instruction (Copy/Paste Prompt)

Use this prompt in Claude Code:

```text
You are a senior TypeScript/Next.js engineer. Build a Next.js App Router project that implements a Vercel-style image endpoint like /days?width=1284&height=2778 returning image/png. Use Edge runtime and next/og ImageResponse. Generate an SVG dot-grid for each day of the current year (365/366). Past dots are #E6E8EB, future dots are rgba(230,232,235,0.18), today dot is #FF6A00. Load birthdays from data/birthdays.json and override dot color: friends #2F80ED, family #9B51E0 (family priority). Implement optional date=YYYY-MM-DD for testing. Organize code into lib/date.ts, lib/birthdays.ts, lib/render.ts and app/days/route.tsx. Provide a complete README with local run + Vercel deployment + example URLs. Follow the spec in this markdown file exactly.
```

---

## 12) Acceptance Tests

When I request:
- `/days?width=1284&height=2778`
  - I get a PNG
  - Background is dark
  - Dot grid is centered
  - Past dots are bright
  - Future dots are dim
  - Today dot is orange
- `/days?width=1284&height=2778&date=2026-02-22`
  - The dot for Feb 22 is blue (friend)
- Leap year:
  - In a leap year, total dots = 366 and the layout still fits

If any of these fail, fix it.

---
