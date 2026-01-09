/**
 * Date utilities for the life calendar wallpaper
 * All functions handle UTC and CET timezone conversions
 */

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Get current date in CET/CEST timezone
 * CET = UTC+1, CEST = UTC+2 (last Sunday of March to last Sunday of October)
 */
export function getNowInCET(): Date {
  const now = new Date();

  // Get UTC time
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  const utcHours = now.getUTCHours();

  // Determine if we're in CEST (Central European Summer Time)
  // CEST: Last Sunday of March 02:00 UTC to last Sunday of October 03:00 UTC
  const isCEST = isInCEST(now);
  const offsetHours = isCEST ? 2 : 1;

  // Create a new date with CET offset applied
  const cetDate = new Date(Date.UTC(utcYear, utcMonth, utcDate, utcHours + offsetHours));

  return cetDate;
}

/**
 * Check if a given UTC date falls within CEST period
 */
function isInCEST(date: Date): boolean {
  const year = date.getUTCFullYear();

  // Last Sunday of March at 01:00 UTC (when clocks go forward)
  const marchLastSunday = getLastSundayOfMonth(year, 2); // March is month 2 (0-indexed)
  const cestStart = Date.UTC(year, 2, marchLastSunday, 1, 0, 0);

  // Last Sunday of October at 01:00 UTC (when clocks go back)
  const octoberLastSunday = getLastSundayOfMonth(year, 9); // October is month 9
  const cestEnd = Date.UTC(year, 9, octoberLastSunday, 1, 0, 0);

  const timestamp = date.getTime();
  return timestamp >= cestStart && timestamp < cestEnd;
}

/**
 * Get the last Sunday of a given month
 */
function getLastSundayOfMonth(year: number, month: number): number {
  // Start from the last day of the month
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const dayOfWeek = lastDay.getUTCDay();
  // Calculate the last Sunday
  return lastDay.getUTCDate() - dayOfWeek;
}

/**
 * Parse a date string (YYYY-MM-DD) or return today in CET
 */
export function parseDateOrTodayCET(dateStr: string | null): Date {
  if (!dateStr) {
    return getNowInCET();
  }

  // Expect YYYY-MM-DD format
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return getNowInCET();
  }

  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);

  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
    return getNowInCET();
  }

  return new Date(Date.UTC(y, m - 1, d, 12)); // Noon to avoid edge cases
}

/**
 * Get the number of days in a year (365 or 366 for leap years)
 */
export function daysInYear(year: number): number {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  return isLeap ? 366 : 365;
}

/**
 * Get the day of year (1-based, 1 to 365/366)
 */
export function dayOfYear(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const current = Date.UTC(year, date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - startOfYear) / 86400000) + 1;
}

/**
 * Get a date from a day index (0-based) in a given year
 */
export function dateFromDayIndex(year: number, dayIndex: number): Date {
  return new Date(Date.UTC(year, 0, 1 + dayIndex));
}
