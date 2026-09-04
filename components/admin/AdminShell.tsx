import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { tx, isRtlLang } from '../../utils/i18n';
import { navigate } from '../../utils/router';

export default function AdminShell({
  lang,
  children,
  right,
}: {
  lang: Language;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  const isRtl = isRtlLang(lang);
  return (
    <div className="min-h-screen bg-slate-950 text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label={tx(
                lang,
                'לאתר',
                'Back to site',
                'إلى الموقع',
                'На сайт',
                'Στον ιστότοπο'
              )}
              className="rounded-full p-2 text-white/70 hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </button>
            <h1 className="font-display text-lg font-semibold">
              {tx(lang, 'ניהול', 'Admin', 'إدارة', 'Управление', 'Διαχείριση')}
            </h1>
          </div>
          <div className="flex items-center gap-2">{right}</div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">{children}</main>
    </div>
  );
}
