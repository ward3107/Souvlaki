// Order → shareable link payload, with no backend. The whole order is packed
// (UTF-8 safe, base64url) into the URL hash of a /ticket link that rides inside
// the WhatsApp message. The owner taps it to open a printable kitchen ticket.
// Using the hash keeps the data client-side only — it is never sent to a server.

export type TicketItem = { q: number; n: string; v?: string; p: number };
export type TicketOrder = { n: string; t: number; at: number; items: TicketItem[] };

function toB64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeTicket(order: TicketOrder): string {
  return toB64Url(JSON.stringify(order));
}

export function decodeTicket(hash: string): TicketOrder | null {
  try {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!raw) return null;
    const obj = JSON.parse(fromB64Url(raw));
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.items)) return null;
    return obj as TicketOrder;
  } catch {
    return null;
  }
}
