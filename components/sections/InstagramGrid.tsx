import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { InstagramIcon } from '../BrandIcons';
import { Language } from '../../types';
import { tx } from '../../utils/i18n';

interface Props {
  lang: Language;
  galleryImages: string[];
}

const PROFILE_URL = 'https://www.instagram.com/greek.souvlakii';

// Optional live-feed endpoint (e.g. Behold.so, EmbedSocial, or a small
// serverless proxy to the Instagram Graph API). Must return JSON that is either
// an array of post objects ({ media_url|mediaUrl|thumbnail, permalink }) or a
// plain array of image URLs. When unset or unreachable, we fall back to the
// bundled gallery so the section always renders.
const FEED_URL = import.meta.env.VITE_INSTAGRAM_FEED_URL as string | undefined;
const CACHE_KEY = 'ig-feed-cache-v1';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6h — refresh a few times a day at most

interface Photo {
  src: string;
  link: string;
}

interface CacheShape {
  at: number;
  photos: Photo[];
}

// Normalise assorted feed shapes into our {src, link} photos.
function parseFeed(data: unknown): Photo[] {
  const arr = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown[] })?.data)
      ? (data as { data: unknown[] }).data
      : [];
  const photos: Photo[] = [];
  for (const entry of arr) {
    if (typeof entry === 'string') {
      photos.push({ src: entry, link: PROFILE_URL });
      continue;
    }
    const o = entry as Record<string, unknown>;
    const src = (o.media_url || o.mediaUrl || o.thumbnail || o.thumbnailUrl || o.src) as
      string | undefined;
    if (src) {
      photos.push({ src, link: (o.permalink as string) || PROFILE_URL });
    }
  }
  return photos.slice(0, 8);
}

function freshCache(): Photo[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CacheShape;
    if (cached?.photos?.length && Date.now() - cached.at < CACHE_TTL) {
      return cached.photos;
    }
  } catch {
    // ignore parse/storage errors
  }
  return null;
}

export default function InstagramGrid({ lang, galleryImages }: Props) {
  // Serve a fresh-enough cache immediately (no flash / refetch); otherwise the
  // bundled gallery is the initial and fallback state.
  const [photos, setPhotos] = useState<Photo[]>(() => {
    if (FEED_URL) {
      const cached = freshCache();
      if (cached) return cached;
    }
    return galleryImages.slice(0, 8).map((src) => ({ src, link: PROFILE_URL }));
  });

  useEffect(() => {
    if (!FEED_URL) return;
    // A fresh cache already seeded state — no fetch needed this visit.
    if (freshCache()) return;

    let cancelled = false;
    fetch(FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json) => {
        const parsed = parseFeed(json);
        if (!cancelled && parsed.length) {
          setPhotos(parsed);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), photos: parsed }));
          } catch {
            // ignore storage failures
          }
        }
      })
      .catch(() => {
        // keep the bundled fallback on any failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-terracotta-400 rounded-2xl mb-4 shadow-soft">
            <InstagramIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
            {tx(
              lang,
              'עקבו אחרינו באינסטגרם',
              'Follow Us on Instagram',
              'تابعنا على إنستغرام',
              'Подпишитесь на нас в Instagram',
              'Ακολουθήστε μας στο Instagram'
            )}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            {tx(
              lang,
              'צפו/י בתמונות הכי עדכניות של המנות המיוחדות שלנו, האווירה והעוד.',
              'Check out the latest photos of our signature dishes, atmosphere, and more.',
              'شاهد أحدث الصور لأطباقنا المميزة والأجواء والمزيد.',
              'Смотрите последние фото наших фирменных блюд, атмосферы и многого другого.',
              'Δείτε τις τελευταίες φωτογραφίες από τα σπεσιαλιτέ μας, την ατμόσφαιρα και πολλά άλλα.'
            )}
          </p>
          <a
            href="https://www.instagram.com/greek.souvlakii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-terracotta-400 hover:bg-brand-terracotta-500 text-white rounded-full font-semibold shadow-soft hover:shadow-lift transition-all duration-300"
          >
            <InstagramIcon className="w-5 h-5" />
            <span>@greek.souvlakii</span>
          </a>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {photos.map((photo, idx) => (
              <PhotoCard key={`${photo.src}-${idx}`} img={photo.src} link={photo.link} />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/greek.souvlakii"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-terracotta-400 text-brand-terracotta-400 rounded-full font-semibold hover:bg-brand-terracotta-400 hover:text-white transition-all duration-300"
          >
            {tx(
              lang,
              'עוד תמונות באינסטגרם →',
              'More Photos on Instagram →',
              'المزيد من الصور على إنستغرام →',
              'Больше фото в Instagram →',
              'Περισσότερες φωτογραφίες στο Instagram →'
            )}
          </a>
        </div>
      </div>
    </section>
  );
}

function PhotoCard({ img, link }: { img: string; link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-square rounded-xl overflow-hidden group shadow-soft hover:shadow-lift transition-shadow duration-300 block"
    >
      <div className="relative w-full h-full">
        <img
          src={img}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
            <Heart className="w-5 h-5 fill-white" />
            <InstagramIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/70 rounded-full p-1.5 shadow-soft opacity-0 group-hover:opacity-100 transition-opacity">
          <InstagramIcon className="w-4 h-4 text-pink-600" />
        </div>
      </div>
    </a>
  );
}
