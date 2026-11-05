"use client";

import { useId, useState, type FormEvent } from "react";

type Props = {
  buttonLabel: string;
  className: string;
  compact?: boolean;
};

export function NewsletterForm({ buttonLabel, className, compact }: Props) {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);

  // Det finnes ingen lagring ennå, så skjemaet skal ikke late som om det virker.
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex min-w-0 flex-wrap gap-2.5 ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        E-postadresse
      </label>
      <input
        id={id}
        type="email"
        required
        placeholder="din@epost.no"
        className={`min-w-0 flex-[1_1_160px] rounded-full bg-surface text-base text-ink placeholder:text-text-3 ${
          compact ? "h-11 border border-input-border px-4" : "h-14 px-[22px]"
        }`}
      />
      <button
        type="submit"
        className={`rounded-full bg-ink font-semibold whitespace-nowrap text-bg ${
          compact ? "h-11 px-4 text-[15px]" : "h-14 px-[26px] text-base max-sm:px-5"
        }`}
      >
        {buttonLabel}
      </button>
      <p role="status" className="m-0 basis-full text-[15px] text-ink empty:hidden">
        {submitted &&
          "Påmeldingen er ikke koblet på ennå, så adressen ble ikke lagret."}
      </p>
    </form>
  );
}
