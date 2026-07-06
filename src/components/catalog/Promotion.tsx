"use client";

import { useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { InteractiveStickerCard } from "./InteractiveStickerCard";

// Title animates word-by-word; a full-width break forces the second line.
const TITLE_LINE_1 = ["Pide,", "disfruta"];
const TITLE_LINE_2 = [
  { text: "y", bold: false },
  { text: "suma", bold: true },
];

type PromoState = {
  icon: string;
  lead: ReactNode;
  sub: ReactNode;
};

// Only the supporting text + icon change; the title stays constant.
const STATES: PromoState[] = [
  {
    icon: "/images/icon1.png",
    lead: (
      <>
        Pide tu <strong className="font-semibold">Loyalty Card</strong> en nuestras tiendas.
      </>
    ),
    sub: <>Órdenes mayores a REF.10 con café, matcha o infusión reciben un sello.</>,
  },
  {
    icon: "/images/icon2.png",
    lead: (
      <>
        Tu <strong className="font-semibold">recompensa</strong> te espera.
      </>
    ),
    sub: (
      <>
        <strong className="font-semibold">9 sellos</strong> = una bebida de barismo: café, matcha o
        infusión.
      </>
    ),
  },
  {
    icon: "/images/icon3.png",
    lead: (
      <>
        Termina una y <strong className="font-semibold">pide otra.</strong>
      </>
    ),
    sub: <>Podrás <strong className="font-semibold">completar</strong> las tarjetas de fidelidad que desees.</>,
  },
];

export function Promotion() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  // Only the first two placements advance the section state.
  const state = Math.min(count, STATES.length - 1);
  const s = STATES[state];

  const titleContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: reduce ? 0 : 0.1,
      },
    },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 } as const,
    transition: { duration: 0.6, ease, delay: reduce ? 0 : delay },
  });

  // Reusable icon render (crossfades on state change).
  const renderIcon = (cls: string) => (
    <AnimatePresence mode="wait">
      <motion.img
        key={s.icon}
        src={s.icon}
        alt=""
        aria-hidden
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className={`h-auto select-none opacity-80 ${cls}`}
      />
    </AnimatePresence>
  );

  return (
    <section
      id="promociones"
      className="relative w-full overflow-visible bg-ivory text-azul-socado"
    >
      <div className="section-shell py-16 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:min-h-[30rem] lg:grid-cols-2 lg:gap-16">
          {/* LEFT — title + supporting text + icon (text pinned to top so the
              bottom-left icon never collides with it) */}
          <div className="order-2 lg:order-1 lg:self-start">
            <motion.h2
              variants={titleContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="flex flex-wrap font-raleway leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)" }}
            >
              {TITLE_LINE_1.map((w) => (
                <motion.span key={w} variants={word} className="mr-[0.28em] inline-block font-normal">
                  {w}
                </motion.span>
              ))}
              <span className="w-full" aria-hidden />
              {TITLE_LINE_2.map((w) => (
                <motion.span
                  key={w.text}
                  variants={word}
                  className={`mr-[0.28em] inline-block ${w.bold ? "font-bold" : "font-normal"}`}
                >
                  {w.text}
                </motion.span>
              ))}
            </motion.h2>

            {/* Supporting text — swaps per state. Reserved min-height keeps
                the section height stable across all states. */}
            <motion.div {...fadeUp(0.45)} className="mt-8 min-h-[7rem] max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={state}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="font-outfit text-azul-socado/85"
                >
                  <p className="text-lg leading-snug">{s.lead}</p>
                  <p className="mt-4 text-lg leading-snug">{s.sub}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Icon (mobile) — appears in flow below the text */}
            <motion.div {...fadeUp(0.75)} className="mt-8 md:hidden">
              {renderIcon("w-44")}
            </motion.div>
          </div>

          {/* RIGHT — loyalty card + hint */}
          <motion.div
            {...fadeUp(0.45)}
            className="order-1 flex flex-col items-center lg:order-2 lg:items-end"
          >
            <InteractiveStickerCard onStickerPlaced={setCount} />
            <motion.p
              animate={reduce ? {} : { opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-5 font-outfit text-sm text-azul-socado/50"
            >
              Haz click y llena los sellos para conocer más.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Icon (desktop/tablet) — anchored to the section's bottom-left,
          intentionally overflowing a touch (section is overflow-visible). */}
      <motion.div
        {...fadeUp(0.75)}
        className="pointer-events-none absolute bottom-6 -left-4 z-20 hidden w-56 md:block lg:bottom-10 lg:-left-6 lg:w-72"
      >
        {renderIcon("w-full")}
      </motion.div>
    </section>
  );
}
