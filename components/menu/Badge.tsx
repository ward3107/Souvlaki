import { Star } from 'lucide-react';
import { BADGE_LABELS, type BadgeKey, type Lang } from '../../utils/menuData';

export default function Badge({ kind, lang }: { kind: BadgeKey; lang: Lang }) {
  const styles: Record<BadgeKey, string> = {
    popular:
      'bg-brand-terracotta-50 text-brand-terracotta-500 dark:bg-brand-terracotta-400/15 dark:text-brand-terracotta-200',
    gf: 'bg-brand-blue-50 text-brand-blue-500 dark:bg-brand-blue-900/30 dark:text-brand-blue-300',
    vegan: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    spicy: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    new: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  };
  const showStar = kind === 'popular';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[kind]}`}
    >
      {showStar && <Star className="w-3 h-3 fill-current" aria-hidden="true" />}
      {BADGE_LABELS[kind][lang]}
    </span>
  );
}
