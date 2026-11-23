"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { InfoCard, Pass } from "@/lib/services/workclub-passes.service";
import { Num } from "./Num";
import { ReservaButton } from "./ReservaButton";

/**
 * What a pass includes, behind the "más información" button of its card.
 *
 * The card stays short on purpose — three of them have to read at a glance and
 * fit one screen — so everything that did not fit lives here: the detail list
 * written for the plan, and the benefits its pass type gives every plan under
 * it. The way out is the booking site.
 *
 * Built here rather than with the catalog's modals: those are for the shop, in
 * the azul socado palette, and none of them handles the keyboard. This one is
 * a dialog proper — Escape closes it, focus moves in and comes back to the
 * button that opened it, and the page behind does not scroll.
 *
 * It is rendered into `body` through a portal, which is not optional: the
 * sections of /workclub hang from a `relative z-10` wrapper, and that is a
 * stacking context. Left inside it, the dialog's z-index would only count
 * among its siblings and the header — `fixed z-50` in the root — would sit on
 * top of it.
 */

interface PassDetailModalProps {
  /** The pass to describe; `null` keeps the dialog closed. */
  pass: Pass | null;
  /** Info cards of the pass type, so the modal can show what the group gives. */
  groupCards: InfoCard[];
  onClose: () => void;
}

/**
 * Heading over the plan's own detail lines when it does not carry one.
 *
 * The same words as the pass type's card, which is deliberate: the reader is
 * looking at one list of what they get. `sameHeading` is what keeps them from
 * being printed twice.
 */
const DEFAULT_DETAILS_TITLE = "incluye:";

/**
 * Whether two headings read the same, which is what matters here: the pass
 * type's card and a plan's list both say "incluye", and the colon, the case or
 * a stray space are not a reason to repeat the word.
 */
function sameHeading(a: string, b: string): boolean {
  const normalize = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/[\s:.]+$/, "");

  return normalize(a) === normalize(b);
}

/** Only the benefits card: the rate tables are reference for the page, not for one pass. */
function includesCards(cards: InfoCard[]) {
  return cards.filter(
    (card): card is Extract<InfoCard, { type: "includes" }> =>
      card.type === "includes" && card.items.length > 0,
  );
}

