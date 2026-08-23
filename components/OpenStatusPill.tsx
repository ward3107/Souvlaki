import { Language } from '../types';
import { tx } from '../utils/i18n';
import { useOpenStatus, type OpenStatus } from '../utils/openStatus';

// Weekday short names for the "Opens Wed 13:00" hint, per language.
const DAY_SHORT: Record<Language, string[]> = {
  [Language.EN]: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  [Language.HE]: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'שבת'],
  [Language.AR]: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  [Language.RU]: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  [Language.EL]: ['Κυρ', 'Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ'],
};

function humanizeSoon(minutes: number, lang: Language): string {
  if (minutes < 60) {
    return tx(
      lang,
      `בעוד ${minutes} דק׳`,
      `in ${minutes} min`,
      `خلال ${minutes} د`,
      `через ${minutes} мин`,
      `σε ${minutes} λεπτά`
    );
  }
  const hours = Math.round(minutes / 60);
  return tx(
    lang,
    `בעוד ${hours} שע׳`,
    `in ${hours}h`,
    `خلال ${hours} س`,
    `через ${hours} ч`,
    `σε ${hours} ώρες`
  );
}

function buildText(status: OpenStatus, lang: Language): string {
  if (status.isOpen) {
    // Only surface the "closes soon" countdown in the last hour, otherwise show
    // the closing time — cleaner and less alarming.
    if (status.minutesUntilChange <= 60) {
      return tx(
        lang,
        `נסגר ${humanizeSoon(status.minutesUntilChange, lang)}`,
        `Closes ${humanizeSoon(status.minutesUntilChange, lang)}`,
        `يغلق ${humanizeSoon(status.minutesUntilChange, lang)}`,
        `Закрытие ${humanizeSoon(status.minutesUntilChange, lang)}`,
        `Κλείνει ${humanizeSoon(status.minutesUntilChange, lang)}`
      );
    }
    return tx(
      lang,
      `פתוח עד ${status.closesAt}`,
      `Open until ${status.closesAt}`,
      `مفتوح حتى ${status.closesAt}`,
      `Открыто до ${status.closesAt}`,
      `Ανοιχτά έως ${status.closesAt}`
    );
  }

  if (status.nextOpenDay === undefined) {
    return tx(lang, 'סגור', 'Closed', 'مغلق', 'Закрыто', 'Κλειστά');
  }
  const day = DAY_SHORT[lang]?.[status.nextOpenDay] ?? DAY_SHORT[Language.EN][status.nextOpenDay];
  // Under two hours, a relative "opens in 40 min" reads friendlier than a day.
  const when =
    status.minutesUntilChange <= 120
      ? humanizeSoon(status.minutesUntilChange, lang)
      : `${day} ${status.nextOpenTime}`;
  return tx(
    lang,
    `נפתח ${when}`,
    `Opens ${when}`,
    `يفتح ${when}`,
    `Открытие ${when}`,
    `Ανοίγει ${when}`
  );
}

interface Props {
  lang: Language;
  className?: string;
}

/** Compact live open/closed pill with a next-change hint, ticking each minute. */
export default function OpenStatusPill({ lang, className = '' }: Props) {
  const status = useOpenStatus();
  const label = buildText(status, lang);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold whitespace-nowrap ${
        status.isOpen
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            status.isOpen ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
      </span>
      {label}
    </span>
  );
}
