import { ImageResponse } from "@vercel/og";
import { clamp, parseDateOrTodayCET, dayOfYear, daysInYear } from "@/lib/date";
import { loadBirthdays, getBirthdayTypeForDate, Birthday } from "@/lib/birthdays";

export const runtime = "edge";

// Malta Public Holidays
function getMaltaHoliday(date: Date): string | null {
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

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
  if (fixedHolidays[key]) return fixedHolidays[key];

  // Good Friday calculation
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
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
  const easterDate = new Date(Date.UTC(year, easterMonth, easterDay));
  const goodFridayDate = new Date(easterDate.getTime() - 2 * 86400000);

  if (month === goodFridayDate.getUTCMonth() && day === goodFridayDate.getUTCDate()) {
    return "Good Friday";
  }

  return null;
}

// Payday check (every 28 days from Jan 23, 2026)
function isPayday(date: Date): boolean {
  const firstPayday = Date.UTC(2026, 0, 23);
  const currentDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const diffDays = Math.round((currentDate - firstPayday) / 86400000);
  return diffDays % 28 === 0;
}

// Get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Get next birthday
function getNextBirthday(currentDate: Date, birthdays: Birthday[]): { name: string; daysUntil: number } | null {
  if (birthdays.length === 0) return null;
  const year = currentDate.getUTCFullYear();
  const currentDayOfYear = dayOfYear(currentDate);
  let closest: { name: string; daysUntil: number } | null = null;

  for (const b of birthdays) {
    const birthdayThisYear = new Date(Date.UTC(year, b.month - 1, b.day));
    let birthdayDayOfYear = dayOfYear(birthdayThisYear);
    let daysUntil: number;

    if (birthdayDayOfYear >= currentDayOfYear) {
      daysUntil = birthdayDayOfYear - currentDayOfYear;
    } else {
      const totalDaysThisYear = daysInYear(year);
      const birthdayNextYear = new Date(Date.UTC(year + 1, b.month - 1, b.day));
      daysUntil = (totalDaysThisYear - currentDayOfYear) + dayOfYear(birthdayNextYear);
    }

    if (daysUntil === 0) return { name: b.name, daysUntil: 0 };
    if (!closest || daysUntil < closest.daysUntil) {
      closest = { name: b.name, daysUntil };
    }
  }
  return closest;
}

