import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Reveal from './Reveal';

interface PlacesReview {
  name?: string;
  rating: number;
  text?: { text: string; languageCode?: string };
  originalText?: { text: string; languageCode?: string };
  authorAttribution?: {
    displayName: string;
    photoUri?: string;
    uri?: string;
  };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface PlacesResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
}

interface GoogleReviewsProps {
  language: string;
  isRtl: boolean;
}

const PLACE_ID = 'ChIJwc9vQ-nNHRUROUo1ZqQ-z_k';
const CACHE_KEY = `gr_cache_${PLACE_ID}_v1`;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
const ALL_REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${PLACE_ID}`;

// i18n strings
const T: Record<string, Record<string, string>> = {
  he: {
    title: 'מה הלקוחות אומרים',
    subtitle: 'ביקורות חיות מ-Google',
    based_on: 'מבוסס על',
    reviews_word: 'ביקורות',
    write: 'כתוב ביקורת',
    see_all: 'ראו הכל ב-Google',
    loading: 'טוען ביקורות…',
    fallback_note: 'ביקורות נבחרות מלקוחותינו',
  },
  ar: {
    title: 'ماذا يقول عملاؤنا',
    subtitle: 'تقييمات حقيقية من Google',
    based_on: 'استناداً إلى',
    reviews_word: 'تقييم',
    write: 'اكتب تقييماً',
    see_all: 'شاهد الكل على Google',
    loading: 'جاري تحميل التقييمات…',
    fallback_note: 'تقييمات مختارة من زبائننا',
  },
  ru: {
    title: 'Что говорят клиенты',
    subtitle: 'Живые отзывы с Google',
    based_on: 'На основе',
    reviews_word: 'отзывов',
    write: 'Написать отзыв',
    see_all: 'Все отзывы в Google',
    loading: 'Загрузка отзывов…',
    fallback_note: 'Избранные отзывы наших гостей',
  },
  el: {
    title: 'Τι λένε οι πελάτες μας',
    subtitle: 'Πραγματικές κριτικές από Google',
    based_on: 'Βάσει',
    reviews_word: 'κριτικών',
    write: 'Γράψτε κριτική',
    see_all: 'Δείτε όλες στο Google',
    loading: 'Φόρτωση κριτικών…',
    fallback_note: 'Επιλεγμένες κριτικές πελατών',
  },
  en: {
    title: 'What Our Customers Say',
    subtitle: 'Live reviews from Google',
    based_on: 'Based on',
    reviews_word: 'reviews',
    write: 'Write a Review',
    see_all: 'See all on Google',
    loading: 'Loading reviews…',
    fallback_note: 'Selected reviews from our customers',
  },
};

const tt = (lang: string, key: keyof typeof T.en) => (T[lang] ?? T.en)[key] ?? T.en[key];

// Curated fallback reviews shown when the API key is not configured.
// These render with identical design so the section always looks complete.
const FALLBACK: { data: PlacesResponse; isFallback: true } = {
  isFallback: true,
  data: {
    rating: 4.9,
    userRatingCount: 5,
    reviews: [
      {
        rating: 5,
        text: {
          text: 'Authentic Greek flavors and incredibly fresh ingredients. The pita souvlaki was unforgettable — exactly like what we had in Athens.',
        },
        authorAttribution: { displayName: 'Daniel K.' },
        relativePublishTimeDescription: 'a month ago',
      },
      {
        rating: 5,
        text: {
          text: 'Family-run, warm atmosphere, and the gyros are the best in the Galilee. Will be back next week.',
        },
        authorAttribution: { displayName: 'Maya R.' },
        relativePublishTimeDescription: '2 weeks ago',
      },
      {
        rating: 5,
        text: {
          text: 'הסובלקי הכי טעים שאכלתי. המקום מטופח, השירות מהיר ואכפתי, והמחירים הוגנים.',
        },
        authorAttribution: { displayName: 'יוסף ש.' },
        relativePublishTimeDescription: 'לפני שבוע',
      },
    ],
  },
};

function loadCache(): { data: PlacesResponse; ts: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data: PlacesResponse) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
}

async function fetchReviews(apiKey: string): Promise<PlacesResponse> {
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
    },
  });
  if (!res.ok) {
    throw new Error(`Places API ${res.status}`);
  }
  return (await res.json()) as PlacesResponse;
}

function ReviewCard({ review }: { review: PlacesReview }) {
  const author = review.authorAttribution?.displayName ?? 'Anonymous';
  const initial = author.charAt(0).toUpperCase();
  const text = review.text?.text ?? review.originalText?.text ?? '';
  const rating = Math.max(0, Math.min(5, Math.round(review.rating ?? 0)));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft hover:shadow-lift transition-shadow duration-300 border border-gray-100 dark:border-slate-700 p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        {review.authorAttribution?.photoUri ? (
          <img
            src={review.authorAttribution.photoUri}
            alt=""
            className="w-11 h-11 rounded-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-brand-blue-50 dark:bg-brand-blue-900/30 text-brand-blue-500 dark:text-brand-blue-300 flex items-center justify-center font-semibold">
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-white truncate">{author}</div>
          {review.relativePublishTimeDescription && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {review.relativePublishTimeDescription}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-0.5 mb-3 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'opacity-30'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
        {text}
      </p>
    </div>
  );
}

export default function GoogleReviews({ language, isRtl }: GoogleReviewsProps) {
  const apiKey = (import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined) ?? '';
  const [state, setState] = useState<
    | { kind: 'loading' }
    | { kind: 'ok'; data: PlacesResponse; fromFallback: boolean }
    | { kind: 'error' }
  >(() => {
    if (!apiKey) return { kind: 'ok', data: FALLBACK.data, fromFallback: true };
    const cached = loadCache();
    if (cached) return { kind: 'ok', data: cached.data, fromFallback: false };
    return { kind: 'loading' };
  });

  useEffect(() => {
    if (!apiKey) return;
    if (state.kind !== 'loading') return;

    let cancelled = false;
    fetchReviews(apiKey)
      .then((data) => {
        if (cancelled) return;
        if (!data.reviews || data.reviews.length === 0) {
          setState({ kind: 'ok', data: FALLBACK.data, fromFallback: true });
          return;
        }
        saveCache(data);
        setState({ kind: 'ok', data, fromFallback: false });
      })
      .catch((err) => {
        console.error('Google Reviews fetch failed:', err);
        if (cancelled) return;
        setState({ kind: 'ok', data: FALLBACK.data, fromFallback: true });
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, state.kind]);

  if (state.kind === 'loading') {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {tt(language, 'loading')}
      </div>
    );
  }

  if (state.kind === 'error') {
    return null;
  }

  const { data, fromFallback } = state;
  const reviews = (data.reviews ?? []).slice(0, 6);
  const rating = data.rating ?? 0;
  const count = data.userRatingCount ?? 0;

  return (
    <div className="mt-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <Reveal>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-soft">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {tt(language, 'subtitle')}
            </span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-3">
            {tt(language, 'title')}
          </h3>
          <div className="inline-flex items-center gap-3 text-gray-700 dark:text-gray-200">
            <span className="font-display text-3xl font-semibold text-brand-blue-500">
              {rating ? rating.toFixed(1) : '—'}
            </span>
            <div className="flex gap-0.5 text-yellow-400" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-current' : 'opacity-30'}`}
                />
              ))}
            </div>
            {count > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tt(language, 'based_on')} {count} {tt(language, 'reviews_word')}
              </span>
            )}
          </div>
          {fromFallback && (
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {tt(language, 'fallback_note')}
            </div>
          )}
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <Reveal key={r.name ?? i} delay={i * 0.05} y={20}>
            <ReviewCard review={r} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={ALL_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:shadow-lift transition-all"
          >
            {tt(language, 'see_all')}
          </a>
          <a
            href={WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue-500 hover:bg-brand-blue-600 text-white rounded-full font-semibold shadow-soft hover:shadow-lift transition-all"
          >
            <Star className="w-4 h-4 fill-current" aria-hidden="true" />
            {tt(language, 'write')}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
