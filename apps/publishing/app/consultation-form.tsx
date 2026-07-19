"use client";

import { useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Button, ButtonLink } from "@source/ui";
import { ArrowRight } from "lucide-react";

/* NEXT_PUBLIC_ vars are inlined at build time — must be referenced literally.
   When the Formspree project ID isn't configured, the form degrades to a
   mailto link so the conversion path never dead-ends.

   IMPORTANT: render this component OUTSIDE any Reveal/Stagger wrapper —
   arming remounts children, which would wipe form state mid-typing. */
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_PUBLISHING;

const MAILTO =
  "mailto:publishing@sourcemusicgrp.com?subject=Publishing%20consultation%20request";

const ROLES = [
  "Songwriter",
  "Producer",
  "Composer",
  "Artist who writes",
  "Catalog owner or estate",
  "Manager",
  "Other",
];

const inputClasses =
  "h-12 w-full rounded-[var(--radius-card)] border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const textareaClasses =
  "min-h-28 w-full resize-y rounded-[var(--radius-card)] border border-input bg-card px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelClasses = "mb-2 block text-sm font-medium text-foreground";

const smallPrint = "No mailing list, no spam — we only use this to reply to your request.";

export function ConsultationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  /* Analytics only — additive, one-shot; no field or submission behavior changes.
     consultation_started / consultation_submitted double as this site's
     contact_form_started / contact_form_completed events. */
  const startedRef = useRef(false);
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("consultation_started", { site: "publishing", form: "consultation" });
  }

  if (!FORM_ID) {
    return (
      <div className="text-center">
        <ButtonLink href={MAILTO} size="lg">
          Email the publishing team
          <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
        <p className="mt-4 text-sm text-subtle">{smallPrint}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-[var(--radius-card)] border border-teal/40 bg-card p-6 text-center text-[15px] leading-relaxed text-foreground"
      >
        Request received. A real person will reply from publishing@sourcemusicgrp.com — typically
        within a few business days.
      </p>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      if (res.ok) track("consultation_submitted", { site: "publishing", form: "consultation" });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocus={markStarted} className="relative text-left">
      <input type="hidden" name="_subject" value="Source Publishing consultation request" />
      {/* Honeypot — hidden from real users and assistive tech. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor="pc-gotcha">Leave this field empty</label>
        <input id="pc-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="pc-name" className={labelClasses}>
            Name
          </label>
          <input
            id="pc-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="pc-email" className={labelClasses}>
            Email
          </label>
          <input
            id="pc-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="pc-role" className={labelClasses}>
            I am a…
          </label>
          <select id="pc-role" name="role" className={inputClasses}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pc-catalog" className={labelClasses}>
            Tell us about your catalog <span className="font-normal text-subtle">(optional)</span>
          </label>
          <textarea
            id="pc-catalog"
            name="catalog"
            rows={4}
            aria-describedby="pc-catalog-hint"
            className={textareaClasses}
          />
          <p id="pc-catalog-hint" className="mt-2 text-sm text-subtle">
            Roughly how many songs, where they&apos;re released, and any society memberships.
          </p>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request a consultation"}
      </Button>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-center text-sm text-magenta-text">
          Something went wrong on our end. Email us at{" "}
          <a href={MAILTO} className="font-medium underline underline-offset-4">
            publishing@sourcemusicgrp.com
          </a>{" "}
          and we&apos;ll pick it up from there.
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-subtle">{smallPrint}</p>
    </form>
  );
}
