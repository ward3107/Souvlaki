import React, { useId } from 'react';

interface BrandLogoProps {
  className?: string;
  markOnly?: boolean;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', markOnly = false }) => {
  const id = useId().replace(/:/g, '');
  const leftGradient = `${id}-left`;
  const rightGradient = `${id}-right`;
  const foldGradient = `${id}-fold`;

  return (
    <svg
      viewBox={markOnly ? '0 0 454 400' : '0 0 340 80'}
      role="img"
      aria-label="vasia.dev"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id={leftGradient}
          x1="42"
          y1="36"
          x2="242"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7C3CFF" />
          <stop offset="0.48" stopColor="#483AA0" />
          <stop offset="1" stopColor="#17175B" />
        </linearGradient>
        <linearGradient
          id={rightGradient}
          x1="318"
          y1="42"
          x2="171"
          y2="327"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#19DDF2" />
          <stop offset="0.45" stopColor="#178CE9" />
          <stop offset="1" stopColor="#4A38D7" />
        </linearGradient>
        <linearGradient
          id={foldGradient}
          x1="146"
          y1="318"
          x2="220"
          y2="362"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE56" />
          <stop offset="1" stopColor="#E88A21" />
        </linearGradient>
      </defs>

      <g transform={markOnly ? undefined : 'translate(2 5) scale(.175)'} aria-hidden="true">
        <path
          d="M44 52C38 41 45 28 58 28H114C124 28 133 34 137 43L242 282L205 365C199 378 181 378 175 365L44 52Z"
          fill={`url(#${leftGradient})`}
        />
        <path
          d="M114 28H151C160 28 168 33 172 42L250 219L318 45C322 35 332 28 343 28H394C407 28 415 41 410 52L266 365C260 378 242 378 236 365L114 88V28Z"
          fill={`url(#${rightGradient})`}
        />
        <path
          d="M205 365L236 296L266 365C260 378 242 378 236 365L221 332L205 365Z"
          fill={`url(#${foldGradient})`}
        />
        <path
          d="M58 28H114C124 28 133 34 137 43L145 61H76L44 52C38 41 45 28 58 28Z"
          fill="#A978FF"
          opacity=".34"
        />
        <path
          d="M343 28H394C407 28 415 41 410 52L402 69H324L332 45C336 35 343 28 343 28Z"
          fill="#7AF1FF"
          opacity=".42"
        />
      </g>

      {!markOnly && (
        <g className="font-heading font-bold" aria-hidden="true">
          <text x="84" y="54" fill="currentColor" fontSize="39" letterSpacing="-2">
            vasia
          </text>
          <text x="176" y="54" fill="currentColor" fontSize="39" letterSpacing="-2">
            <tspan fill="#d4af37">.</tspan>
            <tspan>dev</tspan>
          </text>
        </g>
      )}
    </svg>
  );
};

export default BrandLogo;
