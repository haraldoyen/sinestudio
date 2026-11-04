"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  // Det finnes ingen lagring ennå, så skjemaet skal ikke late som om det virker.
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-w-0 flex-[1_1_380px] flex-wrap gap-2.5"
    >
      <label htmlFor="epost" className="sr-only">
        E-postadresse
      </label>
      <input
        id="epost"
        type="email"
        required
        placeholder="din@epost.no"
        className="h-14 min-w-0 flex-[1_1_220px] rounded-full bg-surface px-[22px] text-base text-ink placeholder:text-text-3"
      />
      <button
        type="submit"
        className="h-14 rounded-full bg-ink px-[26px] text-base font-semibold text-bg"
      >
        Meld meg på
      </button>
      <p role="status" className="m-0 basis-full text-[15px] text-ink empty:hidden">
        {submitted &&
          "Påmeldingen er ikke koblet på ennå, så adressen ble ikke lagret."}
      </p>
    </form>
  );
}
