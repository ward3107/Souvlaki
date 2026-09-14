type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M14 8h3V4.2c-.5-.1-2.2-.2-4.1-.2C9 4 6.4 6.4 6.4 10.8V14H3v4.2h3.4V24h4.2v-5.8h3.5l.6-4.2h-4.1v-2.8C10.6 9.4 11.1 8 14 8Z" />
    </svg>
  );
}
