import type { ReactNode } from "react";

// Hver dommer får egen frisyre og egne klær. Bindet holder dem anonyme.
const DETAILS: { hair: ReactNode; clothes: ReactNode }[] = [
  {
    hair: <path d="M70 112c-4-50 26-68 52-68s52 16 48 66c-10-22-30-34-52-34s-38 12-48 36Z" fill="currentColor" />,
    clothes: (
      <>
        <path d="M120 218l-16-10v20l16-10 16 10v-20l-16 10Z" fill="currentColor" />
        <path d="M84 206l36 44 36-44" />
      </>
    ),
  },
  {
    hair: (
      <>
        <circle cx="120" cy="40" r="17" fill="currentColor" />
        <path d="M68 118c-6-44 22-66 52-66s58 22 52 66c-8-26-28-40-52-40s-44 14-52 40Z" fill="currentColor" />
      </>
    ),
    clothes: <path d="M92 206v94M148 206v94M92 236h56" />,
  },
  {
    hair: <path d="M62 196c-14-40-8-152 58-152s72 112 58 152c-8 6-16 4-22-2 8-34 8-66-4-92-14-14-50-14-64 0-12 26-12 58-4 92-6 6-14 8-22 2Z" fill="currentColor" />,
    clothes: <path d="M120 212v88M100 216l20 22 20-22" />,
  },
  {
    hair: (
      <>
        <path d="M72 100c0-36 22-52 48-52s48 16 48 52c-14-14-30-20-48-20s-34 6-48 20Z" fill="currentColor" />
        <path d="M70 134c2 38 24 56 50 56s48-18 50-56c-8 8-16 12-22 12-8-4-18-6-28-6s-20 2-28 6c-6 0-14-4-22-12Z" fill="currentColor" />
      </>
    ),
    clothes: <path d="M92 208l28 54 28-54M72 228l48 72 48-72" />,
  },
  {
    hair: (
      <>
        <circle cx="74" cy="88" r="20" fill="currentColor" />
        <circle cx="96" cy="60" r="22" fill="currentColor" />
        <circle cx="130" cy="52" r="24" fill="currentColor" />
        <circle cx="160" cy="72" r="21" fill="currentColor" />
        <circle cx="170" cy="100" r="16" fill="currentColor" />
      </>
    ),
    clothes: <path d="M100 210c10 14 30 14 40 0M120 222v78" />,
  },
  {
    hair: (
      <>
        <path d="M78 84c2-30 18-46 42-46s40 16 42 46Z" fill="currentColor" />
        <path d="M46 88c20-8 128-8 148 0" strokeWidth="9" />
      </>
    ),
    clothes: <path d="M88 212c20 16 44 16 64 0M104 224l-8 40M136 224l8 40" />,
  },
];

export function JudgeSketch({ index, label }: { index: number; label: string }) {
  const { hair, clothes } = DETAILS[index % DETAILS.length];

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
      <path d="M26 300c0-58 34-92 94-92s94 34 94 92" />
      <path d="M102 176v32M138 176v32" />
      <ellipse cx="120" cy="124" rx="50" ry="62" />
      {clothes}
      {hair}
      <rect x="62" y="104" width="116" height="26" rx="13" fill="#F28C6B" stroke="none" />
      <path d="M176 118l24-12M176 118l26 6" stroke="#F28C6B" strokeWidth="8" />
      <g transform="translate(8 -10)">
        <path d="M198 196c-2 16 8 26 12 26s14-10 12-26Z" fill="currentColor" />
        <path d="M210 222v40M198 264h24" />
      </g>
    </svg>
  );
}
