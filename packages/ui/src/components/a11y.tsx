/** Accessibility helpers shared across the ecosystem. */

/** Skip-to-content link: visually hidden until keyboard focus, then a fixed
    gold-ring pill in the top-left corner. Render it as the first element on
    the page, before the nav, pointing at <main id="main">. */
export function SkipLink({ href = "#main" }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:inline-flex focus-visible:items-center focus-visible:rounded-full focus-visible:border focus-visible:border-border focus-visible:bg-background focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Skip to content
    </a>
  );
}
