"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type {
  BandColor,
  Pass,
  PassGroup,
} from "@/lib/services/workclub-passes.service";
import { InfoCards } from "./InfoCards";
import { PassDetailModal } from "./PassDetailModal";
import { Num } from "./Num";
import { Reveal } from "./Reveal";
import { ReservaButton } from "./ReservaButton";
import { useMounted } from "./useMounted";

/**
 * Passes, as price cards under a segmented selector.
 *
 * From `md` up the section is one screen tall and reserves the header height
 * at the top, so heading and cards fit in the area the navbar leaves free. The
 * spacing that makes them fit comes from the `wc-packages` scale in styles.css,
 * which tightens on short viewports; it is a `min-height`, so a short screen
 * that cannot hold everything grows instead of cropping.
 *
 * The background is two flat colours: the band of the open pass type above,
 * white below. The band hangs from the middle of the price row — not from the
 * middle of the section — so the dividing line crosses the cards whatever the
 * heading and the info cards measure.
 *
 * The pass types are mutually exclusive, so they share one grid and the
 * selector swaps the cards instead of stacking the groups on the page.
 *
 * Tabs, cards, info cards and footnote come from Payload (`pass-types` and
 * `plans`), handed down by the page: adding a type with plans in the admin adds
 * a tab, and nothing here assumes how many there are. With a single group the
 * selector is hidden.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Band of each pass type: its background and the tone its contents need.
 *
 * A map of literal classes, not an interpolated `bg-${color}`: Tailwind only
 * emits the classes it can see in the source, so a built class name would
 * compile to no background at all.
 *
 * The tone is derived here instead of being configured: on a light band white
 * text falls below AA, so it is the background that decides whether the band
 * is written in white or in dark green. The admin only picks the colour, and
 * `BAND_COLORS` in the service limits that choice to backgrounds that pass
 * contrast with the tone they get.
 *
 * No logo rides on the band: the repository has no socado workclub lockup.
 * TODO: logotipo socado workclub (y una versión para fondo claro, porque la
 * blanca desaparecería sobre `wc-verde-claro`).
 */
const BAND_STYLES: Record<BandColor, { bg: string; tone: "dark" | "light" }> = {
  "wc-verde": { bg: "bg-wc-verde", tone: "dark" },
  "wc-verde-medio": { bg: "bg-wc-verde-medio", tone: "dark" },
  "wc-verde-claro": { bg: "bg-wc-verde-claro", tone: "light" },
  "wc-marron": { bg: "bg-wc-marron", tone: "dark" },
  "wc-marron-medio": { bg: "bg-wc-marron-medio", tone: "dark" },
  "wc-terracota": { bg: "bg-wc-terracota", tone: "dark" },
};

/**
 * Contents of the band per tone.
 *
 * On a light band the text carries no opacity: `text-wc-verde` on
 * `wc-verde-claro` is 4.8:1, and dropping it to 90% already falls under the
 * 4.5:1 the body copy needs. The tab track is white instead of a green tint
 * for the same reason — a 10% green track darkens the background enough to
 * leave the inactive label at 4.2:1.
 */
const BAND_TONES = {
  dark: {
    eyebrow: "text-wc-terracota-claro",
    title: "text-white",
    description: "text-white/70",
    note: "text-white/85",
    noteIcon: "text-wc-verde-claro",
    tabTrack: "bg-white/10",
    tabActive: "bg-white font-semibold text-wc-verde",
    tabInactive: "font-light text-white/80 hover:text-white",
    tabFocus: "focus-visible:outline-white",
  },
  light: {
    eyebrow: "text-wc-marron",
    title: "text-wc-verde",
    description: "text-wc-verde",
    note: "text-wc-verde",
    noteIcon: "text-wc-verde",
    tabTrack: "bg-white/30",
    tabActive: "bg-wc-verde font-semibold text-white",
    tabInactive: "font-light text-wc-verde hover:text-wc-marron",
    tabFocus: "focus-visible:outline-wc-verde",
  },
} as const;

/** Background and text change together when the tab changes. */
const BAND_FADE = "transition-colors duration-500 motion-reduce:transition-none";

/** False on touch devices, where hover states must not stick. */
function useHasHover() {
  const [hasHover, setHasHover] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    const update = () => setHasHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return hasHover;
}

interface PaquetesProps {
  /** Tabs with their cards, already ordered by the service. */
  groups: PassGroup[];
}

