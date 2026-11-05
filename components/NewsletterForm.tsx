"use client";

import { useId, useState, type FormEvent } from "react";
import { subscribe } from "@/lib/newsletter";

type Status = "idle" | "invalid" | "sending" | "done" | "failed";

const MESSAGES: Partial<Record<Status, string>> = {
  invalid: "Skriv en gyldig e-postadresse.",
  failed: "Påmeldingen er ikke koblet på ennå, så adressen ble ikke lagret.",
};

type Props = {
  buttonLabel: string;
  className: string;
  compact?: boolean;
  autoFocus?: boolean;
  onDone?: () => void;
};

export function NewsletterForm({
  buttonLabel,
  className,
  compact,
  autoFocus,
  onDone,
}: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("epost") as HTMLInputElement;
    if (!input.value || !input.validity.valid) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    const saved = await subscribe(input.value);
    setStatus(saved ? "done" : "failed");
    if (saved) onDone?.();
  }

  if (status === "done" && !onDone) {
    return (
      <p role="status" className={`m-0 text-lg font-semibold text-ink ${className}`}>
        Takk! Du er påmeldt.
      </p>
    );
  }

  const message = MESSAGES[status];

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`flex min-w-0 flex-wrap gap-2.5 ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        E-postadresse
      </label>
      <input
        id={id}
        name="epost"
        type="email"
        autoComplete="email"
        autoFocus={autoFocus}
        aria-invalid={status === "invalid"}
        aria-describedby={`${id}-melding`}
        placeholder="din@epost.no"
        onChange={() => status !== "idle" && setStatus("idle")}
        className={`min-w-0 rounded-full bg-surface text-base text-ink placeholder:text-text-3 ${
          compact
            ? "h-11 flex-[1_1_120px] border border-input-border px-4"
            : "h-14 flex-[1_1_160px] px-[22px]"
        }`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className={`rounded-full bg-ink font-semibold whitespace-nowrap text-bg disabled:opacity-70 ${
          compact
            ? "h-11 px-4 text-[15px] max-sm:px-3.5 max-sm:text-sm"
            : "h-14 px-[26px] text-base max-sm:px-5"
        }`}
      >
        {status === "sending" ? "Sender …" : buttonLabel}
      </button>
      <p
        id={`${id}-melding`}
        role="status"
        className="m-0 basis-full text-sm text-ink empty:hidden"
      >
        {message}
      </p>
    </form>
  );
}
