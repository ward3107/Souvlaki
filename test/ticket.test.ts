import { describe, expect, it } from 'vitest';
import { decodeTicket, encodeTicket, type TicketOrder } from '../utils/ticket';

const order: TicketOrder = {
  n: 'Sam',
  note: 'No onions',
  t: 45,
  at: 1_700_000_000_000,
  items: [{ q: 1, n: 'Souvlaki', v: 'Chicken', p: 45 }],
};

describe('ticket payload', () => {
  it('round-trips a valid order including its note', () => {
    expect(decodeTicket(`#${encodeTicket(order)}`)).toEqual(order);
  });

  it('rejects structurally unsafe payloads', () => {
    expect(decodeTicket(`#${encodeTicket({ ...order, items: [null] } as never)}`)).toBeNull();
    expect(decodeTicket(`#${encodeTicket({ ...order, note: 'x'.repeat(241) })}`)).toBeNull();
    expect(decodeTicket(`#${encodeTicket({ ...order, t: 999 })}`)).toBeNull();
  });
});
