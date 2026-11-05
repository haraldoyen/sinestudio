import Link from "next/link";
import { HeaderSignup } from "./HeaderSignup";
import { Logo } from "./ui";

const navLink =
  "inline-flex min-h-11 items-center text-ink hover:text-ink-hover max-sm:text-sm";

export function SiteHeader({ current }: { current?: "beste-kjop" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <nav
        aria-label="Hovedmeny"
        className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-6 py-5 max-sm:gap-1 max-sm:py-3"
      >
        <Link href="/" className="text-ink hover:text-ink">
          <Logo className="text-2xl max-sm:text-xl" />
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] font-medium max-sm:contents">
          <Link
            href="/beste-kjop"
            aria-current={current === "beste-kjop" ? "page" : undefined}
            className={`${navLink} ${current === "beste-kjop" ? "underline underline-offset-[6px]" : ""}`}
          >
            Se alle viner
          </Link>
          <HeaderSignup />
        </div>
      </nav>
    </header>
  );
}
