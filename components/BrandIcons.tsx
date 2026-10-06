type IconProps = { className?: string };

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM21 13.5c0-3.4-1.8-5.2-4.3-5.2-2 0-2.9 1.1-3.4 1.8V8.5H10V21h3.5v-7c0-1.8.8-2.7 2.2-2.7s1.8 1 1.8 2.7v7H21v-7.5Z" />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-3 0 0 1-.3 3.1 1.2a10.7 10.7 0 0 1 5.8 0c2.1-1.5 3.1-1.2 3.1-1.2.6 1.6.2 2.7.1 3 .8.8 1.2 1.8 1.2 3 0 4.3-2.8 5.3-5.4 5.6.4.4.8 1.1.8 2.2V22c0 .3.2.7.8.6A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}

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
