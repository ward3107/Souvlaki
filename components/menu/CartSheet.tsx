import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { getLocalized, formatPrice, type Lang } from '../../utils/menuData';
import { useBackClose } from '../hooks/useBackClose';
import WhatsAppGlyph from './WhatsAppGlyph';
import type { ResolvedLine } from './cart';
import {
  YOUR_ORDER_LABEL,
  CLOSE_LABEL,
  EMPTY_CART_LABEL,
  DECREASE_ARIA,
  INCREASE_ARIA,
  REMOVE_ARIA,
  TOTAL_LABEL,
  NAME_PLACEHOLDER,
  NAME_LABEL,
  CLEAR_CART_LABEL,
  SEND_ORDER_LABEL,
} from './labels';

export default function CartSheet({
  lines,
  total,
  lang,
  isRtl,
  onClose,
  onInc,
  onDec,
  onRemove,
  onClear,
  onSend,
  customerName,
  onNameChange,
}: {
  lines: ResolvedLine[];
  total: number;
  lang: Lang;
  isRtl: boolean;
  onClose: () => void;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
  onSend: () => void;
  customerName: string;
  onNameChange: (v: string) => void;
}) {
  // Mobile Back button closes the cart instead of navigating away.
  useBackClose(true, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={getLocalized(YOUR_ORDER_LABEL, lang)}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full md:w-[28rem] max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl md:rounded-2xl shadow-lift">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="font-display text-xl font-semibold text-gray-900 dark:text-white">
            {YOUR_ORDER_LABEL[lang]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={getLocalized(CLOSE_LABEL, lang)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              {EMPTY_CART_LABEL[lang]}
            </p>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.key} className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {l.name}
                    </div>
                    {l.variantLabel && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {l.variantLabel}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
                      {formatPrice(l.unitPrice)} × {l.qty} ={' '}
                      <span className="font-semibold text-brand-blue-500">
                        {formatPrice(l.lineTotal)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDec(l.key)}
                      aria-label={getLocalized(DECREASE_ARIA, lang)}
                      className="p-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {l.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInc(l.key)}
                      aria-label={getLocalized(INCREASE_ARIA, lang)}
                      className="p-1.5 rounded-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(l.key)}
                      aria-label={getLocalized(REMOVE_ARIA, lang)}
                      className="ms-1 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-gray-200 dark:border-slate-700 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {TOTAL_LABEL[lang]}
              </span>
              <span className="font-display text-2xl font-semibold text-brand-blue-500 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={NAME_PLACEHOLDER[lang]}
              aria-label={NAME_LABEL[lang]}
              autoComplete="name"
              required
              className="w-full px-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClear}
                className="px-3 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {CLEAR_CART_LABEL[lang]}
              </button>
              <button
                type="button"
                onClick={onSend}
                disabled={!customerName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white text-sm font-semibold shadow-soft transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <WhatsAppGlyph className="w-4 h-4" />
                <span>{SEND_ORDER_LABEL[lang]}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
