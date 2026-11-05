"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { NewsletterForm } from "./NewsletterForm";

type Status = "closed" | "open" | "done";

export function HeaderSignup() {
  const [status, setStatus] = useState<Status>("closed");
  const opener = useRef<HTMLButtonElement>(null);

  function close() {
    flushSync(() => setStatus("closed"));
    opener.current?.focus();
  }

  useEffect(() => {
    if (status !== "open") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]);

  if (status === "done") {
    return (
      <span role="status" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-ink">
        Du er med ✓
      </span>
    );
  }

  if (status === "closed") {
    return (
      <button
        ref={opener}
        type="button"
        aria-label="Få ukens funn"
        onClick={() => setStatus("open")}
        className="h-11 rounded-full bg-ink px-4 text-[15px] font-semibold whitespace-nowrap text-bg max-sm:px-3.5 max-sm:text-sm"
      >
        <span className="max-sm:hidden">Få ukens funn</span>
        <span className="sm:hidden">Ukens funn</span>
      </button>
    );
  }

  return (
    <div className="flex w-[380px] items-start gap-1 motion-safe:animate-reveal max-sm:order-last max-sm:w-full max-sm:basis-full">
      <NewsletterForm
        buttonLabel="Meld meg på"
        className="flex-1"
        compact
        autoFocus
        onDone={() => setStatus("done")}
      />
      <button
        type="button"
        aria-label="Lukk påmeldingen"
        onClick={close}
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl text-text-3 hover:text-ink"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
