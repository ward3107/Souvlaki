import { AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { isSupabaseConfigured } from '../utils/supabase';
import { tx } from '../utils/i18n';
import SupabaseAdmin from './admin/SupabaseAdmin';

// Owner console at /admin. Production administration requires Supabase Auth;
// a client-side PIN is intentionally never used as an authentication boundary.
export default function Admin({ lang }: { lang: Language }) {
  if (isSupabaseConfigured) return <SupabaseAdmin lang={lang} />;

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"
      dir={lang === Language.HE || lang === Language.AR ? 'rtl' : 'ltr'}
    >
      <section className="w-full max-w-md rounded-2xl border border-amber-400/20 bg-slate-900 p-6 text-center shadow-2xl">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-400" aria-hidden="true" />
        <h1 className="font-display text-xl font-semibold">
          {tx(lang, 'האדמין עדיין לא הוגדר', 'Admin is not configured', 'لم يتم إعداد الإدارة', 'Панель не настроена', 'Η διαχείριση δεν έχει ρυθμιστεί')}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          {tx(
            lang,
            'מטעמי אבטחה, יש לחבר Supabase ולהיכנס באמצעות חשבון הבעלים. כניסה באמצעות PIN מקומי אינה זמינה באתר פעיל.',
            'For security, connect Supabase and sign in with the owner account. Local PIN access is disabled in production.',
            'للحماية، يجب ربط Supabase وتسجيل الدخول بحساب المالك. تم تعطيل الدخول برمز محلي.',
            'Для безопасности подключите Supabase и войдите с аккаунтом владельца. Локальный PIN отключён.',
            'Για ασφάλεια, συνδέστε το Supabase και εισέλθετε με τον λογαριασμό ιδιοκτήτη. Το τοπικό PIN είναι απενεργοποιημένο.'
          )}
        </p>
        <a
          href="/"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
        >
          {tx(lang, 'חזרה לאתר', 'Back to site', 'العودة للموقع', 'Вернуться на сайт', 'Επιστροφή')}
        </a>
      </section>
    </main>
  );
}
