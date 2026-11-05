import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { vinmonopoletImageUrl } from "@/lib/derive";
import { formatPrice, joinParts, WINE_TYPE_LABELS } from "@/lib/format";
import type { WineView } from "@/lib/types";

export const primaryButton =
  "inline-flex min-h-14 items-center justify-center rounded-full bg-ink px-[26px] font-semibold text-bg hover:text-bg";
export const secondaryButton =
  "inline-flex min-h-14 items-center justify-center rounded-full border border-ink px-6 font-semibold text-ink hover:text-ink";
export const textInput =
  "h-14 min-w-0 rounded-full border border-input-border bg-surface px-[22px] text-base text-ink placeholder:text-text-3";
export const heading = "m-0 font-display font-semibold";

// Grid som stables på mobil, uten å sprenge smale skjermer.
export const fitGrid = (min: number) => ({
  gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`,
});
export const fillGrid = (min: number) => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(min(${min}px, 100%), 1fr))`,
});

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="self-start rounded-full bg-sand px-3.5 py-[7px] text-sm font-medium">
      {children}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-ink">
      Score {score}
    </span>
  );
}

export function BottleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2h5v15c0 4 5.5 6 5.5 12v30a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V29c0-6 5.5-8 5.5-12V2Z" />
      <path d="M4 36h16v14H4" />
    </svg>
  );
}

// Hentes rett fra Vinmonopolet, så vi ikke lagrer egne kopier av bildene.
// De har hvit bakgrunn, som multiply lar forsvinne inn i flisen bak.
export function WineImage({
  wine,
  size,
  iconClassName,
  imageClassName,
  alt = "",
}: {
  wine: WineView;
  size: 300 | 515 | 1200;
  iconClassName: string;
  imageClassName: string;
  alt?: string;
}) {
  const src = vinmonopoletImageUrl(wine.vinmonopoletId, size);
  if (!src) return <BottleIcon className={iconClassName} />;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`object-contain mix-blend-multiply ${imageClassName}`}
    />
  );
}

export function WineCard({ wine, rank }: { wine: WineView; rank?: number }) {
  return (
    <Link
      href={`/vin/${wine.slug}`}
      className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 text-ink hover:text-ink"
    >
      {rank !== undefined && (
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-text-3">
            #{rank}
          </span>
          <span className="text-[13px] text-text-3">{WINE_TYPE_LABELS[wine.type]}</span>
        </div>
      )}
      <div className="flex h-[140px] items-center justify-center rounded-image bg-sand-soft text-text-3">
        <WineImage wine={wine} size={300} iconClassName="h-24" imageClassName="size-[124px]" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-[17px] font-semibold">{wine.name}</span>
        <span className="text-sm text-text-3">
          {joinParts([wine.producer, wine.region])}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <ScoreBadge score={wine.score} />
        <span className="text-[15px] font-semibold whitespace-nowrap">
          {formatPrice(wine.priceNok)}
        </span>
      </div>
    </Link>
  );
}
