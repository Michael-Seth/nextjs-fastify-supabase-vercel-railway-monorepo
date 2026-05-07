import { useState, useEffect } from "react";
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const h = (e: { matches: boolean }) => setMatches(e.matches);
    h(m);
    m.addEventListener("change", h as (e: MediaQueryListEvent) => void);
    return () => m.removeEventListener("change", h as (e: MediaQueryListEvent) => void);
  }, [query]);
  return matches;
}
export const useIsMobile  = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet  = () => useMediaQuery("(max-width: 1024px)");
export const useIsDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");
