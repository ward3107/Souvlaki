import { getLocalized, type MenuAddon, type Lang } from '../../utils/menuData';
import { ADDONS_LABEL } from './labels';

export default function AddOnsList({ addons, lang }: { addons: MenuAddon[]; lang: Lang }) {
  return (
    <div className="mt-6 pt-5 border-t border-dashed border-gray-300 dark:border-slate-700">
      <div className="text-[11px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-2">
        {ADDONS_LABEL[lang]}
      </div>
      <ul className="space-y-1">
        {addons.map((a) => (
          <li
            key={a.id}
            className="flex items-baseline justify-between gap-3 text-sm text-gray-600 dark:text-gray-300"
          >
            <span>{getLocalized(a.name, lang)}</span>
            <span className="font-semibold text-brand-terracotta-500 whitespace-nowrap">
              {a.price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
