import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

interface Birthday {
  name: string;
  month: number;
  day: number;
  type: "self" | "family" | "friend";
  year?: number;
}

const BIRTHDAYS_KEY = "birthdays";
const LOCAL_PATH = path.join(process.cwd(), "data", "birthdays.json");

// Check if we're running on Vercel with Upstash
const isUpstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create Redis client if on Upstash
const redis = isUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

async function getBirthdays(): Promise<Birthday[]> {
  if (redis) {
    const birthdays = await redis.get<Birthday[]>(BIRTHDAYS_KEY);
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

async function saveBirthdays(birthdays: Birthday[]): Promise<void> {
  if (redis) {
    await redis.set(BIRTHDAYS_KEY, birthdays);
  } else {
    // Local development - use file
    fs.writeFileSync(LOCAL_PATH, JSON.stringify({ birthdays }, null, 2) + "\n");
  }
}

// GET - List all birthdays
export async function GET() {
  try {
    const birthdays = await getBirthdays();
    return NextResponse.json({ birthdays });
  } catch (error) {
    console.error("Failed to read birthdays:", error);
    return NextResponse.json({ error: "Failed to read birthdays" }, { status: 500 });
  }
}

// POST - Add a new birthday
export async function POST(req: Request) {
  try {
    const birthday: Birthday = await req.json();

    // Validate
    if (!birthday.name || !birthday.month || !birthday.day || !birthday.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (birthday.month < 1 || birthday.month > 12) {
      return NextResponse.json({ error: "Invalid month" }, { status: 400 });
    }

    if (birthday.day < 1 || birthday.day > 31) {
      return NextResponse.json({ error: "Invalid day" }, { status: 400 });
    }

    const birthdays = await getBirthdays();
    birthdays.push(birthday);
    await saveBirthdays(birthdays);

    return NextResponse.json({ success: true, birthdays });
  } catch (error) {
    console.error("Failed to add birthday:", error);
    return NextResponse.json({ error: "Failed to add birthday" }, { status: 500 });
  }
}

// DELETE - Remove a birthday by name
export async function DELETE(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const birthdays = await getBirthdays();
    const initialLength = birthdays.length;
    const filtered = birthdays.filter(b => b.name !== name);

    if (filtered.length === initialLength) {
      return NextResponse.json({ error: "Birthday not found" }, { status: 404 });
    }

    await saveBirthdays(filtered);

    return NextResponse.json({ success: true, birthdays: filtered });
  } catch (error) {
    console.error("Failed to delete birthday:", error);
    return NextResponse.json({ error: "Failed to delete birthday" }, { status: 500 });
  }
}
