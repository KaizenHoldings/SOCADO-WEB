"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDragScroll } from "@/components/catalog/useDragScroll";

/**
 * Subcategory pills as a horizontal carousel, docked below the category bar.
 *
 * Lives outside CategoryFilter because `position: sticky` is constrained by the
 * parent box: as the last child of CategoryFilter's root there was no scroll
 * travel and the bar never docked. Rendered as a sibling of the product grid,
 * the containing block spans the whole scrolling region.
 *
 * The pills themselves are untouched — every colour, padding, radius and type
 * class is carried over. Only the wrapper became a scroll track, plus arrows.
 */

interface Subcategory {
  id: string | number;
  name: string;
}

interface SubcategoryBarProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | number | null;
  onSelectSubcategory: (id: string | number) => void;
  /**
   * True while the category bar is docked (and the toggle has shrunk).
   * Shifts this bar up to sit flush under the shorter stack.
   */
  compact?: boolean;
}

/** Shared so CategoryFilter and the catering page cannot disagree on the list. */
export function getActiveSubcategories(
  subcategories: any[],
  selectedCategory: string | number,
): any[] {
  return subcategories.filter((sub) => {
    const parentId = sub.parentCategory?.id ?? sub.parentCategory;
    return String(parentId) === String(selectedCategory);
  });
}

/**
 * Where this bar docks, depending on what is pinned above it.
 *
 *   compact  : header 76 + toggle 77/90 + category bar 44 = 197 / 210
 *   resting  : header 76 + toggle 96/112                  = 172 / 188
 *
 * Literal strings so Tailwind emits both variants.
 */
const TOP_COMPACT = "top-[197px] md:top-[210px]";
const TOP_RESTING = "top-[172px] md:top-[188px]";

export function SubcategoryBar({
  subcategories,
  selectedSubcategory,
  onSelectSubcategory,
  compact = false,
}: SubcategoryBarProps) {
  const {
    trackRef,
    isGrabbing,
    prefersReducedMotion,
    trackHandlers,
    scrollLeftAction,
    scrollRightAction,
    centerActive,
  } = useDragScroll();

  // Bring the active pill into view when the selection changes.
  useEffect(() => {
    centerActive('[data-active="true"]');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategory, prefersReducedMotion]);

  if (subcategories.length === 0) return null;

  return (
    <div className={`sticky ${compact ? TOP_COMPACT : TOP_RESTING} z-20 bg-white dark:bg-[#042430] pt-6 pb-2 transition-[top] duration-300`}>
      {/* Arrows are siblings of the track, so they never reach its handlers. */}
      <div className="relative  ">
        <button
          type="button"
          onClick={scrollLeftAction}
          aria-label="subcategorías anteriores"
          className="absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-white via-white to-transparent p-2 pr-6 text-[#063547]/70 transition-colors hover:text-[#063547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b45b38] dark:from-[#042430] dark:via-[#042430] dark:text-[#b2b5a9] dark:hover:text-[#f2eae6]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          ref={trackRef}
          {...trackHandlers}
          className={`flex flex-row flex-nowrap items-center gap-2 md:gap-3 overflow-x-auto overscroll-x-contain select-none px-14 scroll-pl-14 scroll-pr-14 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
            isGrabbing ? "cursor-grabbing" : "cursor-grab snap-x snap-proximity pb-2"
          }`}
        >
          {subcategories.map((sub) => {
            const isSubActive = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                data-active={isSubActive ? "true" : undefined}
                aria-current={isSubActive ? "true" : undefined}
                onClick={() => onSelectSubcategory(sub.id)}
                className={`shrink-0 snap-start truncate max-w-[200px] sm:max-w-xs md:max-w-sm rounded-full px-5 py-2.5 text-xs font-bold lowercase tracking-wider transition-all md:text-sm ${
                  isSubActive
                    ? "bg-celeste-socado text-white shadow-md"
                    : "bg-black/5 text-[#063547]/70 hover:bg-black/10 hover:text-[#063547] dark:bg-white/5 dark:text-[#b2b5a9] dark:hover:bg-white/10 dark:hover:text-[#f2eae6]"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={scrollRightAction}
          aria-label="más subcategorías"
          className="absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-white via-white to-transparent p-2 pl-6 text-[#063547]/70 transition-colors hover:text-[#063547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#b45b38] dark:from-[#042430] dark:via-[#042430] dark:text-[#b2b5a9] dark:hover:text-[#f2eae6]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
