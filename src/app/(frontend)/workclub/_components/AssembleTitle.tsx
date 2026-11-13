"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMounted } from "./useMounted";

/**
 * A heading whose letters start spread out, slightly raised and tilted, and
 * close up into the word as the heading enters the viewport.
 *
 * The displacement is done with transforms only — never letter-spacing — so no
 * layout is animated. Letters are grouped per word so lines can still wrap
 * between words but never inside one.
 *
 * Accessibility: the animated letters are decorative; the heading text is
 * exposed once, through a screen-reader-only copy.
 */

/** Horizontal displacement per character, in px, before the word closes up. */
const SPREAD = 7;

interface AssembleTitleProps {
  text: string;
  /** Typography classes for the visible heading. */
  className?: string;
}

export function AssembleTitle({ text, className }: AssembleTitleProps) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  // Plain text until the client takes over, so the heading never depends on JS.
  if (prefersReducedMotion || !mounted) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  const totalCharacters = text.replace(/ /g, "").length;
  const centre = (totalCharacters - 1) / 2;

  let characterIndex = 0;

  return (
    <>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true" className={className}>
        {words.map((word, wordPosition) => (
          <span
            key={`${wordPosition}-${word}`}
            className="inline-block whitespace-nowrap"
          >
            {Array.from(word).map((character, position) => {
              const index = characterIndex;
              characterIndex += 1;

              return (
                <motion.span
                  key={`${position}-${character}`}
                  className="inline-block"
                  initial={{
                    x: (index - centre) * SPREAD,
                    y: index % 2 === 0 ? -10 : 10,
                    rotate: index % 2 === 0 ? -3 : 3,
                    opacity: 0,
                  }}
                  whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{
                    duration: 0.9,
                    // Outer letters settle last, so the word closes inwards.
                    delay: Math.abs(index - centre) * 0.02,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {character}
                </motion.span>
              );
            })}
            {wordPosition < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}

export default AssembleTitle;
