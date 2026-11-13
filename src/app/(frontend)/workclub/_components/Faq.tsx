"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faq } from "../data";
import { AssembleTitle } from "./AssembleTitle";
import { Reveal } from "./Reveal";
import { Num } from "./Num";

/**
 * Frequently asked questions.
 *
 * One item open at a time. The panel height animates through
 * `grid-rows-[0fr] → [1fr]`, which keeps the transition on the grid track
 * instead of animating a measured pixel height.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-wc-gris-claro bg-white py-24 lg:py-28">
      <div className="section-shell">
        {/*
          The display moment of the page: the letters arrive spread out and
          close up into the heading, which then hands over to the numbered rows.
        */}
        <h2 className="mb-12">
          <AssembleTitle
            text="preguntas frecuentes"
            className="block font-raleway text-[clamp(1.75rem,7.5vw,6.5rem)] font-light leading-none tracking-tight text-wc-verde lowercase"
          />
        </h2>

        {/* Full-width rows, as in the reference, under the display heading */}
        <div>
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-trigger-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <Reveal
                key={item.question}
                index={index}
                stagger={0.05}
                className="border-b border-wc-verde-claro"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-raleway text-lg font-light text-wc-marron lowercase transition-colors duration-200 hover:text-wc-terracota focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wc-verde"
                  >
                    <span className="max-w-[48ch]">{item.question}</span>

                    {/* Right edge: row index, then the + that rotates into an × */}
                    <span className="flex shrink-0 items-center gap-5">
                      <span
                        className={`font-outfit text-sm transition-colors duration-300 ${
                          isOpen ? "text-wc-verde" : "text-wc-marron/70"
                        }`}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Plus
                        className={`h-5 w-5 shrink-0 transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                          isOpen
                            ? "rotate-45 text-wc-verde"
                            : "text-wc-marron/60"
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 font-outfit text-base font-light leading-relaxed text-wc-marron/75 lowercase">
                      <Num>{item.answer}</Num>
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
