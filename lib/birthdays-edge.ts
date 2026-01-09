import { Redis } from "@upstash/redis";

export type BirthdayType = "family" | "friend" | "self";

export interface Birthday {
  name: string;
  month: number; // 1-12
  day: number;   // 1-31
  type: BirthdayType;
  year?: number; // Optional birth year for age calculation
}

const BIRTHDAYS_KEY = "birthdays";

/**
 * Load birthdays from Upstash Redis (edge-compatible)
 */
export async function loadBirthdays(): Promise<Birthday[]> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return [];
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const birthdays = await redis.get<Birthday[]>(BIRTHDAYS_KEY);
  return birthdays || [];
}

/**
 * Check if a date matches a birthday (month and day only)
 */
export function isBirthday(date: Date, birthday: Birthday): boolean {
  const month = date.getUTCMonth() + 1; // getUTCMonth is 0-indexed
  const day = date.getUTCDate();
  return month === birthday.month && day === birthday.day;
}

/**
 * Get the birthday type for a given date
 * Priority: self > family > friend
 */
export function getBirthdayTypeForDate(date: Date, birthdays: Birthday[]): BirthdayType | null {
  // Check for self first (highest priority)
  const hasSelf = birthdays.some(b => b.type === "self" && isBirthday(date, b));
  if (hasSelf) return "self";

  // Check for family
  const hasFamily = birthdays.some(b => b.type === "family" && isBirthday(date, b));
  if (hasFamily) return "family";

  // Check for friend
  const hasFriend = birthdays.some(b => b.type === "friend" && isBirthday(date, b));
  if (hasFriend) return "friend";

  return null;
}

/**
 * Get all birthdays for a given date
 */
export function getBirthdaysForDate(date: Date, birthdays: Birthday[]): Birthday[] {
  return birthdays.filter(b => isBirthday(date, b));
}
