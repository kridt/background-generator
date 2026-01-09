import sharp from "sharp";
import { clamp, parseDateOrTodayCET } from "@/lib/date";
import { loadBirthdays } from "@/lib/birthdays";
import { renderYearGridSvg } from "@/lib/render";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Parse and clamp dimensions
  const width = clamp(
    parseInt(searchParams.get("width") ?? "1284", 10) || 1284,
    600,
    3000
  );
  const height = clamp(
    parseInt(searchParams.get("height") ?? "2778", 10) || 2778,
    900,
    4000
  );

  // Parse date (optional, for testing)
  const dateParam = searchParams.get("date");
  const dateUTC = parseDateOrTodayCET(dateParam);

  // Load birthdays
  const birthdays = await loadBirthdays();

  // Generate SVG
  const svg = renderYearGridSvg({ width, height, dateUTC, birthdays });

  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toBuffer();

  // Convert Buffer to Uint8Array for Response compatibility
  const uint8Array = new Uint8Array(pngBuffer);

  // Return as PNG image
  return new Response(uint8Array, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
