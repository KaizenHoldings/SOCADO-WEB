"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { VISITA_URL, steps } from "../data";
import { Num } from "./Num";
import { Reveal } from "./Reveal";
import { ReservaButton } from "./ReservaButton";

/**
 * How to book, as a row of five connected cards.
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
    <section ref={sectionRef} className="bg-wc-marron-claro py-24">
      <div className="section-shell">
        <Reveal>
          <h2 className="font-raleway text-4xl tracking-tight text-wc-verde lowercase md:text-5xl">
            <span className="font-light">reservar</span>
            <span className="font-semibold"> es sencillo</span>
          </h2>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
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
                  className={`relative flex h-full min-h-[210px] flex-col border border-t-[6px] border-wc-gris-claro border-t-wc-verde-claro px-5 pb-8 pt-5 transition-[transform,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
                    isActive
                      ? "-translate-y-1.5 bg-white shadow-[0_12px_30px_-12px_rgb(73_67_40_/_0.25)] motion-reduce:translate-y-0"
                      : "bg-white/60"
                  }`}
                >
                  {/* Progress bar over the top border */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-px -right-px -top-[6px] h-[6px] origin-left bg-wc-verde"
                    style={{
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transition: barTransition(isActive),
                    }}
                  />

                  <p
                    className={`font-outfit text-2xl font-semibold text-wc-terracota transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "translate-x-1 motion-reduce:translate-x-0"
                        : "opacity-80"
                    }`}
                  >
                    {step.index}
                  </p>
                  <h3 className="mt-3 font-raleway text-lg font-semibold text-wc-verde lowercase">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 font-raleway text-sm font-light leading-snug text-wc-marron/80 lowercase">
                    <Num>{step.description}</Num>
                  </p>
                </article>

                {/*
                  Connectors. Horizontal on the five-column row, vertical on the
                  single-column stack; the two-column tablet grid gets none,
                  because there the next card is not the next step.
                */}
                {!isLast && (
                  <>
                    <ArrowRight
                      aria-hidden="true"
                      className={`absolute left-full top-1/2 ml-2.5 hidden h-5 w-5 -translate-y-1/2 transition-[color,transform] duration-300 lg:block motion-reduce:transition-none ${
                        isActive
                          ? "translate-x-1 text-wc-verde motion-reduce:translate-x-0"
                          : "text-wc-verde-claro"
                      }`}
                    />
                    <ArrowDown
                      aria-hidden="true"
                      className={`absolute left-1/2 top-full mt-2.5 block h-5 w-5 -translate-x-1/2 transition-[color,transform] duration-300 md:hidden motion-reduce:transition-none ${
                        isActive
                          ? "translate-y-1 text-wc-verde motion-reduce:translate-y-0"
                          : "text-wc-verde-claro"
                      }`}
                    />
                  </>
                )}
              </Reveal>
            );
          })}
        </ol>

        {/* Section CTAs */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
