import Link from "next/link";

const navLink = "inline-flex min-h-11 items-center text-ink hover:text-ink-hover";

export function SiteHeader({ current }: { current?: "beste-kjop" }) {
  return (
    <header className="border-b border-line">
      <nav
        aria-label="Hovedmeny"
        className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-5"
      >
        <Link href="/" className="flex items-center gap-3 text-ink hover:text-ink">
          <span
            aria-hidden="true"
            className="flex size-[34px] items-center justify-center rounded-full bg-ink"
          >
            <span className="block h-1.5 w-5 rounded-[3px] bg-accent" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-[-0.02em]">
            Sine Studio
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-medium">
          <Link
            href="/beste-kjop"
            aria-current={current === "beste-kjop" ? "page" : undefined}
            className={`${navLink} ${current === "beste-kjop" ? "underline underline-offset-[6px]" : ""}`}
          >
            Beste kjøp
          </Link>
          <Link href="/#eksempel" className={navLink}>
            Hvorfor blindt
          </Link>
          <Link href="/#panelet" className={navLink}>
            Panelet
          </Link>
          <Link
            href="/#nyhetsbrev"
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-bg hover:text-bg"
          >
            Få ukens funn
          </Link>
        </div>
      </nav>
    </header>
  );
}
