import { Clock } from 'lucide-react';
import { Language } from '../types';
import { useOpenStatus } from '../utils/openStatus';
import OpenStatusPill from './OpenStatusPill';

interface OpeningHoursProps {
  language?: string;
}

const DAY_NAMES = {
  en: {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  },
  he: {
    0: 'ראשון',
    1: 'שני',
    2: 'שלישי',
    3: 'רביעי',
    4: 'חמישי',
    5: 'שישי',
    6: 'שבת',
  },
  ar: {
    0: 'الأحد',
    1: 'الاثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
    6: 'السبت',
  },
  ru: {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
  },
  el: {
    0: 'Κυριακή',
    1: 'Δευτέρα',
    2: 'Τρίτη',
    3: 'Τετάρτη',
    4: 'Πέμπτη',
    5: 'Παρασκευή',
    6: 'Σάββατο',
  },
};

const STATUS_TEXT = {
  open: {
    en: 'Open Now',
    he: 'פתוח עכשיו',
    ar: 'مفتوح الآن',
    ru: 'Открыто сейчас',
    el: 'Ανοιχτά τώρα',
  },
  closed: {
    en: 'Closed',
    he: 'סגור',
    ar: 'مغلق',
    ru: 'Закрыто',
    el: 'Κλειστά',
  },
  title: {
    en: 'Opening Hours',
    he: 'שעות פתיחה',
    ar: 'ساعات العمل',
    ru: 'Часы работы',
    el: 'Ώρες λειτουργίας',
  },
};

export default function OpeningHours({ language = 'en' }: OpeningHoursProps) {
  const { isOpen } = useOpenStatus();

  const lang = language as keyof typeof DAY_NAMES;
  const dayNames = DAY_NAMES[lang] || DAY_NAMES.en;
  const statusText = STATUS_TEXT[isOpen ? 'open' : 'closed'][lang] || STATUS_TEXT.open.en;
  const titleText = STATUS_TEXT.title[lang] || STATUS_TEXT.title.en;
  const closedText = STATUS_TEXT.closed[lang] || STATUS_TEXT.closed.en;

  return (
    <div className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-2 border-green-200 dark:border-green-900">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
          {titleText}
        </h3>
      </div>

      {/* Screen reader announcement for status changes */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusText}
      </div>

      {/* Status Badge - PROMINENT when open, subtle when closed */}
      <div className="mb-6">
        {isOpen ? (
          // OPEN NOW - Make it POP!
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold tracking-wider uppercase text-lg rounded-2xl shadow-xl shadow-green-500/30 animate-pulse">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
              <span>{statusText}</span>
            </div>
          </div>
        ) : (
          // CLOSED - Subtle, less prominent
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-xl border border-red-200 dark:border-red-800">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>{statusText}</span>
            </div>
          </div>
        )}
      </div>

      {/* Live next-change hint: "Open until 01:00" / "Opens Wed 13:00" */}
      <div className="flex justify-center mb-6">
        <OpenStatusPill lang={language as Language} />
      </div>

      {/* Hours List */}
      <ul className="space-y-4">
        {/* Open Days */}
        <li className="flex justify-between items-center border-b border-gray-200 dark:border-slate-700 pb-3">
          <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">
            {dayNames[3]} - {dayNames[6]}
          </span>
          <span className="text-green-600 dark:text-green-400 font-bold text-lg bg-green-50 dark:bg-green-900/30 px-4 py-1.5 rounded-full">
            13:00 - 01:00
          </span>
        </li>

        {/* Closed Days */}
        <li className="flex justify-between items-center pt-3">
          <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">
            {dayNames[0]} - {dayNames[2]}
          </span>
          <span className="text-red-500/70 dark:text-red-400/70 font-medium text-sm">
            {closedText}
          </span>
        </li>
      </ul>
    </div>
  );
}