/** Query parameter that opens a tab directly, e.g. `?pass=member-pass`. */
const PASS_PARAM = "pass";

export function Paquetes({ groups }: PaquetesProps) {
  const prefersReducedMotion = useReducedMotion();
  const mounted = useMounted();
  const hasHover = useHasHover();

  const [activeGroupId, setActiveGroupId] = useState<string>(
    groups[0]?.id ?? "",
  );
  /** Card under the pointer or holding keyboard focus. */
  const [focusedCard, setFocusedCard] = useState<number | null>(null);

  /** The pass whose modal is open; `null` while none is. */
  const [openPass, setOpenPass] = useState<Pass | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeGroup =
    groups.find((group) => group.id === activeGroupId) ?? groups[0];

  // The service already validates the token; this also covers the group being
  // undefined on the first render of an empty array.
  const band = BAND_STYLES[activeGroup?.bandColor] ?? BAND_STYLES["wc-verde"];
  const tone = BAND_TONES[band.tone];

  /*
    The open tab is read from and written to the URL with the History API, not
    with `useSearchParams`: that hook would opt the whole page out of static
    rendering. `replaceState` also keeps the back button meaning "the previous
    page", not "the previous tab".
  */
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      PASS_PARAM,
    );
    if (requested && groups.some((group) => group.id === requested)) {
      setActiveGroupId(requested);
    }
  }, [groups]);

  const selectGroup = (id: string) => {
    setActiveGroupId(id);
    setFocusedCard(null);

    const url = new URL(window.location.href);
    url.searchParams.set(PASS_PARAM, id);
    window.history.replaceState(null, "", url);
  };

  /** Left/right arrows move between tabs, as expected of a tablist. */
  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + step + groups.length) % groups.length;
    selectGroup(groups[next].id);
    tabRefs.current[next]?.focus();
  };

  // Payload can leave the section without a single tab; the page already
  // falls back, so this only guards against an empty array reaching here.
  if (!activeGroup) return null;

  const { footnote } = activeGroup;
  const hasExtras = activeGroup.infoCards.length > 0 || !!footnote;

  /*
    `wc-packages` carries the vertical scale (see styles.css). The section is
    one screen tall with the header reserved at the top, so heading and cards
    live inside `100dvh - var(--header-h)`: the padding counts inside the
    min-height, because boxes are border-box, and the section still ends at the
    fold. No `scroll-mt` is needed — that same padding is the clearance an
    anchor jump requires.
  */
  return (
    <section
      id="paquetes"
      className="wc-packages relative isolate overflow-hidden bg-white md:grid md:min-h-dvh md:grid-rows-[1fr_auto_1fr] md:pt-[var(--header-h,80px)]"
    >
      {/* Heading, in the upper half */}
      {/* On mobile the band is a block of its own; from md the layer owns it */}
      <div
        className={`${band.bg} ${BAND_FADE} pb-28 pt-14 md:flex md:items-end md:justify-center md:bg-transparent md:pt-0 md:pb-[var(--pass-head-pb)]`}
      >
        <div className="section-shell flex flex-col items-center text-center">
          <Reveal>
            
            {/* From md the size follows the viewport height, capped at the
                48px of `text-5xl`, so a short screen loses height, not
                hierarchy. */}
            <h2
              className={`  mb-4 font-raleway text-4xl font-light tracking-tight lowercase md:text-[clamp(2rem,5dvh,3rem)]/[1.05] ${tone.title} ${BAND_FADE}`}
            >
              nuestros paquetes
            </h2>
          </Reveal>

          {/* Segmented selector. One group needs no selector. */}
          {groups.length > 1 && (
          <Reveal delay={0.1}>
            <div
              role="tablist"
              aria-label="tipos de pass"
              className={`mt-[var(--pass-tabs-mt)] flex w-full max-w-full gap-1 overflow-x-auto rounded-full p-1 scrollbar-hide sm:w-auto sm:overflow-visible ${tone.tabTrack} ${BAND_FADE}`}
            >
              {groups.map((group, index) => {
                const isActive = group.id === activeGroupId;
                return (
                  <button
                    key={group.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${group.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${group.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectGroup(group.id)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`flex-1 shrink-0 cursor-pointer rounded-full px-6 py-2 font-raleway text-[15px] lowercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-none ${
                      tone.tabFocus
                    } ${isActive ? tone.tabActive : tone.tabInactive}`}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          </Reveal>
          )}

          {/* Description of the selected type */}
          <p
            className={`mt-[var(--pass-small-mt)] font-outfit text-base font-light lowercase ${tone.description} ${BAND_FADE}`}
          >
            {activeGroup.description}
          </p>

          {/*
            Inclusion line, kept for the data that still carries one: the
            current content says what a pass includes in its "incluyen" card,
            so this is normally empty and the band ends at the description.
          */}
          {activeGroup.note && (
            <p
              className={`mt-[var(--pass-note-mt)] font-outfit text-sm font-light lowercase ${tone.note} ${BAND_FADE}`}
            >
              <CircleCheck
                className={`mr-2 inline-block h-5 w-5 shrink-0 align-text-bottom ${tone.noteIcon} ${BAND_FADE}`}
                aria-hidden="true"
              />
              {activeGroup.note}
              {activeGroup.noteHighlight && (
                <span className="font-semibold">
                  {" "}
                  <Num>{activeGroup.noteHighlight}</Num>
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Cards, over the dividing line, and the info cards under them */}
      <div className="relative -mt-20 pb-24 md:mt-0 md:pb-0">
        <div className="section-shell">
          <div
            id={`panel-${activeGroup.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeGroup.id}`}
          >
            {/*
              The band is painted from here, from the middle of the price row,
              so the edge between the two colours lands on the exact vertical
              centre of the cards whatever the rest measures. It is full-bleed
              (`w-screen`) because this wrapper is inside the content shell;
              the section clips the overflow.
            */}
            <div className="relative">
              <span
                aria-hidden="true"
                className={`absolute bottom-1/2 left-1/2 -z-10 hidden h-[200vh] w-screen -translate-x-1/2 md:block ${band.bg} ${BAND_FADE}`}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.id}
                  initial={
                    prefersReducedMotion || !mounted ? false : { opacity: 0 }
                  }
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
                >
                  {activeGroup.passes.map((pass, index) => (
                    <PassCard
                      key={pass.slug}
                      pass={pass}
                      index={index}
                      onOpen={() => setOpenPass(pass)}
                      isFocused={focusedCard === index}
                      isDimmed={focusedCard !== null && focusedCard !== index}
                      onFocusChange={(focused) =>
                        setFocusedCard(focused ? index : null)
                      }
                      animate={!prefersReducedMotion}
                      hasHover={hasHover}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/*
              Info cards and footnote: a second presence with the same key, so
              they swap in step with the price cards. They cannot live inside
              the grid above, which is the anchor the band hangs from.
            */}
            {hasExtras && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.id}
                  initial={
                    prefersReducedMotion || !mounted
                      ? false
                      : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mx-auto mt-[var(--pass-info-mt)] max-w-5xl"
                >
                  <InfoCards cards={activeGroup.infoCards} />

                  {footnote && (
                    <p className="mt-[var(--pass-info-mt)] text-center font-outfit text-sm font-light text-wc-marron/70 lowercase">
                      {footnote.label && (
                        <span className="font-raleway font-semibold">
                          {footnote.label}{" "}
                        </span>
                      )}
                      <Num>{footnote.text}</Num>
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Lower half of the grid, so the cards stay centred on the line */}
      <div className="hidden md:block" aria-hidden="true" />

      {/*
        Outside the grid and the tab panel: it is fixed to the viewport, and
        the section clips its overflow.
      */}
      <PassDetailModal
        pass={openPass}
        groupCards={activeGroup.infoCards}
        onClose={() => setOpenPass(null)}
      />
    </section>
  );
}

interface PassCardProps {
  pass: Pass;
  index: number;
  /** Opens the modal of this pass. */
  onOpen: () => void;
  /** Pointer over the card, or keyboard focus inside it. */
  isFocused: boolean;
  /** Another card holds the attention. */
  isDimmed: boolean;
  onFocusChange: (focused: boolean) => void;
  animate: boolean;
  hasHover: boolean;
}

function PassCard({
  pass,
  index,
  onOpen,
  isFocused,
  isDimmed,
  onFocusChange,
  animate,
  hasHover,
}: PassCardProps) {
  const mounted = useMounted();

  /** Transforms are for pointer devices only; colour changes always apply. */
  const lift = animate && hasHover;

  return (
    /* Outer wrapper: the entrance, so it never fights with the hover state */
    <motion.div
      initial={animate && mounted ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: animate ? index * 0.08 : 0,
        ease: EASE,
      }}
      className="h-full"
    >
      <motion.article
        onMouseEnter={() => hasHover && onFocusChange(true)}
        onMouseLeave={() => hasHover && onFocusChange(false)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        animate={{
          y: lift && isFocused ? -10 : 0,
          scale: lift ? (isFocused ? 1.03 : isDimmed ? 0.98 : 1) : 1,
          opacity: isDimmed && hasHover ? 0.6 : 1,
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white p-[var(--pass-pad)] text-center transition-[border-color,box-shadow] duration-400 ease-out ${
          isFocused
            ? "border-wc-verde shadow-[0_24px_48px_-16px_rgb(73_67_40_/_0.35)]"
            : "border-wc-terracota-claro/60"
        }`}
      >
        {/* Top bar, filling from the left */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left bg-wc-verde transition-transform duration-400 ease-out motion-reduce:transition-none"
          style={{ transform: isFocused ? "scaleX(1)" : "scaleX(0)" }}
        />

        {/* Soft sheen, once per hover */}
        {lift && isFocused && (
          <motion.span
            aria-hidden="true"
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />
        )}

        <h3 className="font-raleway text-2xl font-semibold text-wc-verde lowercase">
          {pass.name}
        </h3>

        {/*
          Two lines reserved: with the name on one line, that keeps the price
          and the button of the three cards at the same height without a
          subgrid. The copy is written to fit those two lines.

          `text-balance` shares the words evenly between them. Greedy wrapping
          filled the first line and left whatever did not fit alone on the
          second — "desk." under a full line, "días." under another — so the
          three cards read as three different shapes. A browser without it
          wraps as before, which is the state this replaces.
        */}
        <p className="mt-2 min-h-[2.4rem] text-balance font-outfit text-sm font-light leading-snug text-wc-marron/70 lowercase">
          {pass.description}
        </p>

        {/* Price, over a hairline */}
        <p className="mt-[var(--pass-block-mt)] flex items-baseline justify-center gap-2 border-t border-wc-gris-claro pt-[var(--pass-block-mt)] lowercase">
          <span className="font-raleway text-lg font-light text-wc-marron/70">
            {pass.pricePrefix}
          </span>
          <motion.span
            animate={{
              y: lift && isFocused ? -2 : 0,
              scale: lift && isFocused ? 1.06 : 1,
            }}
            transition={{ duration: 0.35, ease: EASE }}
            className="inline-block font-outfit text-5xl font-light text-wc-terracota-medio md:text-[clamp(2.25rem,5dvh,3rem)]/[1]"
          >
            {pass.price}
          </motion.span>
          {pass.priceSuffix && (
            <span className="font-outfit text-3xl font-light text-wc-terracota-medio">
              {pass.priceSuffix}
            </span>
          )}
        </p>

        {pass.period && (
          <p className="mt-1 font-outfit text-sm font-light text-wc-marron/70 lowercase">
            <Num>{pass.period}</Num>
          </p>
        )}

        {pass.chips.length > 0 && (
          <ul className="mt-[var(--pass-small-mt)] flex flex-wrap items-center justify-center gap-2 md:flex-col">
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
          <p className="mt-[var(--pass-small-mt)] font-outfit text-sm font-light text-wc-marron/70 lowercase">
            <Num>{pass.secondaryLine}</Num>
          </p>
        )}

        <div className="mt-auto pt-[var(--pass-cta-pt)]">
          {/*
            `outline` from the CMS is the card's own outlined style, in
            terracotta; `solid` is the filled one. The label no longer decides
            the look — the plan does, or the pass type it inherits from.
          */}
          <ReservaButton
            onClick={onOpen}
            variant={pass.ctaVariant === "solid" ? "solid" : "outlineSoft"}
            block
            // The arrow means "this leaves the site"; this one opens a dialog.
            hideArrow
            className={
              pass.ctaVariant === "solid"
                ? undefined
                : // Outline cards fill in with a left-to-right sweep behind the label
                  "relative isolate overflow-hidden before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-wc-verde before:transition-transform before:duration-500 before:ease-out group-hover:text-white group-hover:before:scale-x-100 group-focus-within:text-white group-focus-within:before:scale-x-100 motion-reduce:before:transition-none"
            }
          >
            {pass.cta}
          </ReservaButton>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default Paquetes;
