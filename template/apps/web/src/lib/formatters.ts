import { format, formatDistance, formatRelative, parseISO } from "date-fns";

// Date
export const formatDate       = (d: string | Date, fmt = "MMM d, yyyy") => format(typeof d==="string"?parseISO(d):d, fmt);
export const formatDateTime   = (d: string | Date) => formatDate(d, "MMM d, yyyy h:mm a");
export const formatRelativeDate = (d: string | Date) => formatDistance(typeof d==="string"?parseISO(d):d, new Date(), { addSuffix:true });
export const formatRelativeFull = (d: string | Date) => formatRelative(typeof d==="string"?parseISO(d):d, new Date());

// Number
export const formatNumber     = (n: number, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat("en-US", opts).format(n);
export const formatCurrency   = (n: number, currency = "USD") => new Intl.NumberFormat("en-US", { style:"currency", currency }).format(n);
export const formatPercent    = (n: number) => new Intl.NumberFormat("en-US", { style:"percent", minimumFractionDigits:1 }).format(n);
export const formatCompact    = (n: number) => new Intl.NumberFormat("en-US", { notation:"compact" }).format(n);

// String
export const truncate         = (s: string, n = 50) => s.length > n ? s.slice(0, n) + "…" : s;
export const initials         = (name: string) => name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
