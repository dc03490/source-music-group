"use client";

import { useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@source/ui";
import { SPOTIFY_ARTIST } from "./artists/duka/tracks";

/* NEXT_PUBLIC_ vars are inlined at build time — must be referenced literally.
   When the Formspree project ID isn't configured, the form degrades to a
   "Follow on Spotify" CTA so the fan conversion path never dead-ends.

   IMPORTANT: render this component OUTSIDE any Reveal/Stagger wrapper —
   arming remounts children, which would wipe form state mid-typing. */
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FANLIST;

const inputClasses =
  "h-12 w-full rounded-[var(--radius-card)] border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelClasses = "mb-2 block text-sm font-medium text-foreground";

const smallPrint = "One email per release. No spam, unsubscribe anytime.";

export function FanSignupForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!FORM_ID) {
    return (
      <div className="text-center">
        <ButtonLink href={SPOTIFY_ARTIST} target="_blank" rel="noopener" size="lg">
          Follow Duka on Spotify
        </ButtonLink>
        <p className="mt-4 text-sm text-subtle">
          Email alerts are coming soon — following on Spotify is the fastest way to catch the next
          release.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-[var(--radius-card)] border border-teal/40 bg-card p-6 text-center text-[15px] leading-relaxed text-foreground"
      >
        You&apos;re in. Next time Duka drops, you&apos;ll hear it first.
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
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative text-left">
      <input type="hidden" name="_subject" value="Source Music Group — fan list signup" />
      {/* Honeypot — hidden from real users and assistive tech. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor="fl-gotcha">Leave this field empty</label>
        <input id="fl-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="fl-email" className={labelClasses}>
            Email
          </label>
          <input
            id="fl-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="fl-name" className={labelClasses}>
            Name <span className="font-normal text-subtle">(optional)</span>
          </label>
          <input id="fl-name" name="name" type="text" autoComplete="name" className={inputClasses} />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing you up…" : "Get release alerts"}
      </Button>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-center text-sm text-magenta-text">
          Something went wrong on our end. Try again in a minute — or{" "}
          <a
            href={SPOTIFY_ARTIST}
            target="_blank"
            rel="noopener"
            className="font-medium underline underline-offset-4"
          >
            follow Duka on Spotify
          </a>{" "}
          so you don&apos;t miss what&apos;s next.
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-subtle">{smallPrint}</p>
    </form>
  );
}
