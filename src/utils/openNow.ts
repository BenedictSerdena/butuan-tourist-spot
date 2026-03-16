export type OpenStatus = "open" | "closed" | "always";

export interface OpenInfo {
  status: OpenStatus;
  label: string;
}

const DAY_MAP: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

function parseTime(str: string): number {
  const m = str.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!m) return -1;
  let h = parseInt(m[1]);
  const min = parseInt(m[2]);
  const period = m[3].toUpperCase();
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return h * 60 + min;
}

function isOpenDay(dayOfWeek: number, hours: string): boolean {
  if (/daily/i.test(hours)) return true;
  const rangeMatch = hours.match(/([A-Za-z]+)[–\-]([A-Za-z]+)/);
  if (!rangeMatch) return true;
  const start = DAY_MAP[rangeMatch[1].toLowerCase().slice(0, 3)];
  const end = DAY_MAP[rangeMatch[2].toLowerCase().slice(0, 3)];
  if (start === undefined || end === undefined) return true;
  if (start <= end) return dayOfWeek >= start && dayOfWeek <= end;
  // wraps Sunday (e.g. Tue–Sun)
  return dayOfWeek >= start || dayOfWeek <= end;
}

export function getOpenInfo(hours: string): OpenInfo {
  if (/open anytime|open 24\/7|24\/7/i.test(hours)) {
    return { status: "always", label: "Always open" };
  }

  // Current time in Philippines (UTC+8)
  const now = new Date();
  const ph = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const dayOfWeek = ph.getUTCDay();
  const nowMins = ph.getUTCHours() * 60 + ph.getUTCMinutes();

  const timeMatch = hours.match(/(\d+:\d+\s*(?:AM|PM))\s*[–\-]\s*(\d+:\d+\s*(?:AM|PM))/i);
  if (!timeMatch) return { status: "open", label: "Check hours" };

  const openMins = parseTime(timeMatch[1]);
  const closeMins = parseTime(timeMatch[2]);
  if (openMins === -1 || closeMins === -1) return { status: "open", label: "Check hours" };

  if (!isOpenDay(dayOfWeek, hours)) return { status: "closed", label: "Closed today" };

  if (nowMins >= openMins && nowMins < closeMins) {
    const minsLeft = closeMins - nowMins;
    if (minsLeft <= 60) return { status: "open", label: `Closes in ${minsLeft}m` };
    return { status: "open", label: "Open now" };
  }

  if (nowMins < openMins && openMins - nowMins <= 60) {
    return { status: "closed", label: `Opens in ${openMins - nowMins}m` };
  }

  return { status: "closed", label: "Closed now" };
}