export function PassDetailModal({
  pass,
  groupCards,
  onClose,
}: PassDetailModalProps) {
  const open = pass !== null;

  const panelRef = useRef<HTMLDivElement>(null);
  /** The element that had focus, to hand it back when the dialog closes. */
  const openerRef = useRef<Element | null>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);

    /*
      The page behind must not scroll under the dialog. The previous value is
      restored instead of being cleared, so a drawer or modal that was already
      holding the body keeps its hold when this one closes.
    */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Into the panel, so the next Tab lands on the close button, not the page.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;

      const opener = openerRef.current;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [open, close]);

  // Only ever true after a click, so `document` is there when the portal opens.
  if (!pass) return null;

  /*
    A plan can be an exception to what its type gives everyone — room booking
    carries no café socado — and then repeating the type's card here would
    promise something this plan does not have. The card stays on the page
    under the price cards: there it describes the type, not one plan.
  */
  const cards = pass.excludesGroupBenefits ? [] : includesCards(groupCards);
  const titleId = `pass-modal-${pass.slug}`;

  const detailsTitle = pass.detailsTitle ?? DEFAULT_DETAILS_TITLE;
  const hasDetails = pass.details.length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      {/* Backdrop. The dialog's own close paths are the button and Escape. */}
      <button
        type="button"
        aria-label="cerrar"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-wc-marron/50 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_24px_60px_-20px_rgb(52_37_28_/_0.45)] outline-none sm:rounded-3xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-300"
      >
        <button
          type="button"
          onClick={close}
          aria-label="cerrar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-wc-marron-claro/60 text-wc-verde transition-colors duration-200 hover:bg-wc-marron-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wc-verde"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="wc-scroll flex-1 overflow-y-auto px-6 pb-6 pt-8 sm:px-8 sm:pt-10">
          <h2
            id={titleId}
            className="pr-10 font-raleway text-2xl font-semibold text-wc-verde lowercase"
          >
            {pass.name}
          </h2>

          {pass.description && (
            <p className="mt-2 font-outfit text-sm font-light leading-relaxed text-wc-marron/75 lowercase">
              {pass.description}
            </p>
          )}

          {/* Price, as on the card: the reader should recognise what they clicked */}
          <p className="mt-5 flex items-baseline gap-2 border-t border-wc-gris-claro pt-5 lowercase">
            <span className="font-raleway text-base font-light text-wc-marron/70">
              {pass.pricePrefix}
            </span>
            <span className="font-outfit text-4xl font-light text-wc-terracota-medio">
              {pass.price}
            </span>
            {pass.priceSuffix && (
              <span className="font-outfit text-2xl font-light text-wc-terracota-medio">
                {pass.priceSuffix}
              </span>
            )}
            {pass.period && (
              <span className="font-outfit text-sm font-light text-wc-marron/70">
                <Num>{pass.period}</Num>
              </span>
            )}
          </p>

          {pass.chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {pass.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full bg-wc-terracota-claro/30 px-4 py-1 font-raleway text-xs font-semibold text-wc-verde lowercase"
                >
                  <Num>{chip}</Num>
                </li>
              ))}
            </ul>
          )}

          {pass.secondaryLine && (
            <p className="mt-3 font-outfit text-sm font-light text-wc-marron/70 lowercase">
              <Num>{pass.secondaryLine}</Num>
            </p>
          )}

          {/* What this plan gives, written for it */}
          {hasDetails && (
            <>
              <h3 className="mt-6 font-raleway text-base font-semibold text-wc-verde lowercase">
                {/* "incluye" only fits a list of benefits; rates need their own */}
                {detailsTitle}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {pass.details.map((detail, index) => (
                  <li
                    key={`${detail}-${index}`}
                    className="flex items-start gap-3 font-outfit text-sm font-light leading-relaxed text-wc-marron/80 lowercase"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wc-terracota"
                      aria-hidden="true"
                    />
                    {/*
                      Wrapped: `Num` returns a fragment of several nodes, and
                      loose inside a flex row every one of them becomes an item
                      with the row's gap around it — the digits of a schedule
                      ended up floating apart from their own words.
                    */}
                    <span>
                      <Num>{detail}</Num>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* And what every plan of this type gives, which is just as true here */}
          {cards.map((card, cardIndex) => {
            /*
              Both lists answer "what do I get", and the pass type's card now
              says "incluye:" — the same heading a plan's own list carries. Two
              of them, one under the other, read as a mistake, so the second is
              dropped and its items continue the list above. Compared instead
              of hardcoded: either heading is editable in the admin, and the
              moment they differ the card speaks for itself again.
            */
            const repeatsHeading = hasDetails && sameHeading(card.title, detailsTitle);

            return (
              <section
                key={`${card.title}-${cardIndex}`}
                className={repeatsHeading ? "mt-3" : "mt-6"}
              >
                {card.title && !repeatsHeading && (
                  <h3 className="font-raleway text-base font-semibold text-wc-verde lowercase">
                    <Num>{card.title}</Num>
                  </h3>
                )}
                <ul className="mt-3 flex flex-col gap-3">
                  {card.items.map((item, index) => (
                    <li
                      key={`${item.title}-${index}`}
                      className="border-l-2 border-wc-terracota-medio pl-3"
                    >
                      <p className="font-raleway text-sm font-semibold text-wc-verde lowercase">
                        <Num>{item.title}</Num>
                      </p>
                      {item.detail && (
                        <p className="font-outfit text-sm font-light leading-snug text-wc-marron/80 lowercase">
                          <Num>{item.detail}</Num>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/*
          Pinned under the scrolling area, so the way out is reachable without
          reading to the end of a long list.
        */}
        <div className="border-t border-wc-gris-claro bg-white px-6 pb-6 pt-4 sm:px-8">
          <ReservaButton
            href={pass.ctaHref}
            paquete={pass.ctaPaquete}
            variant="solid"
            block
          >
            unirme
          </ReservaButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default PassDetailModal;
