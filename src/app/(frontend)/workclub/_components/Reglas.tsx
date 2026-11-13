"use client";

import { reglas } from "../data";
import { Num } from "./Num";
import { Reveal } from "./Reveal";

/**
 * House rules.
 *
 * Two columns on mobile, four on desktop, on a white surface. Each rule is
 * numbered in Outfit, with the terracotta detail tone on the index.
 */
export function Reglas() {
  return (
    <section className="border-t border-wc-gris-claro bg-white py-24 lg:py-28">
      <div className="section-shell">
        <Reveal>
          <h2 className="mb-12 font-raleway text-4xl font-light tracking-tight text-wc-verde lowercase sm:text-5xl lg:text-6xl">
            reglas de convivencia
          </h2>
        </Reveal>

        <ul className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {reglas.map((regla, index) => (
            <Reveal
              key={regla.index}
              as="li"
              index={index}
              stagger={0.08}
              className="flex flex-col gap-2"
            >
              <span className="font-outfit text-sm font-light text-wc-terracota">
                {regla.index}
              </span>
              <h3 className="font-raleway text-lg font-light text-wc-verde lowercase">
                {regla.title}
              </h3>
              <p className="font-outfit text-sm font-light leading-relaxed text-wc-marron/80 lowercase">
                <Num>{regla.description}</Num>
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Reglas;
