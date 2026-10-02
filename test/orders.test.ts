import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insert, update, eq, select } = vi.hoisted(() => ({
  insert: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  select: vi.fn(),
}));
vi.mock('../utils/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: () => ({ insert, update }) },
}));
import { recordOrder, confirmOrder, isConfirmedOrder, type OrderRow } from '../utils/orders';

const order = {
  customerName: 'Sam',
  customerNote: 'No onions',
  total: 30,
  items: [{ q: 1, n: 'Pita', p: 30 }],
  lang: 'en',
};

beforeEach(() => {
  sessionStorage.clear();
  vi.clearAllMocks();
  insert.mockResolvedValue({ error: null });
  update.mockReturnValue({ eq });
  eq.mockReturnValue({ eq, select });
  select.mockResolvedValue({ data: [{ id: 'attempt' }], error: null });
});

describe('WhatsApp order attempts', () => {
  it('stores an unconfirmed attempt and deduplicates repeated handoffs', async () => {
    await recordOrder(order);
    await recordOrder(order);
    const first = insert.mock.calls[0][0];
    expect(first.status).toBe('pending_whatsapp');
    expect(first.customer_note).toBe('No onions');
    expect(insert.mock.calls[1][0].id).toBe(first.id);
  });
  it('creates a new attempt when the customer changes the note', async () => {
    await recordOrder(order);
    await recordOrder({ ...order, customerNote: 'Extra onions' });
    expect(insert.mock.calls[1][0].id).not.toBe(insert.mock.calls[0][0].id);
  });
  it('allows a new identical order after the deduplication window', async () => {
    await recordOrder(order);
    const stored = JSON.parse(sessionStorage.getItem('souvlaki-order-attempt-v1')!);
    stored.at = Date.now() - 11 * 60 * 1000;
    sessionStorage.setItem('souvlaki-order-attempt-v1', JSON.stringify(stored));
    await recordOrder(order);
    expect(insert.mock.calls[1][0].id).not.toBe(insert.mock.calls[0][0].id);
  });
  it('keeps checkout available when saving fails', async () => {
    insert.mockRejectedValue(new Error('Offline'));
    await expect(recordOrder(order)).resolves.toBeUndefined();
  });
  it('excludes pending attempts from confirmed sales', () => {
    const row = { ...order, status: 'pending_whatsapp' } as unknown as OrderRow;
    expect(isConfirmedOrder(row)).toBe(false);
    expect(isConfirmedOrder({ ...row, status: 'received' })).toBe(true);
    expect(isConfirmedOrder({ ...row, status: 'served' })).toBe(true);
  });
  it('requires a successful database update before confirming locally', async () => {
    select.mockResolvedValue({ data: [], error: null });
    await expect(confirmOrder('attempt')).rejects.toThrow('Order was not confirmed');
    expect(eq).toHaveBeenCalledWith('status', 'pending_whatsapp');
  });
});
