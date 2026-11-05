import Link from "next/link";
import { Logo } from "./ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-6 pt-10 pb-14 text-sm text-text-3">
        <Logo className="text-[22px]" />
        <span>Uavhengig. Ingen betalte plasseringer. Vi kjøper all vin selv.</span>
        <Link
          href="/hvorfor-blindt"
          className="inline-flex min-h-11 items-center text-text-3 underline"
        >
          Hvorfor blindt
        </Link>
      </div>
    </footer>
  );
}
