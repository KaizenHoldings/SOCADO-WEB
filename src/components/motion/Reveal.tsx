"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useMounted } from "./useMounted";

/**
 * Entrance and exit animation shared by every section of the landing.
 *
 * Unlike a one-shot reveal, this replays every time the element enters the
 * viewport and plays a short exit when it leaves. The direction follows the
 * element's position rather than the scroll event: whatever left through the
 * top animates upwards and comes back from the top, and the same downwards —
 * so an element always returns from the side it went out through.
 *
 * It renders with no inline opacity, so the content is visible before
 * hydration and if JavaScript never runs.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const ENTER_DURATION = 0.7;
const EXIT_DURATION = 0.4;

interface RevealProps {
  children: React.ReactNode;
  /** Extra delay, in seconds, before the entrance. */
  delay?: number;
  /** Position in a list, multiplied by `stagger`. */
  index?: number;
  /** Seconds between consecutive items of a grid or list. */
  stagger?: number;
  /** Travel distance in px. */
  distance?: number;
  /** Horizontal travel instead of vertical, for list rows. */
  axis?: "y" | "x";
  /** Element to render. */
  as?: "div" | "li";
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  index = 0,
  stagger = 0,
  distance = 24,
  axis = "y",
  as = "div",
  className,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);

  /**
   * `amount` plus the inset margin keep the element from flipping in and out
   * while it sits exactly on the viewport edge.
   */
  const inView = useInView(ref, {
    amount: 0.25,
    margin: "-8% 0px -8% 0px",
  });

  /** Sign of the offset: negative once the element has left through the top. */
  const [offset, setOffset] = useState(distance);

  useEffect(() => {
    if (inView || !ref.current) return;
    const { top } = ref.current.getBoundingClientRect();
    setOffset(top < 0 ? -distance : distance);
  }, [inView, distance]);

  const Component = as === "li" ? motion.li : motion.div;

  if (prefersReducedMotion) {
    const Static = as === "li" ? "li" : "div";
    return <Static className={className}>{children}</Static>;
  }

  const hidden =
    axis === "x" ? { opacity: 0, x: offset } : { opacity: 0, y: offset };
  const shown = axis === "x" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 };

  return (
    <Component
      ref={ref}
      className={className}
      // No `initial`: the server markup carries no opacity, so the content is
      // readable before hydration.
      initial={false}
      // Before hydration nothing is hidden; see `useMounted`.
      animate={!mounted || inView ? shown : hidden}
      transition={
        !mounted || inView
          ? {
              duration: ENTER_DURATION,
              delay: delay + index * stagger,
              ease: EASE,
            }
          : { duration: EXIT_DURATION, ease: EASE }
      }
    >
      {children}
    </Component>
  );
}

export default Reveal;
