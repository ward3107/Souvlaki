import { Language } from '../types';
import { isSupabaseConfigured } from '../utils/supabase';
import SupabaseAdmin from './admin/SupabaseAdmin';
import LocalAdmin from './admin/LocalAdmin';

// Owner console at /admin — unlinked from the customer site.
//   • With Supabase configured: an owner dashboard (overview, full menu manager,
//     order history), behind an email+password login.
//   • Without it: a device-local PIN + localStorage editor (fallback).

export default function Admin({ lang }: { lang: Language }) {
  return isSupabaseConfigured ? <SupabaseAdmin lang={lang} /> : <LocalAdmin lang={lang} />;
}
