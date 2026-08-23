import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { tx, isRtlLang } from '../utils/i18n';
import { track } from '../utils/analytics';

// Optional POST endpoint (Formspree, Buttondown, a Supabase edge function, …).
// When unset, we fall back to a WhatsApp "subscribe" message so the feature
// still works with zero backend.
const ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined;
const WHATSAPP_NUMBER = '972542001235';
const STORAGE_KEY = 'newsletter-subscribed-v1';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'submitting' | 'done' | 'error';

export default function Newsletter({ lang }: { lang: Language }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) ? 'done' : 'idle'
  );
  const isRtl = isRtlLang(lang);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    track('newsletter_signup', { method: ENDPOINT ? 'endpoint' : 'whatsapp' });

    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: value, lang, source: 'website' }),
        });
        if (!res.ok) throw new Error(String(res.status));
        localStorage.setItem(STORAGE_KEY, value);
        setStatus('done');
      } catch {
        setStatus('error');
      }
      return;
    }

    // No backend configured — hand off to WhatsApp so the owner captures it.
    const msg = tx(
      lang,
      `היי! אשמח להצטרף לרשימת התפוצה שלכם. המייל שלי: ${value}`,
      `Hi! I'd like to join your newsletter. My email: ${value}`,
      `مرحبًا! أود الاشتراك في نشرتكم البريدية. بريدي: ${value}`,
      `Здравствуйте! Хочу подписаться на рассылку. Мой email: ${value}`,
      `Γεια! Θέλω να εγγραφώ στο newsletter σας. Το email μου: ${value}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
    localStorage.setItem(STORAGE_KEY, value);
    setStatus('done');
  };

  return (
    <section className="bg-brand-blue-700 py-14 dark:bg-slate-950" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
          <Mail className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
          {tx(
            lang,
            'הישארו מעודכנים',
            'Stay in the loop',
            'ابقَ على اطلاع',
            'Будьте в курсе',
            'Μείνετε ενημερωμένοι'
          )}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          {tx(
            lang,
            'מבצעים, מנות חדשות ואירועים — ישירות למייל. בלי ספאם.',
            'Specials, new dishes & events — straight to your inbox. No spam.',
            'العروض والأطباق الجديدة والفعاليات — مباشرة إلى بريدك. بدون إزعاج.',
            'Акции, новые блюда и события — прямо на почту. Без спама.',
            'Προσφορές, νέα πιάτα & εκδηλώσεις — στο email σας. Χωρίς spam.'
          )}
        </p>

        {status === 'done' ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-100">
            <Check className="h-4 w-4" aria-hidden="true" />
            {tx(
              lang,
              'תודה! נשמור על קשר.',
              "Thanks! We'll be in touch.",
              'شكرًا! سنبقى على تواصل.',
              'Спасибо! Мы на связи.',
              'Ευχαριστούμε! Θα είμαστε σε επαφή.'
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              {tx(lang, 'כתובת מייל', 'Email address', 'البريد الإلكتروني', 'Email', 'Email')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder={tx(
                lang,
                'האימייל שלך',
                'your@email.com',
                'بريدك الإلكتروني',
                'ваш@email.com',
                'το@email.σας'
              )}
              aria-invalid={status === 'error'}
              className="flex-1 rounded-full border-0 px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta-300"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-terracotta-400 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-terracotta-500 active:scale-95 disabled:opacity-60"
            >
              {status === 'submitting' && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {tx(lang, 'הרשמה', 'Subscribe', 'اشتراك', 'Подписаться', 'Εγγραφή')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-200">
            {tx(
              lang,
              'אופס, נסו שוב או בדקו את כתובת המייל.',
              'Oops — please try again or check your email.',
              'عذرًا، حاول مرة أخرى أو تحقق من بريدك.',
              'Упс — попробуйте снова или проверьте email.',
              'Ωχ — δοκιμάστε ξανά ή ελέγξτε το email.'
            )}
          </p>
        )}
      </div>
    </section>
  );
}
