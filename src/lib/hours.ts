import type { DayHours } from "@/data/site";

/** The shop's clock: visitors abroad still see Saida's time. */
export const SHOP_TIME_ZONE = "Asia/Beirut";

/** "07:00" -> "7 AM", "23:30" -> "11:30 PM" */
export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 && h < 24 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

function describe(entry: DayHours): string {
  if (entry.closed) return "Closed";
  if (entry.open && entry.close) return `${formatTime(entry.open)} to ${formatTime(entry.close)}`;
  return "To be confirmed";
}

/** Merges neighbouring days with the same hours: "Tuesday to Sunday". */
export function groupHours(
  hours: DayHours[],
): { days: string; dayList: string[]; time: string; pending: boolean }[] {
  const rows: { list: string[]; time: string; pending: boolean }[] = [];
  for (const entry of hours) {
    const time = describe(entry);
    const previous = rows[rows.length - 1];
    if (previous && previous.time === time) previous.list.push(entry.day);
    else rows.push({ list: [entry.day], time, pending: !entry.closed && !(entry.open && entry.close) });
  }
  return rows.map((row) => ({
    days: row.list.length === 1 ? row.list[0] : `${row.list[0]} to ${row.list[row.list.length - 1]}`,
    dayList: row.list,
    time: row.time,
    pending: row.pending,
  }));
}

/** Today's weekday and the minutes past midnight, on the shop's clock. */
export function shopClock(now = new Date()): { day: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SHOP_TIME_ZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Is Milk open right now? `open` is null when today's hours are not known,
 * so the page can say "call us" instead of guessing.
 */
export function openStatus(hours: DayHours[], now = new Date()): { open: boolean | null; label: string; day: string } {
  const { day, minutes } = shopClock(now);
  const today = hours.find((entry) => entry.day === day);
  if (!today) return { open: null, label: "Call us for today’s hours", day };
  if (today.closed) return { open: false, label: "Closed today", day };
  if (!today.open || !today.close) return { open: null, label: "Call us for today’s hours", day };
  const start = toMinutes(today.open);
  let end = toMinutes(today.close);
  if (end <= start) end += 24 * 60; // closes after midnight
  if (minutes >= start && minutes < end) return { open: true, label: `Open now · until ${formatTime(today.close)}`, day };
  if (minutes < start) return { open: false, label: `Opens today at ${formatTime(today.open)}`, day };
  return { open: false, label: "Closed for tonight", day };
}
