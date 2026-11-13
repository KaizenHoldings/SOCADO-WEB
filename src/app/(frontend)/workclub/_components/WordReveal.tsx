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
 */

// Keep in sync with --color-wc-verde / --color-wc-marron in styles.css.
const DIM = "rgba(73, 67, 40, 0.3)";
const READ = "rgba(73, 67, 40, 0.9)";

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [DIM, READ]);

  return <motion.span style={{ color }}>{word} </motion.span>;
}

interface WordRevealProps {
  paragraphs: string[];
  /** Typography classes applied to each paragraph. */
  className?: string;
}

export function WordReveal({ paragraphs, className }: WordRevealProps) {
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
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={className}>
          {paragraph.split(" ").map((word) => {
            const index = wordIndex;
            wordIndex += 1;

            if (prefersReducedMotion) {
              // Reduced motion: the text is simply legible from the start.
              return (
                <span key={`${index}-${word}`} className="text-wc-verde/90">
                  {word}{" "}
                </span>
              );
            }

            return (
              <Word
                key={`${index}-${word}`}
                word={word}
                progress={scrollYProgress}
                range={[index / totalWords, (index + 1) / totalWords]}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}

export default WordReveal;
