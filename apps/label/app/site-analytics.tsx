"use client";

/* Per-app analytics mount — intentionally duplicated across the four apps so
   @source/ui stays dependency-free; promote to a shared package if a fifth
   copy is ever needed.

   Declarative wiring: any element with data-evt="event_name" fires that event
   on click, with properties read from its data-evt-* attributes plus the
   clicked anchor's href and the site name. Elements with
   data-evt-view="event_name" fire once when at least half visible
   (one-shot IntersectionObserver). */

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { track } from "@vercel/analytics";

export function SiteAnalytics({ site }: { site: string }) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest("[data-evt]");
      if (!el) return;
      const name = el.getAttribute("data-evt");
      if (!name) return;
      const props: Record<string, string> = { site };
      for (const attr of Array.from(el.attributes)) {
        if (attr.name.startsWith("data-evt-") && attr.name !== "data-evt-view") {
          props[attr.name.slice("data-evt-".length).replace(/-/g, "_")] = attr.value;
        }
      }
      const anchor = target?.closest("a") ?? el.querySelector("a");
      const href = anchor?.getAttribute("href");
      if (href) props.href = href;
      track(name, props);
    }
    document.addEventListener("click", onClick, true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const name = entry.target.getAttribute("data-evt-view");
          if (name) track(name, { site });
          observer.unobserve(entry.target); // one-shot
        }
      },
      { threshold: 0.5 },
    );
    for (const el of Array.from(document.querySelectorAll("[data-evt-view]"))) {
      observer.observe(el);
    }

    return () => {
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
    };
  }, [site]);

  return <Analytics />;
}
