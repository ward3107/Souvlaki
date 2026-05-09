import { useEffect, useRef, useState } from 'react';
import { Star, X, Send, Frown, Meh, Smile, Heart } from 'lucide-react';

const PLACE_ID = 'ChIJwc9vQ-nNHRUROUo1ZqQ-z_k';
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
const STORAGE_KEY = 'rating_widget_submitted_v1';
const FEEDBACK_EMAIL =
  (import.meta.env.VITE_FEEDBACK_EMAIL as string | undefined) ?? 'info@greek-souvlaki.com';

interface RatingWidgetProps {
  language: string;
  isRtl: boolean;
}

type Step = 'select' | 'low' | 'high' | 'done';

const T: Record<string, Record<string, string>> = {
  he: {
    fab: 'דרגו אותנו',
    title: 'איך הייתה החוויה?',
    subtitle: 'דירוג מהיר — לוקח שניה',
    e1: 'גרוע',
    e2: 'בסדר',
    e3: 'טוב',
    e4: 'מצוין',
    low_title: 'מצטערים לשמוע',
    low_sub: 'מה אפשר לשפר? המשוב שלכם נשלח ישירות אלינו.',
    low_placeholder: 'ספרו לנו מה קרה (אופציונלי)…',
    send: 'שליחה',
    high_title: 'איזה כיף!',
    high_sub: 'אם נהניתם, נשמח אם תשתפו את זה ב-Google. זה לוקח רגע ועוזר לנו מאוד.',
    high_cta: 'כתבו ביקורת ב-Google',
    done_title: 'תודה רבה!',
    done_sub: 'המשוב שלכם התקבל.',
    close: 'סגור',
    skip: 'דלג',
  },
  ar: {
    fab: 'قيّمنا',
    title: 'كيف كانت تجربتك؟',
    subtitle: 'تقييم سريع — يستغرق ثانية',
    e1: 'سيء',
    e2: 'مقبول',
    e3: 'جيد',
    e4: 'ممتاز',
    low_title: 'نأسف لسماع ذلك',
    low_sub: 'ما الذي يمكن تحسينه؟ ملاحظاتك تصلنا مباشرة.',
    low_placeholder: 'أخبرنا بما حدث (اختياري)…',
    send: 'إرسال',
    high_title: 'يسعدنا ذلك!',
    high_sub: 'إذا أعجبك المكان، شاركنا تقييمك على Google — يستغرق لحظة ويعني لنا الكثير.',
    high_cta: 'اكتب تقييماً على Google',
    done_title: 'شكراً جزيلاً!',
    done_sub: 'تم استلام ملاحظاتك.',
    close: 'إغلاق',
    skip: 'تخطي',
  },
  ru: {
    fab: 'Оценить',
    title: 'Как вам у нас?',
    subtitle: 'Быстрая оценка — одно касание',
    e1: 'Плохо',
    e2: 'Нормально',
    e3: 'Хорошо',
    e4: 'Отлично',
    low_title: 'Жаль это слышать',
    low_sub: 'Что можно улучшить? Ваш отзыв придёт нам напрямую.',
    low_placeholder: 'Расскажите, что случилось (по желанию)…',
    send: 'Отправить',
    high_title: 'Очень рады!',
    high_sub:
      'Если вам понравилось, поделитесь отзывом на Google — это займёт минуту и очень нам поможет.',
    high_cta: 'Оставить отзыв на Google',
    done_title: 'Спасибо!',
    done_sub: 'Ваш отзыв получен.',
    close: 'Закрыть',
    skip: 'Пропустить',
  },
  el: {
    fab: 'Αξιολογήστε',
    title: 'Πώς ήταν η εμπειρία σας;',
    subtitle: 'Γρήγορη αξιολόγηση — διαρκεί ένα δευτερόλεπτο',
    e1: 'Κακή',
    e2: 'Μέτρια',
    e3: 'Καλή',
    e4: 'Εξαιρετική',
    low_title: 'Λυπούμαστε',
    low_sub: 'Τι θα μπορούσαμε να βελτιώσουμε; Το σχόλιό σας έρχεται απευθείας σε εμάς.',
    low_placeholder: 'Πείτε μας τι συνέβη (προαιρετικό)…',
    send: 'Αποστολή',
    high_title: 'Μας χαροποιεί!',
    high_sub: 'Αν σας άρεσε, μοιραστείτε το στο Google — διαρκεί μια στιγμή και μας βοηθά πολύ.',
    high_cta: 'Γράψτε κριτική στο Google',
    done_title: 'Ευχαριστούμε!',
    done_sub: 'Το σχόλιό σας ελήφθη.',
    close: 'Κλείσιμο',
    skip: 'Παράλειψη',
  },
  en: {
    fab: 'Rate us',
    title: 'How was your experience?',
    subtitle: 'Quick rating — takes a second',
    e1: 'Bad',
    e2: 'Okay',
    e3: 'Good',
    e4: 'Great',
    low_title: "We're sorry to hear that",
    low_sub: 'What could we improve? Your feedback comes straight to us.',
    low_placeholder: 'Tell us what happened (optional)…',
    send: 'Send',
    high_title: 'So glad to hear!',
    high_sub: "If you enjoyed it, we'd love a Google review — takes a moment and means a lot.",
    high_cta: 'Leave a Google review',
    done_title: 'Thank you!',
    done_sub: 'Your feedback has been received.',
    close: 'Close',
    skip: 'Skip',
  },
};

const tt = (lang: string, key: keyof typeof T.en) => (T[lang] ?? T.en)[key] ?? T.en[key];

