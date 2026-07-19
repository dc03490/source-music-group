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
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_LABEL;

const MAILTO = "mailto:hello@sourcemusicgrp.com?subject=Music%20Submission";

const ROLES = ["Artist", "Producer", "Songwriter", "Manager", "Other"];

const inputClasses =
  "h-12 w-full rounded-[var(--radius-card)] border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const textareaClasses =
  "min-h-28 w-full resize-y rounded-[var(--radius-card)] border border-input bg-card px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const labelClasses = "mb-2 block text-sm font-medium text-foreground";

const smallPrint = (
  <>
    Submitting won&apos;t create any obligation on either side — see our{" "}
    <a href="/submission-terms" className="underline underline-offset-4 hover:text-foreground">
      Submission Terms
    </a>
    .
  </>
);

export function SubmissionForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  /* Analytics only — additive, one-shot; no field or submission behavior changes. */
  const startedRef = useRef(false);
  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    track("submission_started", { site: "label", form: "music_submission" });
  }

  if (!FORM_ID) {
    return (
      <div className="text-center">
        <ButtonLink href={MAILTO} size="lg">
          Email your music
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
        Got it — your submission is in. We review in batches and can&apos;t reply to everything,
        but if it&apos;s a fit we&apos;ll reach out from hello@sourcemusicgrp.com.
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
      if (res.ok) track("submission_completed", { site: "label", form: "music_submission" });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocus={markStarted} className="relative text-left">
      <input type="hidden" name="_subject" value="Source Music Group — music submission" />
      {/* Honeypot — hidden from real users and assistive tech. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">
        <label htmlFor="ms-gotcha">Leave this field empty</label>
        <input id="ms-gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="ms-name" className={labelClasses}>
            Name
          </label>
          <input
            id="ms-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ms-email" className={labelClasses}>
            Email
          </label>
          <input
            id="ms-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="ms-artist" className={labelClasses}>
            Artist / project name
          </label>
          <input id="ms-artist" name="artist" type="text" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="ms-role" className={labelClasses}>
            I am a…
          </label>
          <select id="ms-role" name="role" className={inputClasses}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ms-links" className={labelClasses}>
            Music links
          </label>
          <input
            id="ms-links"
            name="links"
            type="text"
            required
            aria-describedby="ms-links-hint"
            className={inputClasses}
          />
          <p id="ms-links-hint" className="mt-2 text-sm text-subtle">
            Spotify, Apple Music, SoundCloud, or YouTube — whatever shows your best work.
          </p>
        </div>
        <div>
          <label htmlFor="ms-about" className={labelClasses}>
            About you &amp; your goals <span className="font-normal text-subtle">(optional)</span>
          </label>
          <textarea
            id="ms-about"
            name="about"
            rows={4}
            aria-describedby="ms-about-hint"
            className={textareaClasses}
          />
          <p id="ms-about-hint" className="mt-2 text-sm text-subtle">
            A few lines is plenty — where you are now and where you&apos;re trying to go.
          </p>
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-7 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Submit your music"}
      </Button>

      {status === "error" ? (
        <p role="alert" className="mt-4 text-center text-sm text-magenta-text">
          Something went wrong on our end. Email your links to{" "}
          <a href={MAILTO} className="font-medium underline underline-offset-4">
            hello@sourcemusicgrp.com
          </a>{" "}
          and we&apos;ll take it from there.
        </p>
      ) : null}

      <p className="mt-4 text-center text-sm text-subtle">{smallPrint}</p>
    </form>
  );
}
