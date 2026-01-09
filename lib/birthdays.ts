import { kv } from "@vercel/kv";
import fs from "fs";
import path from "path";

export type BirthdayType = "family" | "friend" | "self";

export interface Birthday {
  name: string;
  month: number; // 1-12
  day: number;   // 1-31
  type: BirthdayType;
  year?: number; // Optional birth year for age calculation
}

const BIRTHDAYS_KEY = "birthdays";
const LOCAL_PATH = path.join(process.cwd(), "data", "birthdays.json");

// Check if we're running on Vercel (KV available) or locally (use file)
const isVercel = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

/**
 * Load birthdays - from KV on Vercel, from file locally
 */
export async function loadBirthdays(): Promise<Birthday[]> {
  if (isVercel) {
    const birthdays = await kv.get<Birthday[]>(BIRTHDAYS_KEY);
    return birthdays || [];
  } else {
    // Local development - use file
    try {
      const data = fs.readFileSync(LOCAL_PATH, "utf-8");
      return JSON.parse(data).birthdays || [];
    } catch {
      return [];
    }
  }
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