const FACES = [
  {
    score: 1,
    Icon: Frown,
    color: 'text-rose-500',
    bg: 'hover:bg-rose-50 dark:hover:bg-rose-900/20',
    labelKey: 'e1' as const,
  },
  {
    score: 2,
    Icon: Meh,
    color: 'text-amber-500',
    bg: 'hover:bg-amber-50 dark:hover:bg-amber-900/20',
    labelKey: 'e2' as const,
  },
  {
    score: 3,
    Icon: Smile,
    color: 'text-lime-500',
    bg: 'hover:bg-lime-50 dark:hover:bg-lime-900/20',
    labelKey: 'e3' as const,
  },
  {
    score: 4,
    Icon: Heart,
    color: 'text-emerald-500',
    bg: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20',
    labelKey: 'e4' as const,
  },
];

export default function RatingWidget({ language, isRtl }: RatingWidgetProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('select');
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  // Lazy initial state — read localStorage once at mount instead of in an
  // effect, so we don't cascade-render on first paint.
  const [hidden, setHidden] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const closePanel = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('select');
      setScore(null);
      setComment('');
    }, 200);
    fabRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && step === 'low') {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [open, step]);

  const markSubmitted = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setHidden(true);
  };

  const handleSelect = (s: number) => {
    setScore(s);
    setStep(s >= 3 ? 'high' : 'low');
  };

  const handleSendLow = () => {
    const subject = encodeURIComponent(`Feedback (${score}/4) — Greek Souvlaki`);
    const body = encodeURIComponent(
      `Rating: ${score}/4\n\n${comment || '(no comment)'}\n\n— Sent from the website rating widget`
    );
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
    setStep('done');
    markSubmitted();
    setTimeout(closePanel, 1800);
  };

  const handleHighCta = () => {
    window.open(WRITE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    setStep('done');
    markSubmitted();
    setTimeout(closePanel, 1800);
  };

  if (hidden) return null;

  const sideClass = isRtl ? 'right-6' : 'left-6';

  return (
    <>
      <button
        ref={fabRef}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 ${sideClass} z-40 group flex items-center gap-2 bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-full shadow-lift hover:shadow-pop transition-all duration-300 hover:scale-105 px-4 h-14 [body.cart-active_&]:hidden`}
        aria-label={tt(language, 'fab')}
        aria-expanded={open}
        aria-haspopup="dialog"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <Star className="w-6 h-6 fill-current" aria-hidden="true" />
        <span className="font-semibold text-sm hidden sm:inline whitespace-nowrap">
          {tt(language, 'fab')}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start p-4 sm:p-6 bg-black/30 backdrop-blur-sm animate-fade-in"
          onClick={closePanel}
          role="presentation"
        >
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rating-widget-title"
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`relative w-full sm:w-96 sm:max-w-[calc(100vw-3rem)] bg-white dark:bg-slate-800 rounded-3xl shadow-pop border border-gray-100 dark:border-slate-700 p-6 ${
              isRtl ? 'sm:mr-auto sm:ml-0' : 'sm:ml-auto sm:mr-0'
            } sm:fixed sm:bottom-24 ${isRtl ? 'sm:right-6' : 'sm:left-6'}`}
          >
            <button
              onClick={closePanel}
              aria-label={tt(language, 'close')}
              className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {step === 'select' && (
              <div>
                <h3
                  id="rating-widget-title"
                  className="font-display text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
                >
                  {tt(language, 'title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tt(language, 'subtitle')}
                </p>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {FACES.map(({ score: s, Icon, color, bg, labelKey }) => (
                    <button
                      key={s}
                      onClick={() => handleSelect(s)}
                      className={`group flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-gray-100 dark:border-slate-700 ${bg} transition-all hover:scale-105 hover:border-transparent active:scale-95`}
                      aria-label={tt(language, labelKey)}
                    >
                      <Icon
                        className={`w-9 h-9 ${color} transition-transform group-hover:scale-110`}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                        {tt(language, labelKey)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'low' && (
              <div>
                <h3
                  id="rating-widget-title"
                  className="font-display text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
                >
                  {tt(language, 'low_title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tt(language, 'low_sub')}
                </p>
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={tt(language, 'low_placeholder')}
                  rows={4}
                  className="mt-4 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent resize-none"
                />
                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    onClick={closePanel}
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {tt(language, 'skip')}
                  </button>
                  <button
                    onClick={handleSendLow}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-brand-blue-500 hover:bg-brand-blue-600 text-white shadow-soft hover:shadow-lift transition-all"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    {tt(language, 'send')}
                  </button>
                </div>
              </div>
            )}

            {step === 'high' && (
              <div>
                <h3
                  id="rating-widget-title"
                  className="font-display text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
                >
                  {tt(language, 'high_title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tt(language, 'high_sub')}
                </p>
                <div className="mt-5 flex gap-2 justify-end">
                  <button
                    onClick={closePanel}
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    {tt(language, 'skip')}
                  </button>
                  <button
                    onClick={handleHighCta}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-brand-blue-500 hover:bg-brand-blue-600 text-white shadow-soft hover:shadow-lift transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#FFFFFF"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        opacity="0.95"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        opacity="0.9"
                      />
                    </svg>
                    {tt(language, 'high_cta')}
                  </button>
                </div>
              </div>
            )}

            {step === 'done' && (
              <div className="text-center py-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-brand-blue-50 dark:bg-brand-blue-900/30 flex items-center justify-center mb-3">
                  <Heart className="w-7 h-7 text-brand-blue-500 fill-current" aria-hidden="true" />
                </div>
                <h3
                  id="rating-widget-title"
                  className="font-display text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
                >
                  {tt(language, 'done_title')}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {tt(language, 'done_sub')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
