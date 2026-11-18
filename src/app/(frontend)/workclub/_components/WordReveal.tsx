"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Paragraphs that are "read" by the scroll: each word travels from a faded
 * wc-verde to full strength in reading order.
 *
 * The progress is bound to the scroll position, not to a timer, so stopping the
 * scroll stops the reveal. It is also set to finish while the block is still
 * above the middle of the viewport, so the copy is never left dim once it is
 * what the reader is looking at.
 *
 * Some fragments are set in semibold. They are given as literal pieces of the
 * paragraph rather than as markup inside it, so the copy stays one plain
 * sentence: a word is emphasised when it starts inside one of those pieces.
 */

// Keep in sync with --color-wc-verde / --color-wc-marron in styles.css.
const DIM = "rgba(73, 67, 40, 0.3)";
const READ = "rgba(73, 67, 40, 0.9)";

/**
 * An emphasised fragment: one step of weight, and the accent of the section.
 *
 * The weight alone could not carry it. Outfit is loaded at 300, 400 and 600
 * only (see the font block in the frontend layout): against the paragraph's
 * 300, the 600 read as a different sentence and the 400 barely registered, and
 * the 500 in between is not loaded — a `font-medium` here would quietly render
 * as 400, so the class would be a lie. Loading it is not a local decision
 * either: `body` is `font-outfit`, and the fifteen `font-medium` in the catalog
 * inherit it, so they would all gain a step.
 *
 * So the second cue is colour, in wc-terracota — the same accent this section
 * already gives the word "socado" in the caption and the bullets of the list
 * below. 8.7:1 on white, well past AA.
 */
const STRONG = "font-normal";

/** wc-terracota (#763b21), dimmed and read, to match DIM / READ above. */
const STRONG_DIM = "rgba(118, 59, 33, 0.3)";
const STRONG_READ = "rgba(118, 59, 33, 1)";

function Word({
  word,
  progress,
  range,
  strong,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  strong: boolean;
}) {
  const color = useTransform(
    progress,
    range,
    strong ? [STRONG_DIM, STRONG_READ] : [DIM, READ],
  );

  return (
    <motion.span className={strong ? STRONG : undefined} style={{ color }}>
      {word}{" "}
    </motion.span>
  );
}

/**
 * Where each emphasised fragment sits inside the paragraph.
 *
 * A fragment that is not found is skipped rather than throwing: the copy is
 * edited far more often than this component, and a stale fragment should cost
 * an emphasis, not the section.
 */
function emphasisRanges(paragraph: string, fragments: string[]) {
  const ranges: [number, number][] = [];

  for (const fragment of fragments) {
    const at = paragraph.indexOf(fragment);
    if (at >= 0) ranges.push([at, at + fragment.length]);
  }

  return ranges;
}

interface WordRevealProps {
  paragraphs: string[];
  /** Literal fragments of the paragraphs to set in semibold. */
  emphasis?: string[];
  /** Typography classes applied to each paragraph. */
  className?: string;
}

export function WordReveal({
  paragraphs,
  emphasis = [],
  className,
}: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.55"],
  });

  const totalWords = paragraphs.reduce(
    (total, paragraph) => total + paragraph.split(" ").length,
    0,
  );

  // Running index across every paragraph: the reveal reads as one block.
  let wordIndex = 0;

  return (
    <div ref={containerRef} className="flex flex-col gap-5">
      {paragraphs.map((paragraph) => {
        const ranges = emphasisRanges(paragraph, emphasis);

        // Where the word starts in the paragraph, to place it against `ranges`.
        let at = 0;

        return (
          <p key={paragraph} className={className}>
            {paragraph.split(" ").map((word) => {
              const index = wordIndex;
              wordIndex += 1;

              const start = at;
              at += word.length + 1; // the space the split removed

              const strong = ranges.some(
                ([from, to]) => start >= from && start < to,
              );

              if (prefersReducedMotion) {
                // Reduced motion: the text is simply legible from the start.
                return (
                  <span
                    key={`${index}-${word}`}
                    className={
                      strong
                        ? `text-wc-terracota ${STRONG}`
                        : "text-wc-verde/90"
                    }
                  >
                    {word}{" "}
                  </span>
                );
              }

              return (
                <Word
                  key={`${index}-${word}`}
                  word={word}
                  strong={strong}
                  progress={scrollYProgress}
                  range={[index / totalWords, (index + 1) / totalWords]}
                />
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

export default WordReveal;