// Get next payday
function getNextPayday(currentDate: Date): { daysUntil: number } {
  const firstPayday = Date.UTC(2026, 0, 23);
  const current = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate());
  const diffDays = Math.round((current - firstPayday) / 86400000);
  const daysSinceLastPayday = ((diffDays % 28) + 28) % 28;
  const daysUntilNext = daysSinceLastPayday === 0 ? 0 : 28 - daysSinceLastPayday;
  return { daysUntil: daysUntilNext };
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COLORS = {
  bgTop: "#0A0E13",
  bgBottom: "#060809",
  past: "#D4D7DC",
  future: "rgba(212,215,220,0.12)",
  today: "#E85D3B",
  self: "#F5C842",
  family: "#5B9CF6",
  friend: "#5B9CF6",
  payday: "#34C759",
  holiday: "rgba(212,215,220,0.3)",
  textMuted: "#B8BCC4",
  textMonth: "#9CA0A8",
  textAccent: "#E85D3B",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const width = clamp(parseInt(searchParams.get("width") ?? "1284", 10) || 1284, 600, 3000);
  const height = clamp(parseInt(searchParams.get("height") ?? "2778", 10) || 2778, 900, 4000);
  const dateParam = searchParams.get("date");
  const dateUTC = parseDateOrTodayCET(dateParam);
  const birthdays = await loadBirthdays();

  const year = dateUTC.getUTCFullYear();
  const totalDays = daysInYear(year);
  const todayIndex = dayOfYear(dateUTC) - 1;
  const daysLeft = totalDays - (todayIndex + 1);
  const pct = Math.round(((todayIndex + 1) / totalDays) * 100);
  const weekNumber = getWeekNumber(dateUTC);
  const nextBirthday = getNextBirthday(dateUTC, birthdays);
  const nextPaydayInfo = getNextPayday(dateUTC);

  // Layout calculations
  const topPad = height * 0.275;
  const bottomPad = height * 0.19;
  const sidePadLeft = width * 0.14;
  const sidePadRight = width * 0.07;
  const gridWidth = width - sidePadLeft - sidePadRight;
  const gridHeight = height - topPad - bottomPad;
  const monthCellX = gridWidth / 30;
  const monthCellY = gridHeight / 11;
  const dotR = Math.max(6, Math.min(monthCellX, monthCellY) * 0.35);

  // Generate dots
  const dots = [];
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let day = 0; day < daysInMonth; day++) {
      const cx = sidePadLeft + day * monthCellX;
      const cy = topPad + month * monthCellY;
      const dotDate = new Date(Date.UTC(year, month, day + 1));
      const dayIndex = dayOfYear(dotDate) - 1;

      let fill = dayIndex < todayIndex ? COLORS.past : dayIndex === todayIndex ? COLORS.today : COLORS.future;
      let opacity = 1;

      const payday = isPayday(dotDate);
      if (payday) {
        fill = COLORS.payday;
        if (dayIndex > todayIndex) opacity = 0.8;
      }

      const birthdayType = getBirthdayTypeForDate(dotDate, birthdays);
      if (birthdayType) {
        fill = COLORS[birthdayType];
        if (dayIndex > todayIndex) opacity = 0.7;
      }

      const holiday = getMaltaHoliday(dotDate);

      dots.push({ cx, cy, fill, opacity, isToday: dayIndex === todayIndex, holiday, payday });
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${COLORS.bgTop} 0%, ${COLORS.bgBottom} 100%)`,
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
        }}
      >
        {/* Year and Week */}
        <div
          style={{
            position: "absolute",
            top: height * 0.06,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            color: COLORS.textMuted,
            fontSize: height * 0.022,
            fontWeight: 500,
          }}
        >
          {year} · Week {weekNumber}
        </div>

        {/* Month labels */}
        {MONTH_NAMES.map((name, i) => (
          <div
            key={name}
            style={{
              position: "absolute",
              top: topPad + i * monthCellY - height * 0.008,
              left: width * 0.02,
              color: COLORS.textMonth,
              fontSize: height * 0.018,
              fontWeight: 500,
              display: "flex",
            }}
          >
            {name}
          </div>
        ))}

        {/* Dots */}
        {dots.map((dot, i) => (
          <div key={i} style={{ position: "absolute", display: "flex" }}>
            {dot.isToday && (
              <div
                style={{
                  position: "absolute",
                  left: dot.cx - dotR * 2.5,
                  top: dot.cy - dotR * 2.5,
                  width: dotR * 5,
                  height: dotR * 5,
                  borderRadius: "50%",
                  background: COLORS.today,
                  opacity: 0.15,
                }}
              />
            )}
            {dot.holiday && (
              <div
                style={{
                  position: "absolute",
                  left: dot.cx - dotR * 1.6,
                  top: dot.cy - dotR * 1.6,
                  width: dotR * 3.2,
                  height: dotR * 3.2,
                  borderRadius: "50%",
                  border: `${dotR * 0.15}px solid ${COLORS.holiday}`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: dot.cx - dotR,
                top: dot.cy - dotR,
                width: dotR * 2,
                height: dotR * 2,
                borderRadius: "50%",
                background: dot.fill,
                opacity: dot.opacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.bgTop,
                fontSize: dotR * 1.1,
                fontWeight: 700,
              }}
            >
              {dot.payday ? "$" : ""}
            </div>
          </div>
        ))}

        {/* Footer stats */}
        <div
          style={{
            position: "absolute",
            bottom: height * 0.12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            fontSize: height * 0.018,
            fontWeight: 500,
            color: COLORS.textMuted,
            gap: 12,
          }}
        >
          <span style={{ color: COLORS.textAccent }}>{daysLeft}</span>
          <span>d left · {pct}% ·</span>
          <span style={{ color: COLORS.payday }}>{nextPaydayInfo.daysUntil}d until payday</span>
          {nextBirthday && (
            <>
              <span>·</span>
              <span style={{ color: COLORS.friend }}>{nextBirthday.daysUntil}d to {nextBirthday.name}</span>
            </>
          )}
        </div>
      </div>
    ),
    { width, height }
  );
}
