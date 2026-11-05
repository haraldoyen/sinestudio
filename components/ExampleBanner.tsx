import { isExampleData } from "@/lib/wines";

export function ExampleBanner() {
  if (!isExampleData()) return null;

  return (
    <p className="bg-sand px-6 py-2 text-center text-[13px] text-text-2">
      Eksempeldata: Alt om vinene er oppdiktet.
    </p>
  );
}
