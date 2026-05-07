import { useState, useEffect } from "react";
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  const set = (v: T | ((prev: T) => T)) => {
    const next = v instanceof Function ? v(value) : v;
    setValue(next);
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(next));
  };
  return [value, set] as const;
}
