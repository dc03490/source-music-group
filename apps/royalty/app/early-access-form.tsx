"use client";

import { useRef, useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Button, ButtonLink } from "@source/ui";

/* NEXT_PUBLIC_ vars are inlined at build time — must be referenced literally.
   When the Formspree project ID isn't configured, the form degrades to a
   mailto link so the conversion path never dead-ends.

   IMPORTANT: render this component OUTSIDE any Reveal/Stagger wrapper —
   arming remounts children, which would wipe form state mid-typing. */
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ROYALTY;

const MAILTO = "mailto:royalty@sourcemusicgrp.com?subject=Early%20access%20-%20Source%20Royalty";

const ROLES = [
  "Artist",
  "Songwriter",
  "Producer",
  "Manager",
  "Independent label",
  "Publisher",
  "Catalog owner or estate",
  "Other",
];

const inputClasses =
  "h-12 w-full rounded-[var(--radius-card)] border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelClasses = "mb-2 block text-sm font-medium text-foreground";

const smallPrint = "No spam, just launch updates, and you can unsubscribe anytime.";

export function EarlyAccessForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  /* Analytics only — additive, one-shot; no field or submission behavior changes. */
  const startedRef = useRef(false);
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("contact_form_started", { site: "royalty", form: "early_access" });
  }

  if (!FORM_ID) {
    return (
      <div className="text-center">
        <ButtonLink href={MAILTO} size="lg">
          Join the early-access list →
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
        You&apos;re on the list. We&apos;ll email you when audits open.
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
      if (res.ok) {
        track("contact_form_completed", { site: "royalty", form: "early_access" });
        track("email_signup_completed", { site: "royalty", list: "early_access" });
      }
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocus={markStarted} className="relative text-left">
      <input type="hidden" name="_subject" value="Source Royalty early access" />
      {/* Honeypot — hidden from real users and assistive tech. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor="ea-gotcha">Leave this field empty</label>
        <input id="ea-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="ea-name" className={labelClasses}>
            Name
          </label>
          <input
            id="ea-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ea-email" className={labelClasses}>
            Email
          </label>
          <input
            id="ea-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ea-role" className={labelClasses}>
            I am a…
          </label>
          <select id="ea-role" name="role" className={inputClasses}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining…" : "Join early access (free audit at launch)"}
      </Button>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-center text-sm text-magenta-text">
          Something went wrong. Email us at{" "}
          <a href={MAILTO} className="font-medium underline underline-offset-4">
            royalty@sourcemusicgrp.com
          </a>{" "}
          and we&apos;ll add you by hand.
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-subtle">{smallPrint}</p>
    </form>
  );
}
