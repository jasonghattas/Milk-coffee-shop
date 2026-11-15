import type { DayHours } from "@/data/site";

/** "07:00" -> "7 am", "23:30" -> "11:30 pm" */
export function formatTime(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

function describe(entry: DayHours): string {
  if (entry.closed) return "Closed";
  if (entry.open && entry.close) return `${formatTime(entry.open)} to ${formatTime(entry.close)}`;
  return "To be confirmed";
}

/** Merges neighbouring days with the same hours: "Tuesday to Sunday". */
export function groupHours(hours: DayHours[]): { days: string; time: string; pending: boolean }[] {
  const rows: { first: string; last: string; time: string; pending: boolean }[] = [];
  for (const entry of hours) {
    const time = describe(entry);
    const previous = rows[rows.length - 1];
    if (previous && previous.time === time) previous.last = entry.day;
    else rows.push({ first: entry.day, last: entry.day, time, pending: !entry.closed && !(entry.open && entry.close) });
  }
  return rows.map((row) => ({
    days: row.first === row.last ? row.first : `${row.first} to ${row.last}`,
    time: row.time,
    pending: row.pending,
  }));
}
