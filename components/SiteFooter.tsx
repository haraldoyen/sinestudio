import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 pt-10 pb-14 text-sm text-text-3">
        <span className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Sine Studio
        </span>
        <span>Uavhengig. Ingen betalte plasseringer. Vi kjøper all vin selv.</span>
        <Link
          href="/#eksempel"
          className="inline-flex min-h-11 items-center text-text-3 underline"
        >
          Hvorfor blindt
        </Link>
      </div>
    </footer>
  );
}
