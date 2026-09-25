"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StickyCategory {
  id: string | number;
  name: string;
}

interface StickyCategoryBarProps {
  categories: StickyCategory[];
  selectedCategory: string | number;
  onSelectCategory: (id: string | number) => void;
  /**
   * The original category selector. While any part of it is on screen the bar
   * stays hidden; it only appears once that element has scrolled off the top.
   */
  watchRef: React.RefObject<HTMLElement | null>;
  /**
   * Notifies the parent when the bar docks or leaves, so siblings (the
   * ViewModeToggle, the subcategory bar) can react to the same signal.
   */
  onVisibilityChange?: (visible: boolean) => void;
}

/**
 * Offset of the sticky stack already pinned above this bar:
 * site header (76px) + ViewModeToggle.
 *
 * Uses the toggle's COMPACT height (77 / 90px), not its resting height: this
 * bar only ever renders while the toggle has shrunk, so 76+77 and 76+90.
 * The bar is fixed rather than sticky so appearing and disappearing never
 * reflows the product grid underneath it.
 */
// El header se retira mientras esta barra esta acoplada, asi que solo queda
// el ViewModeToggle compacto encima: 77 / 90px.
const TOP_OFFSET = "top-[77px] md:top-[90px]";

// parametro de aparicion barra categoria
/**
 * How far down the viewport the observer's top edge sits, in pixels.
 *
 * Fed to `rootMargin` as a negative top inset, so it is the line the category
 * grid's bottom edge must cross for the bar to fade in. **Raise it to make the
 * bar appear earlier in the scroll, lower it to delay the bar.**
 *
 * It no longer tracks the sticky stack height (172/188px) — that only governs
 * where the bar is pinned, which is `TOP_OFFSET`. Decoupling the two lets the
 * bar arrive while the tail of the grid is still on screen.
 */
const CATEGORY_BAR_APPEARANCE_OFFSET = 320;

/**
 * Travel beyond which a press counts as a drag rather than a click. Small
 * enough that deliberate taps still register, large enough to absorb the few
 * pixels of tremor in an ordinary click.
 */
const DRAG_THRESHOLD_PX = 5;

/**
 * Amplifies pointer travel into scroll distance. A 1:1 mapping feels sluggish
 * because the labels are short and the track is wide; 1.5 covers the row in a
 * comfortable sweep without overshooting.
 */
const DRAG_MULTIPLIER = 1.5;

/** Distance one arrow press moves the track. */
const SCROLL_STEP_PX = 200;

