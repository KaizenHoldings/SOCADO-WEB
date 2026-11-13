"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
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
 *
 * Two things here are load-bearing, both learned the hard way:
 *
 * 1. The entrance is triggered by the heading as a whole, never by each
 *    letter. A letter asked to watch itself displaces itself out of the
 *    viewport before it is ever seen — the first one starts `centre * SPREAD`
 *    to the left, which on a phone is past the 24px gutter — and a letter that
 *    is off screen never meets its own threshold, so it stays at `opacity: 0`
 *    for good. That is how this heading lost its first letter.
 *
 * 2. The watched span is rendered on every pass, including the server's and
 *    the first client one, and only its contents change. `useInView` attaches
 *    its observer in an effect keyed on the ref object, which never changes
 *    identity: if `ref.current` is null when that effect first runs, it gives
 *    up and never looks again. Returning early for the plain-text state — as
 *    this component used to — left the ref empty on that pass and the heading
 *    never appeared at all.
 */

/** Horizontal displacement per character, in px, before the word closes up. */
const SPREAD = 7;

/**
 * How much of the heading must be on screen to trigger it.
 *
 * Low on purpose: this is a display heading that can be over 100px tall, and
 * nothing about the page should be able to leave it unreadable.
 */
const IN_VIEW_AMOUNT = 0.3;

interface AssembleTitleProps {
  text: string;
  /** Typography classes for the visible heading. */
  className?: string;
}

export function AssembleTitle({ text, className }: AssembleTitleProps) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();

  const headingRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(headingRef, { amount: IN_VIEW_AMOUNT });

  /** Plain text: before the client takes over, and under reduced motion. */
  const still = prefersReducedMotion || !mounted;

  const words = text.split(" ");
  const totalCharacters = text.replace(/ /g, "").length;
  const centre = (totalCharacters - 1) / 2;

  /** Where a letter waits before the heading closes up. */
  const spread = (index: number) => ({
    x: (index - centre) * SPREAD,
    y: index % 2 === 0 ? -10 : 10,
    rotate: index % 2 === 0 ? -3 : 3,
    opacity: 0,
  });

  let characterIndex = 0;

  return (
    <>
      {/* Only while the letters are the ones being read by eye */}
      {!still && <span className="sr-only">{text}</span>}

      <span
        ref={headingRef}
        aria-hidden={still ? undefined : true}
        className={className}
      >
        {still
          ? text
          : words.map((word, wordPosition) => (
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
                      initial={spread(index)}
                      animate={
                        inView
                          ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                          : spread(index)
                      }
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
                {wordPosition < words.length - 1 && " "}
              </span>
            ))}
      </span>
    </>
  );
}

export default AssembleTitle;
