import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Initial birthdays to seed
const INITIAL_BIRTHDAYS = [
  { name: "Me", month: 2, day: 22, type: "self" as const, year: 2003 },
  { name: "Mom", month: 5, day: 12, type: "family" as const },
  { name: "Dad", month: 9, day: 3, type: "family" as const },
  { name: "Sister", month: 11, day: 28, type: "family" as const },
  { name: "Best Friend", month: 3, day: 15, type: "friend" as const },
  { name: "Alex", month: 7, day: 22, type: "friend" as const },
];

// GET - Seed the KV with initial birthdays (call once after setup)
export async function GET() {
  try {
    // Check if already seeded
    const existing = await kv.get("birthdays");
    if (existing) {
      return NextResponse.json({
        message: "Already seeded",
        birthdays: existing
      });
    }

    // Seed initial birthdays
    await kv.set("birthdays", INITIAL_BIRTHDAYS);

    return NextResponse.json({
      success: true,
      message: "Seeded successfully",
      birthdays: INITIAL_BIRTHDAYS
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