export function StickyCategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
  watchRef,
  onVisibilityChange,
}: StickyCategoryBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ── Visibility: driven by the original selector leaving the top ──────────
  useEffect(() => {
    const target = watchRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // `boundingClientRect.top < 0` distinguishes "scrolled past" from
        // "not reached yet" — without it the bar would also show while the
        // selector is still below the fold.
        setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: `-${CATEGORY_BAR_APPEARANCE_OFFSET}px 0px 0px 0px` },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [watchRef]);

  // Report docking state to the parent so siblings can respond to it.
  useEffect(() => {
    onVisibilityChange?.(isVisible);
  }, [isVisible, onVisibilityChange]);

  // ── Keep the active category in view when it changes ─────────────────────
  useEffect(() => {
    if (!isVisible) return;
    // Never fight a drag in progress. A suppressed click leaves
    // `selectedCategory` untouched so this effect will not re-run at all, but
    // a selection arriving from elsewhere mid-drag would otherwise yank the
    // track out from under the pointer.
    if (isDraggingRef.current) return;

    const track = trackRef.current;
    const active = track?.querySelector<HTMLElement>('[data-active="true"]');
    if (!track || !active) return;

    // Centre the active chip by writing the track's own scrollLeft.
    // `scrollIntoView` is deliberately avoided: it walks up and scrolls every
    // scrollable ancestor including the document, and this bar is
    // position:fixed — moving the page would re-trigger the IntersectionObserver
    // that governs the bar's own visibility.
    const trackRect = track.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const offsetWithinTrack = activeRect.left - trackRect.left;
    const centeringOffset = (trackRect.width - activeRect.width) / 2;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = track.scrollLeft + offsetWithinTrack - centeringOffset;

    track.scrollTo({
      left: Math.max(0, Math.min(target, maxScroll)),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [isVisible, selectedCategory, prefersReducedMotion]);

  // ── Mouse drag-to-scroll (desktop) ───────────────────────────────────────
  // Touch devices already scroll natively, so this is pointer-only and never
  // interferes with the native gesture.
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  /** True once a press has travelled far enough to count as a drag, not a click. */
  const didDragRef = useRef(false);
  /** Pending rAF id, so at most one scroll write happens per frame. */
  const rafRef = useRef<number | null>(null);
  /** Target scrollLeft awaiting the next frame. */
  const pendingScrollRef = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Cancel any frame still queued when the bar unmounts.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    // Cleared here as well as on click, so a drag that ended outside the bar
    // cannot leave a stale flag that swallows the next genuine click.
    didDragRef.current = false;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = track.scrollLeft;
    // Kill snapping synchronously. The className toggle below only lands once
    // React commits, so the first frames of every drag would otherwise still
    // be fighting the snap engine — which is the catch you feel at drag start.
    // Inline style outranks the utility class, and clearing it hands control
    // back to the class on release.
    track.style.scrollSnapType = "none";
    setIsGrabbing(true);
  };

  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Restores the class-driven `snap-x snap-proximity`, letting the browser
    // settle onto the nearest category.
    const track = trackRef.current;
    if (track) track.style.scrollSnapType = "";

    setIsGrabbing(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const delta = e.pageX - startXRef.current;
    // The threshold reads raw pointer travel, never the amplified value —
    // otherwise the multiplier would turn a small tremor into a false drag and
    // swallow a legitimate click.
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) didDragRef.current = true;

    // Read the coordinate now, apply it on the next frame. A high-polling-rate
    // mouse fires mousemove far more often than the display refreshes, and
    // writing scrollLeft on each one forces a synchronous layout every time.
    pendingScrollRef.current = startScrollLeftRef.current - delta * DRAG_MULTIPLIER;

    if (rafRef.current !== null) return; // a write is already queued this frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const track = trackRef.current;
      if (track) track.scrollLeft = pendingScrollRef.current;
    });
  };

  /**
   * Runs in the capture phase, so it intercepts the click that a browser fires
   * after a drag before it can reach the category button underneath.
   */
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    didDragRef.current = false;
  };

  // ── Arrow navigation ─────────────────────────────────────────────────────
  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * SCROLL_STEP_PX,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const scrollLeftAction = () => scrollByStep(-1);
  const scrollRightAction = () => scrollByStep(1);

  if (categories.length === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          key="sticky-category-bar"
          aria-label="categorías"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className={`fixed left-0 right-0 ${TOP_OFFSET} z-30 border-y border-white/10 bg-[#063547] shadow-sm`}
        >
        {/*
          The arrows are siblings of the track, not children, so pressing one
          never reaches the drag handlers or the click-capture guard below.
          Their gradient backgrounds fade to transparent, letting labels scroll
          away underneath rather than stopping at a hard edge — which is why
          the old `mask-image` fade on the track is gone: it now duplicates the
          right arrow and had no left-hand counterpart.
        */}
        <div className="relative">
          <button
            type="button"
            onClick={scrollLeftAction}
            aria-label="categorías anteriores"
            className="absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-[#063547] via-[#063547] to-transparent p-2 pr-6 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b45b38]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onClickCapture={handleClickCapture}
            className={`flex flex-row flex-nowrap items-center gap-6 overflow-x-auto overscroll-x-contain px-14 scroll-pl-14 scroll-pr-14 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
              isGrabbing
                ? // Snapping is dropped mid-drag: with it on, the browser keeps
                  // correcting the scrollLeft we just wrote, which is what made
                  // the drag feel like it was catching.
                  "cursor-grabbing"
                : // Restored the moment the drag ends, so the browser settles
                  // onto the nearest category on release.
                  "cursor-grab snap-x snap-proximity"
            }`}
          >
              {categories.map((cat) => {
                const isActive = String(cat.id) === String(selectedCategory);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    data-active={isActive ? "true" : undefined}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`shrink-0 snap-start whitespace-nowrap rounded-sm px-2 py-3 text-center text-sm lowercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b45b38] ${
                      isActive
                        ? "font-medium text-white"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            onClick={scrollRightAction}
            aria-label="más categorías"
            className="absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-[#063547] via-[#063547] to-transparent p-2 pl-6 text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b45b38]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
