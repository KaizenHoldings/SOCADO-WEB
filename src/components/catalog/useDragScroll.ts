"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Horizontal drag-to-scroll behaviour for the catering navigation tracks.
 *
 * Mirrors what StickyCategoryBar does inline. Written as a hook so the
 * subcategory bar does not carry a second hand-maintained copy of the drag
 * maths, the snap suppression and the click-prevention.
 */

/** Travel beyond which a press counts as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 5;

/** Amplifies pointer travel into scroll distance so dragging is not sluggish. */
const DRAG_MULTIPLIER = 1.5;

/** Distance one arrow press moves the track. */
const SCROLL_STEP_PX = 200;

export function useDragScroll() {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  /** True once a press has travelled far enough to count as a drag. */
  const didDragRef = useRef(false);
  /** Pending rAF id, so at most one scroll write happens per frame. */
  const rafRef = useRef<number | null>(null);
  const pendingScrollRef = useRef(0);

  const [isGrabbing, setIsGrabbing] = useState(false);

  // Cancel any frame still queued when the consumer unmounts.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    // Cleared here as well as on click, so a drag that ended outside the track
    // cannot leave a stale flag that swallows the next genuine click.
    didDragRef.current = false;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = track.scrollLeft;
    // Kill snapping synchronously. A className toggle only lands once React
    // commits, so the opening frames of the drag would still fight the snap
    // engine. Inline style outranks the class; clearing it hands control back.
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

    const track = trackRef.current;
    if (track) track.style.scrollSnapType = "";

    setIsGrabbing(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const delta = e.pageX - startXRef.current;
    // The threshold reads raw pointer travel, never the amplified value, so the
    // multiplier cannot turn a small tremor into a false drag.
    if (Math.abs(delta) > DRAG_THRESHOLD_PX) didDragRef.current = true;

    // Read now, write on the next frame: a high-polling-rate mouse fires
    // mousemove far more often than the display refreshes.
    pendingScrollRef.current = startScrollLeftRef.current - delta * DRAG_MULTIPLIER;

    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const track = trackRef.current;
      if (track) track.scrollLeft = pendingScrollRef.current;
    });
  };

  /**
   * Capture phase, so it intercepts the click a browser fires after a drag
   * before it can reach the pill underneath.
   */
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    didDragRef.current = false;
  };

  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * SCROLL_STEP_PX,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  /**
   * Centres the element matching `selector` within the track.
   *
   * `scrollIntoView` is deliberately avoided: it walks up and scrolls every
   * scrollable ancestor including the document, which would move the page out
   * from under a docked bar.
   */
  const centerActive = (selector: string) => {
    if (isDraggingRef.current) return;

    const track = trackRef.current;
    const active = track?.querySelector<HTMLElement>(selector);
    if (!track || !active) return;

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
  };

  return {
    trackRef,
    isGrabbing,
    prefersReducedMotion,
    /** Spread onto the scrollable track element. */
    trackHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp: endDrag,
      onMouseLeave: endDrag,
      onClickCapture,
    },
    scrollLeftAction: () => scrollByStep(-1),
    scrollRightAction: () => scrollByStep(1),
    centerActive,
  };
}
