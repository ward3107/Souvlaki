/**
 * Canonical public business details.
 *
 * Keep customer-facing components pointed at this object so phone numbers,
 * opening hours, location links, and social profiles cannot drift apart.
 */
export const BUSINESS_INFO = {
  phone: {
    display: '04-812-2980',
    href: 'tel:048122980',
  },
  whatsapp: {
    display: '052-892-1454',
    international: '972528921454',
    href: 'https://wa.me/972528921454',
  },
  hours: {
    openDays: [3, 4, 5, 6] as const,
    opensAtHour: 13,
    closesAtHour: 0,
    display: '13:00–00:00',
    displaySpaced: '13:00 - 00:00',
  },
  location: {
    latitude: 32.9556,
    longitude: 35.1636,
    wazeUrl: 'https://waze.com/ul?ll=32.9556,35.1636&navigate=yes',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Greek+Souvlaki+Kafr+Yasif',
  },
  social: {
    instagramHandle: '@greek.souvlakii',
    instagramUrl: 'https://www.instagram.com/greek.souvlakii',
    facebookUrl: 'https://www.facebook.com/profile.php?id=100089667506328',
  },
} as const;
