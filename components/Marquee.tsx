import type { ReactNode } from 'react';

interface MarqueeProps {
  items: string[];
  durationSec?: number;
  separator?: ReactNode;
  className?: string;
}

export default function Marquee({
  items,
  durationSec = 35,
  separator,
  className = '',
}: MarqueeProps) {
  const sep = separator ?? <span aria-hidden="true">•</span>;
  const sequence = (
    <div className="flex items-center gap-12 px-6 shrink-0">
      {items.map((label, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>{label}</span>
          <span className="opacity-60">{sep}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none border-y border-brand-blue-100/30 bg-brand-blue-500 text-white py-5 ${className}`}
      aria-hidden="true"
    >
      <div
        className="flex marquee-track"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {sequence}
        {sequence}
      </div>
      <style>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          width: max-content;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
