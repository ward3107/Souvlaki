import { useEffect, useState } from 'react';
import { BUSINESS_INFO } from './businessInfo';

// Single source of truth for the restaurant's opening hours, in Israel local
// time. Used by the header live pill and the Contact "Opening Hours" card so
// they can never disagree.
//
// Schedule: Wednesday–Saturday 13:00–00:00.
// Sunday–Tuesday: closed.

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday

interface Schedule {
  open: number; // opening hour, 24h
  close: number; // closing hour, 24h — a value <= open means "next day"
}

export const OPENING_SCHEDULE: Record<DayOfWeek, Schedule | null> = {
  0: null,
  1: null,
  2: null,
  3: { open: BUSINESS_INFO.hours.opensAtHour, close: BUSINESS_INFO.hours.closesAtHour },
  4: { open: BUSINESS_INFO.hours.opensAtHour, close: BUSINESS_INFO.hours.closesAtHour },
  5: { open: BUSINESS_INFO.hours.opensAtHour, close: BUSINESS_INFO.hours.closesAtHour },
  6: { open: BUSINESS_INFO.hours.opensAtHour, close: BUSINESS_INFO.hours.closesAtHour },
};

// The days the restaurant serves, as a compact range for the schedule card.
export const OPEN_DAYS: DayOfWeek[] = [...BUSINESS_INFO.hours.openDays];
export const OPEN_TIME_LABEL = BUSINESS_INFO.hours.displaySpaced;

export interface OpenStatus {
  isOpen: boolean;
  /** Minutes until the next open→closed or closed→open transition. */
  minutesUntilChange: number;
  /** Closing time label ("00:00") when open; else undefined. */
  closesAt?: string;
  /** Day index of the next opening when closed; else undefined. */
  nextOpenDay?: DayOfWeek;
  /** Opening time label ("13:00") of the next opening when closed. */
  nextOpenTime?: string;
}

// Current wall-clock in the Asia/Jerusalem timezone, independent of the
// visitor's own device timezone.
function israelNow(): { day: DayOfWeek; hour: number; minute: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const dayMap: Record<string, DayOfWeek> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const day = dayMap[get('weekday')] ?? 0;
  // Intl can emit "24" for midnight in some engines — normalise to 0.
  const rawHour = parseInt(get('hour'), 10);
  const hour = Number.isNaN(rawHour) ? 0 : rawHour % 24;
  const minute = parseInt(get('minute'), 10) || 0;
  return { day, hour, minute };
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function getOpenStatus(): OpenStatus {
  const { day, hour, minute } = israelNow();
  const nowMin = hour * 60 + minute;

  // Are we open right now? Two windows can cover "now": today's own window, or
  // yesterday's window that spills past midnight into the small hours.
  const today = OPENING_SCHEDULE[day];
  const yesterday = OPENING_SCHEDULE[((day + 6) % 7) as DayOfWeek];

  // Case A: inside yesterday's after-midnight tail, for schedules that close
  // after midnight. The current 00:00 closing time has no spill-over tail.
  if (yesterday && yesterday.close <= yesterday.open && nowMin < yesterday.close * 60) {
    return {
      isOpen: true,
      minutesUntilChange: yesterday.close * 60 - nowMin,
      closesAt: `${pad2(yesterday.close)}:00`,
    };
  }

  // Case B: inside today's window.
  if (today) {
    const openMin = today.open * 60;
    const closeMin = (today.close <= today.open ? today.close + 24 : today.close) * 60;
    if (nowMin >= openMin && nowMin < closeMin) {
      const closeHour = today.close % 24;
      return {
        isOpen: true,
        minutesUntilChange: closeMin - nowMin,
        closesAt: `${pad2(closeHour)}:00`,
      };
    }
  }

  // Closed — find the next day (including today, if we're before opening) that
  // has a window, and report when it opens.
  for (let ahead = 0; ahead < 8; ahead++) {
    const d = ((day + ahead) % 7) as DayOfWeek;
    const sched = OPENING_SCHEDULE[d];
    if (!sched) continue;
    const openMin = sched.open * 60;
    // Today only counts if opening is still in the future.
    if (ahead === 0 && nowMin >= openMin) continue;
    const minutesUntil = ahead * 24 * 60 + openMin - nowMin;
    return {
      isOpen: false,
      minutesUntilChange: minutesUntil,
      nextOpenDay: d,
      nextOpenTime: `${pad2(sched.open)}:00`,
    };
  }

  return { isOpen: false, minutesUntilChange: 0 };
}

/** React hook: recomputes the open status once a minute. */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus());
  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);
  return status;
}
