"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqItem {
  q: string;
  a: string;
}

export function FAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-medium">{item.q}</span>
              <Plus
                className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300", isOpen && "rotate-45")}
              />
            </button>
            <div
              className={cn(
                "grid px-6 transition-all duration-300",
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
