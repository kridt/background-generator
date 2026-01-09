// Fetch Roboto font from Google Fonts at runtime
// This keeps the edge function under Vercel's 1MB limit

let fontCache: ArrayBuffer | null = null;

export async function getFontBuffer(): Promise<ArrayBuffer> {
  if (fontCache) {
    return fontCache;
  }

  // Fetch from Google Fonts CDN
  const response = await fetch(
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
    { cache: 'force-cache' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch font');
  }

  fontCache = await response.arrayBuffer();
  return fontCache;
}
