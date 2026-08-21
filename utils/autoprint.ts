// Per-device "this is the kitchen printer" flag. When on, the /ticket page
// prints itself the moment it opens, so the owner only has to tap the order
// link (pair with Chrome's --kiosk-printing to skip the print dialog entirely).
// Off by default, so a customer who ever opens a ticket link never gets a
// surprise print dialog.
const KEY = 'ticket-autoprint-v1';

export function getAutoPrint(): boolean {
  try {
    return localStorage.getItem(KEY) === 'on';
  } catch {
    return false;
  }
}

export function setStoredAutoPrint(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // storage unavailable — auto-print just won't persist across reloads
  }
}
