"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { VISITA_URL, steps } from "../data";
import { Num } from "./Num";
import { Reveal } from "./Reveal";
import { ReservaButton } from "./ReservaButton";

/**
 * How to book: a divided list on the phone, a row of five connected cards
 * from `md` up.
 *
 * Five cards one under another spent some 1.200px on five one-line steps, so
 * below `md` the card flattens into a row — index on the left, step on the
 * right — and the hairline between them carries the sequence.
 *
 * While the section is on screen the steps light up one after another, and the
 * top bar of the active card fills from left to right like a progress bar for
 * the interval. Pointing at a card pauses the sequence on that step and leaving
 * resumes from there, so the reader is never pulled away from what they read.
 */

/** Time each step stays active, and the duration of its bar fill. */
const AUTO_INTERVAL_MS = 2500;

export function PasoAPaso() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  // A hidden tab keeps no sequence running.
  useEffect(() => {
    const onVisibilityChange = () =>
      setTabVisible(document.visibilityState === "visible");
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const autoRunning =
    !prefersReducedMotion && inView && !paused && tabVisible;

  useEffect(() => {
    if (!autoRunning) return;
    const timer = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % steps.length),
      AUTO_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [autoRunning]);

  /** Bar fill: the interval while the sequence runs, a quick fill on hover. */
  const barTransition = (isActive: boolean) => {
    if (prefersReducedMotion) return "none";
    const duration = isActive ? (autoRunning ? AUTO_INTERVAL_MS : 350) : 300;
    return `transform ${duration}ms linear`;
  };

  return (
    <section ref={sectionRef} className="bg-wc-marron-claro py-16 md:py-24">
      <div className="section-shell">
        <Reveal>
          <h2 className="font-raleway text-4xl tracking-tight text-wc-verde lowercase md:text-5xl">
            <span className="font-light">reservar</span>
            <span className="font-semibold"> es sencillo</span>
          </h2>
        </Reveal>

        <ol className="mt-8 grid grid-cols-1 gap-0 md:mt-10 md:grid-cols-2 md:gap-10 lg:grid-cols-5">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            const isLast = index === steps.length - 1;

            return (
              <Reveal
                key={step.index}
                as="li"
                index={index}
                stagger={0.08}
                className="relative h-full"
              >
                <article
                  aria-current={isActive ? "step" : undefined}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                    setPaused(true);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  className={`relative grid grid-cols-[2.25rem_1fr] items-start gap-x-3 border-b border-wc-verde-claro/70 py-4 transition-[transform,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none md:flex md:h-full md:min-h-[210px] md:flex-col md:border md:border-t-[6px] md:border-wc-gris-claro md:border-t-wc-verde-claro md:px-5 md:pb-8 md:pt-5 ${
                    isActive
                      ? "md:-translate-y-1.5 md:bg-white md:shadow-[0_12px_30px_-12px_rgb(73_67_40_/_0.25)] md:motion-reduce:translate-y-0"
                      : "md:bg-white/60"
                  }`}
                >
                  {/* Progress bar over the top border */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-px -right-px -top-[6px] hidden h-[6px] origin-left bg-wc-verde md:block"
                    style={{
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transition: barTransition(isActive),
                    }}
                  />

                  <p
                    className={`row-span-2 font-outfit text-xl font-semibold text-wc-terracota transition-transform md:text-2xl duration-300 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "translate-x-1 motion-reduce:translate-x-0"
                        : "opacity-80"
                    }`}
                  >
                    {step.index}
                  </p>
                  <h3 className="font-raleway text-lg font-semibold text-wc-verde lowercase md:mt-3">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-raleway text-sm font-light leading-snug text-wc-marron/80 lowercase md:mt-2.5">
                    <Num>{step.description}</Num>
                  </p>
                </article>

                {/*
                  Connector, only on the five-column row. The two-column tablet
                  grid gets none, because there the next card is not the next
                  step, and the phone list no longer needs one: the hairline
                  between rows already reads as the sequence, and an arrow
                  would land on top of it.
                */}
                {!isLast && (
                  <ArrowRight
                    aria-hidden="true"
                    className={`absolute left-full top-1/2 ml-2.5 hidden h-5 w-5 -translate-y-1/2 transition-[color,transform] duration-300 lg:block motion-reduce:transition-none ${
                      isActive
                        ? "translate-x-1 text-wc-verde motion-reduce:translate-x-0"
                        : "text-wc-verde-claro"
                    }`}
                  />
                )}
              </Reveal>
            );
          })}
        </ol>

        {/* Section CTAs */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center md:mt-12">
            <ReservaButton>reserva ahora</ReservaButton>
            <ReservaButton href={VISITA_URL} variant="outline">
              agenda una visita
            </ReservaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PasoAPaso;
