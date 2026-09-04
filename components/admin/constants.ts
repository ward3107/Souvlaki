import type { Lang, LocalizedString } from '../../utils/menuData';

// Owner console at /admin — unlinked from the customer site.
//   • With Supabase configured: an owner dashboard (overview, full menu manager,
//     order history), behind an email+password login.
//   • Without it: a device-local PIN + localStorage editor (fallback).
export const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || '1234';

export const LANGS: Lang[] = ['en', 'he', 'ar', 'ru', 'el'];
export const emptyLoc = (): LocalizedString => ({ en: '', he: '', ar: '', ru: '', el: '' });
