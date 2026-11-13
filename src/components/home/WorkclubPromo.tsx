"use client";

import { useEffect, useRef, useState } from "react";
import { workclubPromoConfig } from "./workclubPromo.config";
import { WorkclubPromoBands } from "./WorkclubPromoBands";
import { WorkclubPromoOverlay } from "./WorkclubPromoOverlay";

/**
 * The workclub promo block on the home page, in whichever of its two designs
 * is active.
 *
 * Both are built and shown while the decision is open, so they can be compared
 * on the real page instead of in screenshots. They are stacked in one grid cell
 * and the inactive one is faded out: the block keeps the same height either way,
 * so switching never moves the page under the pointer.
 *
 * Once one is chosen, `showSwitch: false` in the config leaves that one alone
 * on the page, and this file plus the option that lost can be deleted.
 */

type Variant = "a" | "b";

const VARIANTS: Variant[] = ["a", "b"];

/** Survives a reload; see `readStoredVariant` for why it can fail. */
const STORAGE_KEY = "socado:workclub-promo-variant";

/** `/?promo=b` opens an option directly, which is what makes it shareable. */
const QUERY_PARAM = "promo";

const CROSSFADE =
  "transition-opacity duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

function isVariant(value: string | null | undefined): value is Variant {
  return value === "a" || value === "b";
}

export function WorkclubPromo() {
  const { defaultVariant, showSwitch } = workclubPromoConfig;

  /*
    The server always renders `defaultVariant`, and a stored choice is applied
    after mount. Reading the URL or `localStorage` while rendering would either
    disagree with the server markup — a hydration error — or opt this page out
    of static rendering, which is what `useSearchParams` would do.
  */
  const [variant, setVariant] = useState<Variant>(defaultVariant);

  useEffect(() => {
    if (!showSwitch) return;

    const fromUrl = new URLSearchParams(window.location.search).get(
      QUERY_PARAM,
    );

    if (isVariant(fromUrl)) {
      setVariant(fromUrl);
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isVariant(stored)) setVariant(stored);
    } catch {
      // Private window, blocked storage: the default stands. Not worth a log.
    }
  }, [showSwitch]);

  const choose = (next: Variant) => {
    setVariant(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice still applies to this visit.
    }
  };

  // With the switch off there is nothing to compare: one option, on its own.
  if (!showSwitch) {
    return defaultVariant === "a" ? (
      <WorkclubPromoBands />
    ) : (
      <WorkclubPromoOverlay />
    );
  }

  return (
    /*
      One cell, both options in it: the row takes the height of the taller one —
      the strips — and the overlay stretches to it. Nothing below moves when the
      choice changes.
    */
    <div className="relative grid w-full">
      <Layer active={variant === "a"}>
        <WorkclubPromoBands />
      </Layer>
      <Layer active={variant === "b"}>
        <WorkclubPromoOverlay />
      </Layer>

      <VariantSwitch value={variant} onChange={choose} />
    </div>
  );
}

/**
 * One option in the shared cell.
 *
 * A grid of its own, so the option inside stretches to the full height of the
 * cell. Without it the layer takes the row height — set by the taller option —
 * while the section inside keeps its own, and the shorter option ends up with
 * the page showing under it.
 *
 * The hidden one is taken out three ways on purpose: `opacity` for the eye,
 * `pointer-events` for the pointer and `inert` for the keyboard and assistive
 * technology, because it still has a link inside it that must not be reachable.
 */
function Layer({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`grid [grid-area:1/1] ${CROSSFADE} ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </div>
  );
}

/**
 * The switch: two letters, barely there until you look for them.
 *
 * Top right, away from the floating "pide aquí" button at the bottom. It is a
 * radio group, so the arrow keys move between the options and only the active
 * one is in the tab order — the pattern expected of a segmented control.
 */
function VariantSwitch({
  value,
  onChange,
}: {
  value: Variant;
  onChange: (next: Variant) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !back) return;

    event.preventDefault();
    const next = (index + (forward ? 1 : -1) + VARIANTS.length) % VARIANTS.length;
    onChange(VARIANTS[next]);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="opción de diseño del bloque workclub"
      className="absolute right-4 top-4 z-10 flex gap-1 rounded-full bg-black/25 p-1 opacity-60 backdrop-blur-sm transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none md:right-6 md:top-6"
    >
      {VARIANTS.map((option, index) => {
        const active = option === value;

        return (
          <button
            key={option}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`opción ${option}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`h-6 min-w-6 cursor-pointer rounded-full px-2 font-outfit text-[11px] lowercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              active
                ? "bg-white/90 text-wc-verde"
                : "text-white/70 hover:text-white"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default WorkclubPromo;
