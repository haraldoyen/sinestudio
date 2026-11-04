import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { heading, primaryButton } from "@/components/ui";

export const metadata: Metadata = { title: "Fant ikke siden" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1240px] flex-col items-start gap-6 px-6 py-28">
        <h1 className={`${heading} text-h1-page`}>Fant ikke siden.</h1>
        <p className="m-0 text-lg text-text-2">
          Vinen kan være flyttet, eller så er lenken feil.
        </p>
        <Link href="/beste-kjop" className={primaryButton}>
          Se beste kjøp
        </Link>
      </main>
    </>
  );
}
