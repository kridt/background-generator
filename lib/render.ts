import { dayOfYear, daysInYear, dateFromDayIndex } from "@/lib/date";
import { Birthday, getBirthdayTypeForDate } from "@/lib/birthdays";

/**
 * Motivational quotes with attribution
 */
const QUOTES: { text: string; author: string }[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "When one door of happiness closes, another opens.", author: "Helen Keller" },
  { text: "Twenty years from now you will be more disappointed by the things you didn't do.", author: "Mark Twain" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "Those who dare to fail miserably can achieve greatly.", author: "John F. Kennedy" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Many of life's failures are people who did not realize how close they were to success.", author: "Thomas Edison" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do.", author: "Henry Ford" },
  { text: "In order to write about life first you must live it.", author: "Ernest Hemingway" },
  { text: "The big lesson in life is never be scared of anyone or anything.", author: "Frank Sinatra" },
  { text: "Curiosity about life in all of its aspects is the secret of great creative people.", author: "Leo Burnett" },
  { text: "Life is not a problem to be solved, but a reality to be experienced.", author: "Søren Kierkegaard" },
  { text: "Live in the sunshine, swim the sea, drink the wild air.", author: "Ralph Waldo Emerson" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "The way I see it, if you want the rainbow, you gotta put up with the rain.", author: "Dolly Parton" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "I alone cannot change the world, but I can cast a stone to create many ripples.", author: "Mother Teresa" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "I think, therefore I am.", author: "René Descartes" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Two roads diverged in a wood, and I took the one less traveled by.", author: "Robert Frost" },
  { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "The best and most beautiful things cannot be seen or even touched — they must be felt.", author: "Helen Keller" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate on the present moment.", author: "Buddha" },
  { text: "It's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn" },
  { text: "The only way to have a friend is to be one.", author: "Ralph Waldo Emerson" },
  { text: "Keep your face always toward the sunshine — and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { text: "We must be willing to let go of the life we planned to have the life that is waiting.", author: "Joseph Campbell" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "I've learned that people will forget what you said and did, but never how you made them feel.", author: "Maya Angelou" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
  { text: "Love the life you live. Live the life you love.", author: "Bob Marley" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "May you live all the days of your life.", author: "Jonathan Swift" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "If opportunity doesn't knock, build a door.", author: "Milton Berle" },
  { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn" },
  { text: "Don't cry because it's over, smile because it happened.", author: "Dr. Seuss" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "The greatest wealth is to live content with little.", author: "Plato" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "To be yourself in a world constantly trying to change you is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "What we fear doing most is usually what we most need to do.", author: "Tim Ferriss" },
  { text: "How wonderful it is that nobody need wait to start improving the world.", author: "Anne Frank" },
];

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Get quote of the day based on day of year
 */
function getQuoteOfDay(dayIndex: number): { text: string; author: string } {
  return QUOTES[dayIndex % QUOTES.length];
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Get next upcoming birthday
 */
function getNextBirthday(currentDate: Date, birthdays: Birthday[]): { name: string; daysUntil: number } | null {
  if (birthdays.length === 0) return null;

  const year = currentDate.getUTCFullYear();
  const currentDayOfYear = dayOfYear(currentDate);

  let closestBirthday: { name: string; daysUntil: number } | null = null;

  for (const b of birthdays) {
    // Calculate this year's birthday
    const birthdayThisYear = new Date(Date.UTC(year, b.month - 1, b.day));
    let birthdayDayOfYear = dayOfYear(birthdayThisYear);

    let daysUntil: number;

    if (birthdayDayOfYear >= currentDayOfYear) {
      // Birthday is still coming this year
      daysUntil = birthdayDayOfYear - currentDayOfYear;
    } else {
      // Birthday already passed, calculate days until next year
      const totalDaysThisYear = daysInYear(year);
      const totalDaysNextYear = daysInYear(year + 1);
      const birthdayNextYear = new Date(Date.UTC(year + 1, b.month - 1, b.day));
      const birthdayDayOfYearNext = dayOfYear(birthdayNextYear);
      daysUntil = (totalDaysThisYear - currentDayOfYear) + birthdayDayOfYearNext;
    }

    if (daysUntil === 0) {
      // Today is someone's birthday!
      return { name: b.name, daysUntil: 0 };
    }

    if (!closestBirthday || daysUntil < closestBirthday.daysUntil) {
      closestBirthday = { name: b.name, daysUntil };
    }
  }

  return closestBirthday;
}

/**
 * Get the day index where a month starts
 */
function getMonthStartDayIndex(year: number, month: number): number {
  const date = new Date(Date.UTC(year, month, 1));
  return dayOfYear(date) - 1; // 0-based
}

/**
 * Color palette for the life calendar - refined, premium look
 */
const COLORS = {
  // Background gradient - deeper, richer dark
  bgTop: "#0A0E13",
  bgBottom: "#060809",

  // Dot colors - softer, more elegant
  past: "#D4D7DC",
  future: "rgba(212,215,220,0.10)",
  today: "#E85D3B",

  // Birthday colors - refined blue for friends & family
  self: "#F5C842",
  family: "#5B9CF6",
  friend: "#5B9CF6",

  // Payday - softer green
  payday: "#34C759",

  // Holiday ring - subtle
  holiday: "rgba(212,215,220,0.25)",

  // Text - refined opacity levels
  textMuted: "rgba(212,215,220,0.55)",
  textQuote: "rgba(212,215,220,0.30)",
  textAccent: "#E85D3B",
  textMonth: "rgba(212,215,220,0.35)",
};

/**
 * Malta Public Holidays
 * Returns holiday name if date is a public holiday, null otherwise
 */
function getMaltaHoliday(date: Date): string | null {
  const month = date.getUTCMonth(); // 0-indexed
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Fixed holidays
  const fixedHolidays: { [key: string]: string } = {
    "0-1": "New Year's Day",
    "1-10": "St. Paul's Shipwreck",
    "2-19": "St. Joseph",
    "2-31": "Freedom Day",
    "4-1": "Worker's Day",
    "5-7": "Sette Giugno",
    "5-29": "St. Peter & St. Paul",
    "7-15": "Assumption",
    "8-8": "Victory Day",
    "8-21": "Independence Day",
    "11-8": "Immaculate Conception",
    "11-13": "Republic Day",
    "11-25": "Christmas Day",
  };

  const key = `${month}-${day}`;
  if (fixedHolidays[key]) {
    return fixedHolidays[key];
  }

  // Good Friday (moveable - based on Easter)
  const goodFriday = getGoodFriday(year);
  if (month === goodFriday.month && day === goodFriday.day) {
    return "Good Friday";
  }

  return null;
}

/**
 * Calculate Good Friday for a given year
 * Good Friday is 2 days before Easter Sunday
 */
function getGoodFriday(year: number): { month: number; day: number } {
  // Calculate Easter using Anonymous Gregorian algorithm
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  // Easter Sunday date, now subtract 2 days for Good Friday
  const easterDate = new Date(Date.UTC(year, month, day));
  const goodFridayDate = new Date(easterDate.getTime() - 2 * 86400000);

  return {
    month: goodFridayDate.getUTCMonth(),
    day: goodFridayDate.getUTCDate(),
  };
}

/**
 * Check if a date is a payday
 * Paydays occur every 28 days, starting from Jan 23, 2026
 */
function isPayday(date: Date): boolean {
  // First known payday: January 23, 2026
  const firstPayday = Date.UTC(2026, 0, 23); // Jan 23, 2026
  const currentDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  // Calculate difference in days
  const diffMs = currentDate - firstPayday;
  const diffDays = Math.round(diffMs / 86400000);

  // Check if this is a multiple of 28 days from the first payday
  // Also check backwards for dates before the first payday
  return diffDays % 28 === 0;
}

/**
 * Get next payday from a given date
 */
function getNextPayday(currentDate: Date): { date: Date; daysUntil: number } {
  const firstPayday = Date.UTC(2026, 0, 23);
  const current = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());

  const diffMs = current - firstPayday;
  const diffDays = Math.round(diffMs / 86400000);

  // Find days until next payday
  const daysSinceLastPayday = ((diffDays % 28) + 28) % 28;
  const daysUntilNext = daysSinceLastPayday === 0 ? 0 : 28 - daysSinceLastPayday;

  const nextPaydayMs = current + (daysUntilNext * 86400000);
  const nextPayday = new Date(nextPaydayMs);

  return { date: nextPayday, daysUntil: daysUntilNext };
}

interface RenderOptions {
  width: number;
  height: number;
  dateUTC: Date;
  birthdays: Birthday[];
}

/**
 * Generate the year grid SVG for the wallpaper
 */
export function renderYearGridSvg(opts: RenderOptions): string {
  const { width, height, dateUTC, birthdays } = opts;

  const year = dateUTC.getUTCFullYear();
  const totalDays = daysInYear(year);
  const todayIndex = dayOfYear(dateUTC) - 1; // 0-based

  // Grid layout - 19 columns
  const cols = 19;
  const rows = Math.ceil(totalDays / cols);

  // Padding optimized for iPhone 13 Pro Max lock screen
  // Top: notch ~2%, status bar ~4%, clock ~5-28% → content starts at 28%
  // Bottom: buttons at ~86-94%, home indicator ~95% → content ends at 85%
  const topPad = Math.round(height * 0.275);  // Below iOS clock
  const bottomPad = Math.round(height * 0.19); // Room for footer above iOS buttons
  const sidePadRight = Math.round(width * 0.07);
  const sidePadLeft = Math.round(width * 0.14);

  // Calculate grid dimensions
  const gridTop = topPad;
  const gridBottom = height - bottomPad;
  const gridHeight = gridBottom - gridTop;
  const gridWidth = width - sidePadLeft - sidePadRight;

  // Cell spacing
  const cellX = gridWidth / (cols - 1);
  const cellY = gridHeight / (rows - 1);

  // Dot radius - proportional to cell size
  const r = Math.max(4, Math.round(Math.min(cellX, cellY) * 0.20));

  // Calculate stats
  const daysLeft = totalDays - (todayIndex + 1);
  const daysPassed = todayIndex + 1;
  const pct = Math.round((daysPassed / totalDays) * 100);
  const weekNumber = getWeekNumber(dateUTC);
  const nextBirthday = getNextBirthday(dateUTC, birthdays);

  // Month-based layout: 12 rows (one per month), up to 31 columns
  const monthCols = 31;
  const monthRows = 12;

  // Recalculate cell spacing for month layout
  const monthCellX = gridWidth / (monthCols - 1);
  const monthCellY = gridHeight / (monthRows - 1);
  const monthR = Math.max(8, Math.round(Math.min(monthCellX, monthCellY) * 0.38)); // Larger, visible dots

  // Generate month labels - larger for visibility
  let monthLabels = "";
  const monthLabelFontSize = Math.round(height * 0.014);
  const monthLabelX = sidePadLeft - Math.round(width * 0.02);

  for (let month = 0; month < 12; month++) {
    const labelY = gridTop + month * monthCellY + monthLabelFontSize * 0.35;
    monthLabels += `<text x="${monthLabelX}" y="${labelY}" text-anchor="end"
      font-family="Arial, Helvetica, sans-serif"
      font-size="${monthLabelFontSize}" font-weight="400" letter-spacing="0.5"
      fill="${COLORS.textMonth}">${MONTH_NAMES[month]}</text>`;
  }

  // Generate dots - organized by month
  let circles = "";
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    for (let day = 0; day < daysInMonth; day++) {
      const cx = sidePadLeft + day * monthCellX;
      const cy = gridTop + month * monthCellY;

      // Calculate the day index for this date
      const dotDate = new Date(Date.UTC(year, month, day + 1));
      const dayIndex = dayOfYear(dotDate) - 1;

      // Determine base color (past/future/today)
      let fill: string;
      let opacity = 1;

      if (dayIndex < todayIndex) {
        fill = COLORS.past;
      } else if (dayIndex === todayIndex) {
        fill = COLORS.today;
      } else {
        fill = COLORS.future;
      }

      // Check for payday
      const payday = isPayday(dotDate);
      if (payday) {
        fill = COLORS.payday;
        if (dayIndex > todayIndex) {
          opacity = 0.8;
        }
      }

      // Check for birthday override (birthdays take priority over payday)
      const birthdayType = getBirthdayTypeForDate(dotDate, birthdays);
      if (birthdayType) {
        fill = COLORS[birthdayType];
        if (dayIndex > todayIndex) {
          opacity = 0.7;
        }
      }

      // Add subtle glow for today - more refined
      if (dayIndex === todayIndex) {
        circles += `<circle cx="${cx}" cy="${cy}" r="${monthR * 2.5}" fill="${COLORS.today}" opacity="0.08" />`;
      }

      // Check if this is a Malta public holiday - subtle elegant ring
      const holiday = getMaltaHoliday(dotDate);
      if (holiday) {
        circles += `<circle cx="${cx}" cy="${cy}" r="${monthR * 1.6}" fill="none" stroke="${COLORS.holiday}" stroke-width="${Math.max(1, monthR * 0.15)}" />`;
      }

      circles += `<circle cx="${cx}" cy="${cy}" r="${monthR}" fill="${fill}" opacity="${opacity}" />`;

      // Add dollar sign for payday
      if (payday) {
        const dollarSize = Math.max(8, monthR * 1.1);
        circles += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${dollarSize}" font-weight="700"
          fill="${COLORS.bgTop}" opacity="${dayIndex > todayIndex ? 0.85 : 1}">$</text>`;
      }
    }
  }

  const monthLines = "";

  // Font settings - use generic sans-serif for server-side rendering compatibility
  const fontFamily = "Arial, Helvetica, sans-serif";

  // Footer stats positioned above iOS lock screen buttons (~83%)
  const footerY = gridBottom + Math.round(height * 0.025);
  const footerFontSize = Math.round(height * 0.013);

  // Payday countdown
  const nextPaydayInfo = getNextPayday(dateUTC);
  let paydayText = "";
  if (nextPaydayInfo.daysUntil === 0) {
    paydayText = `💰 Payday today!`;
  } else {
    paydayText = `${nextPaydayInfo.daysUntil}d until payday`;
  }

  // Birthday countdown
  let birthdayText = "";
  if (nextBirthday) {
    if (nextBirthday.daysUntil === 0) {
      birthdayText = `🎂 ${nextBirthday.name}'s birthday today!`;
    } else {
      birthdayText = `${nextBirthday.daysUntil}d until ${nextBirthday.name}'s birthday`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.bgTop}"/>
      <stop offset="100%" stop-color="${COLORS.bgBottom}"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>

  <!-- Year and week (below notch, above iOS clock ~6% from top) -->
  <text x="${width / 2}" y="${Math.round(height * 0.06)}" text-anchor="middle"
    font-family="${fontFamily}" font-size="${Math.round(height * 0.014)}" font-weight="400"
    fill="${COLORS.textMuted}">${year} · Week ${weekNumber}</text>

  <!-- Month labels -->
  ${monthLabels}

  <!-- Dot grid -->
  ${circles}

  <!-- Footer stats -->
  <text x="${width / 2}" y="${footerY}" text-anchor="middle"
    font-family="${fontFamily}" font-size="${footerFontSize}" font-weight="400"
    fill="${COLORS.textMuted}">
    <tspan fill="${COLORS.textAccent}">${daysLeft}</tspan><tspan>d left</tspan>
    <tspan dx="0.5em">·</tspan>
    <tspan dx="0.5em">${pct}%</tspan>
    <tspan dx="0.5em">·</tspan>
    <tspan dx="0.5em" fill="${COLORS.payday}">${paydayText}</tspan>
    ${nextBirthday ? `<tspan dx="0.5em">·</tspan><tspan dx="0.5em" fill="${COLORS.friend}">${nextBirthday.daysUntil}d to ${nextBirthday.name}</tspan>` : ''}
  </text>
</svg>`;

  return svg;
}
