import { create } from 'zustand'

/**
 * Ephemeral layout/chrome state shared between distant components.
 *
 * Separate from `cart.store` on purpose: that one is commercial state and is
 * persisted, while this is view state that must NOT survive a reload — a stale
 * `isCategoryNavDocked` would hide the site header on load.
 */
interface UIState {
  /**
   * True while the catering category bar is docked at the top.
   *
   * Written by the catering view, read by the global Header (which slides out
   * of the way) and by the catering chrome that stacks beneath it.
   */
  isCategoryNavDocked: boolean
  setCategoryNavDocked: (docked: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  isCategoryNavDocked: false,
  setCategoryNavDocked: (docked) => set({ isCategoryNavDocked: docked }),
}))
