"use client";

import {
  caption,
  descriptionEmphasis,
  descriptionParagraphs,
  quickFacts,
  somosItems,
  somosTitle,
} from "../data";
import { Num } from "./Num";
import { Reveal } from "./Reveal";
import { WordReveal } from "./WordReveal";

/**
 * Caption phrase, the explanation of what Workclub is, and what it is made of.
 *
 * Two columns on desktop: the phrase on the left, the explanation and the
 * "somos" list on the right, with a row of quick figures underneath.
 */
export function Descripcion() {
  // The highlighted word is rendered in the terracotta detail tone.
  const [beforeHighlight, afterHighlight] = caption.text.split(
    caption.highlight,
  );

  return (
    /*
      The sheet that rises over the pinned hero: rounded top corners and its own
      stacking level, so scrolling pulls it up like a curtain. Like every
      section here, its background must stay opaque.
    */
    <section className="relative z-10 rounded-t-[32px] bg-white py-16 md:py-24 lg:py-28">
      <div className="section-shell">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Caption phrase */}
          <Reveal>
            <h2 className="font-raleway text-4xl font-light leading-[1.05] tracking-tight text-wc-verde lowercase md:text-6xl">
              {afterHighlight === undefined ? (
                caption.text
              ) : (
                <>
                  {beforeHighlight}
                  <span className="text-wc-terracota">{caption.highlight}</span>
                  {afterHighlight}
                </>
              )}
            </h2>
          </Reveal>

          <div>
            {/* Explanation, read word by word as the section scrolls */}
            <WordReveal
              paragraphs={descriptionParagraphs}
              emphasis={descriptionEmphasis}
              className="font-outfit text-lg font-light leading-relaxed lowercase"
            />

            {/* What Workclub is made of */}
            <Reveal delay={0.1}>
              {/* Separado del parrafo: el listado empieza una idea despues */}
              <h3 className="mt-12 font-raleway text-2xl font-light text-wc-verde lowercase">
                {somosTitle}
              </h3>
            </Reveal>

            <ul className="">
              {somosItems.map((item, index) => (
                <Reveal
                  key={item}
                  as="li"
                  axis="x"
                  distance={12}
                  index={index}
                  stagger={0.08}
                  className="flex items-start gap-3 border-b border-wc-gris-claro py-3"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wc-terracota"
                    aria-hidden="true"
                  />
                  <span className="font-outfit text-base font-light leading-relaxed text-wc-marron/80 lowercase">
                    {item}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick figures */}
        <Reveal delay={0.1}>
          {/*
            Three columns from the narrowest screen: each figure is one or two
            characters and a two-word label, so stacking them one per row spent
            three rows on three small numbers. At 390px a column is ~100px and
            the label simply wraps onto a second line.
          */}
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-wc-verde-claro pt-8 sm:gap-8 md:mt-16 md:pt-10">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className="font-raleway text-3xl font-light text-wc-verde md:text-4xl">
                  <Num>{fact.value}</Num>
                </dt>
                <dd className="font-outfit text-sm font-light text-wc-verde/80 lowercase">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export default Descripcion;
