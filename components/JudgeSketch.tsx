import type { ReactNode } from "react";

// Hver dommer får egen frisyre. Ansiktet er tomt, så de holder seg anonyme.
const HAIR: ReactNode[] = [
  <path key="kort" d="M70 112c-4-50 26-68 52-68s52 16 48 66c-10-22-30-34-52-34s-38 12-48 36Z" />,
  <>
    <circle cx="120" cy="40" r="17" />
    <path d="M68 118c-6-44 22-66 52-66s58 22 52 66c-8-26-28-40-52-40s-44 14-52 40Z" />
  </>,
  <path key="langt" d="M62 196c-14-40-8-152 58-152s72 112 58 152c-8 6-16 4-22-2 8-34 8-66-4-92-14-14-50-14-64 0-12 26-12 58-4 92-6 6-14 8-22 2Z" />,
  <>
    <path d="M72 100c0-36 22-52 48-52s48 16 48 52c-14-14-30-20-48-20s-34 6-48 20Z" />
    <path d="M70 134c2 38 24 56 50 56s48-18 50-56c-8 8-16 12-22 12-8-4-18-6-28-6s-20 2-28 6c-6 0-14-4-22-12Z" />
  </>,
  <>
    <circle cx="74" cy="88" r="20" />
    <circle cx="96" cy="60" r="22" />
    <circle cx="130" cy="52" r="24" />
    <circle cx="160" cy="72" r="21" />
    <circle cx="170" cy="100" r="16" />
  </>,
  <>
    <path d="M78 84c2-30 18-46 42-46s40 16 42 46Z" />
    <path d="M46 88c20-8 128-8 148 0" fill="none" stroke="currentColor" strokeWidth="9" />
  </>,
];

export function JudgeSketch({ index, label }: { index: number; label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 240 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block size-full text-ink"
    >
      <g transform="translate(0 32)">
        <ellipse cx="120" cy="124" rx="50" ry="62" />
        <g fill="currentColor" stroke="none">
          {HAIR[index % HAIR.length]}
        </g>
      </g>
    </svg>
  );
}
