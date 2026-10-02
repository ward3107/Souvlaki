import { supabase, isSupabaseConfigured } from './supabase';

// Order history persistence. When Supabase is configured, each WhatsApp order is
// recorded so the owner has cross-device reporting; otherwise these are no-ops
// and ordering still works exactly as before (WhatsApp handoff only).

export interface OrderItem {
  q: number; // quantity
  n: string; // name
  v?: string; // variant label
  p: number; // line total (shekels)
}

export interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string | null;
  total: number | null;
  items: OrderItem[] | null;
  lang: string | null;
  status: string;
  customer_note?: string | null;
  served_at: string | null;
  served_elapsed_sec: number | null;
}

export interface NewOrder {
  customerName: string;
  total: number;
  items: OrderItem[];
  lang: string;
  customerNote?: string;
}

const ATTEMPT_KEY = 'souvlaki-order-attempt-v1';
let lastAttempt: { payload: string; id: string; at: number } | undefined;

function attemptId(order: NewOrder): string {
  const payload = JSON.stringify(order);
  try {
    lastAttempt = JSON.parse(sessionStorage.getItem(ATTEMPT_KEY) ?? 'null') ?? lastAttempt;
  } catch {
    // In-memory deduplication still works when browser storage is unavailable.
  }
  if (lastAttempt?.payload === payload && Date.now() - lastAttempt.at < 10 * 60 * 1000) {
    return lastAttempt.id;
  }
  lastAttempt = { payload, id: crypto.randomUUID(), at: Date.now() };
  try {
    sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(lastAttempt));
  } catch {
    // The order handoff must remain available in private browsing.
  }
  return lastAttempt.id;
}

export const isConfirmedOrder = (order: OrderRow): boolean =>
  order.status === 'received' || order.status === 'served';

export async function confirmOrder(id: string): Promise<void> {
  if (!supabase) throw new Error('Order storage is unavailable');
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'received' })
    .eq('id', id)
    .eq('status', 'pending_whatsapp')
    .select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Order was not confirmed');
}

/** Persist an order at checkout. Fire-and-forget; never blocks the WhatsApp handoff. */
export async function recordOrder(order: NewOrder): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('orders').insert({
      id: attemptId(order),
      customer_name: order.customerName,
      customer_note: order.customerNote || null,
      total: order.total,
      items: order.items,
      lang: order.lang,
      status: 'pending_whatsapp',
    });
    // A duplicate UUID means this exact attempt is already stored. Plain insert
    // avoids requiring SELECT access, which anonymous customers must never have.
    if (error && error.code !== '23505')
      console.warn('Order attempt could not be saved', error.code);
  } catch {
    // A failed insert must never affect the customer's order.
  }
}

/** Owner-only: most recent orders for the reporting view. */
export async function fetchRecentOrders(limit = 50): Promise<OrderRow[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as OrderRow[];
}
