# Life Calendar Wallpaper

A Next.js API that generates beautiful year-progress wallpapers as PNG images. Each dot represents a day of the year - past days are bright, future days are dim, and today is highlighted in orange.

## Features

- **Year progress visualization**: 365/366 dots arranged in a clean grid
- **Birthday highlighting**: Special colors for birthdays (self, family, friends)
- **CET timezone**: Automatically handles Central European Time
- **Dynamic sizing**: Supports various phone screen sizes
- **Edge runtime**: Fast image generation on Vercel Edge

## Quick Start

### Run Locally

```bash
npm install
npm run dev
```

Open in browser:
- http://localhost:3000/days?width=1284&height=2778
- http://localhost:3000/days?width=1284&height=2778&date=2026-02-22

### Deploy to Vercel

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Deploy

Test your deployment:
```
https://YOUR-APP.vercel.app/days?width=1284&height=2778
```

## API Endpoint

### `GET /days`

Returns a PNG image of the year progress grid.

#### Query Parameters

| Parameter | Type | Default | Range | Description |
|-----------|------|---------|-------|-------------|
| `width` | int | 1284 | 600-3000 | Image width in pixels |
| `height` | int | 2778 | 900-4000 | Image height in pixels |
| `date` | string | today | YYYY-MM-DD | Override date for testing |

#### Example URLs

```
/days?width=1284&height=2778              # iPhone 14 Pro Max
/days?width=1170&height=2532              # iPhone 14
/days?width=1290&height=2796              # iPhone 15 Pro Max
/days?width=1440&height=3120              # Android (many)
/days?date=2026-02-22                     # Test specific date
```

## Color Legend

| Color | Meaning |
|-------|---------|
| White (#E8EAED) | Past days (lived) |
| Dim (#E8EAED @ 12%) | Future days |
| Orange (#FF6B35) | Today |
| Gold (#FFD700) | Your birthday |
| Purple (#A855F7) | Family birthdays |
| Blue (#3B82F6) | Friend birthdays |

## Configuration

### Adding Birthdays

Edit `data/birthdays.json`:

```json
{
  "birthdays": [
    { "name": "Me", "month": 2, "day": 22, "type": "self", "year": 2003 },
    { "name": "Mom", "month": 8, "day": 15, "type": "family" },
    { "name": "Alex", "month": 3, "day": 10, "type": "friend" }
  ]
}
```

**Fields:**
- `name`: Display name
- `month`: 1-12
- `day`: 1-31
- `type`: "self" | "family" | "friend"
- `year`: Optional birth year

**Priority:** self > family > friend (if multiple on same day)

## Phone Wallpaper Setup

### iOS (Shortcuts)

1. Create a new Shortcut
2. Add "Get Contents of URL" action with your endpoint
3. Add "Set Wallpaper" action
4. Run daily via Automation

### Android

Use apps like "Tasker" or "IFTTT" to fetch and set wallpaper daily.

## Project Structure

```
background-creator/
├── app/
│   ├── days/
│   │   └── route.tsx    # Image endpoint
│   ├── layout.tsx
│   └── page.tsx         # Landing page
├── data/
│   └── birthdays.json   # Birthday data
├── lib/
│   ├── date.ts          # Date utilities
│   ├── birthdays.ts     # Birthday logic
│   └── render.ts        # SVG generation
└── README.md
```

## Future Improvements

- Google Sheets integration for birthdays
- Additional categories (milestones, deadlines)
- Timezone parameter support
- Edge caching with KV store
