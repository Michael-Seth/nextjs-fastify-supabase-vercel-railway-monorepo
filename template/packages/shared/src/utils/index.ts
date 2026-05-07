// ── Shared utilities (safe for both Node and browser) ───────────────────────

/** Sleep for n milliseconds */
export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** Capitalize first letter */
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Convert snake_case to Title Case */
export const snakeToTitle = (s: string) => s.split("_").map(capitalize).join(" ");

/** Generate initials from a name */
export const initials = (name: string) =>
  name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

/** Truncate string to n chars */
export const truncate = (s: string, n = 50) => s.length > n ? s.slice(0, n) + "…" : s;

/** Safe JSON parse */
export function safeJsonParse<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

/** Pick keys from object */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {} as Pick<T, K>);
}

/** Omit keys from object */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result as Omit<T, K>;
}

/** Deduplicate array by key */
export function uniqueBy<T>(arr: T[], key: (item: T) => unknown): T[] {
  const seen = new Set();
  return arr.filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; });
}

/** Group array by key */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item);
    return { ...acc, [k]: [...(acc[k] ?? []), item] };
  }, {} as Record<string, T[]>);
}

/** Clamp a number between min and max */
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Format bytes to human-readable string */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

/** Check if value is a plain object */
export const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && Object.getPrototypeOf(v) === Object.prototype;

/** Deep merge two objects */
export function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const b = base[key], o = override[key];
    if (isPlainObject(b) && isPlainObject(o)) {
      result[key] = deepMerge(
        b as Record<string, unknown>,
        o as Record<string, unknown>
      ) as T[keyof T];
    } else if (o !== undefined) {
      result[key] = o as T[keyof T];
    }
  }
  return result;
}
