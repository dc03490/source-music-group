"use client";

/* Scroll-reveal primitives with SSR-safe rendering.

   The server (and first client render) always outputs plain, fully visible
   markup — no `opacity: 0` ever reaches the SSR HTML, so content is readable
   without JavaScript and for crawlers. On mount, each primitive "arms" itself
   only when (a) the user allows motion and (b) the element starts below the
   viewport. Arming swaps in the animated framer-motion element while the
   element is still off-screen, so the swap is invisible and above-the-fold
   content never flashes or hides.

   NOTE: children of Reveal / Stagger must be stateless — arming remounts the
   subtree (key swap), so any component state inside would be reset. */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Arm scroll animation on mount, only for elements that begin below the
    viewport (rect.top > innerHeight - 80, matching the -80px in-view margin)
    and only when the user has not requested reduced motion. */
function useArmed() {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return; // reduced motion: stay static forever
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight - 80) setArmed(true);
    // Mount-only decision by design: elements in or above the viewport at
    // load stay static; elements below it get the scroll reveal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, armed };
}

/** In-view fade + slide-up. The core scroll reveal for the whole ecosystem.
    Children must be stateless (arming remounts them). */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, armed } = useArmed();

  if (armed) {
    return (
      <motion.div
        key="armed"
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div key="static" ref={ref} className={className}>
      {children}
    </div>
  );
}

/* Stagger shares its armed state with its StaggerItem children so items
   render plain divs until the group arms. */
const StaggerContext = createContext(false);

/** Stagger a group of children into view. Pair with <StaggerItem>.
    Children must be stateless (arming remounts them). */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const { ref, armed } = useArmed();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
  };

  return (
    <StaggerContext.Provider value={armed}>
      {armed ? (
        <motion.div
          key="armed"
          className={className}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {children}
        </motion.div>
      ) : (
        <div key="static" ref={ref} className={className}>
          {children}
        </div>
      )}
    </StaggerContext.Provider>
  );
}

export function StaggerItem({ children, className, y = 16 }: { children: ReactNode; className?: string; y?: number }) {
  const armed = useContext(StaggerContext);
  const reduce = useReducedMotion();

  if (!armed) {
    return <div className={className}>{children}</div>;
  }

  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/* DECISION — framer-motion is intentionally NOT dynamic-imported. The SSR-safe
   arming pattern above needs `motion` and `useReducedMotion` synchronously at
   the first client render: deferring the library would force an async swap (a
   visible flash) or a loading gate around every Reveal/Stagger, reintroducing
   the blank-content bugs this file exists to prevent — all to save ~35KB gz.
   Skipped on purpose. */

/** Subtle hover lift for cards. */
export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
