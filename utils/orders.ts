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
  served_at: string | null;
  served_elapsed_sec: number | null;
}

export interface NewOrder {
  customerName: string;
  total: number;
  items: OrderItem[];
  lang: string;
}

/** Persist an order at checkout. Fire-and-forget; never blocks the WhatsApp handoff. */
export async function recordOrder(order: NewOrder): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('orders').insert({
      customer_name: order.customerName,
      total: order.total,
      items: order.items,
      lang: order.lang,
      status: 'received',
    });
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
