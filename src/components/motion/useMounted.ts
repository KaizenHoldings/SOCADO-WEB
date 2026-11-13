"use client";

import { useEffect, useState } from "react";

/**
 * False during the server render and the first client render, true afterwards.
 *
 * Entrance animations use it to keep their hidden state out of the server
 * markup: the page is then readable before hydration and if JavaScript never
 * runs, and only once the client has taken over do off-screen elements settle
 * into their hidden state.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default useMounted;
