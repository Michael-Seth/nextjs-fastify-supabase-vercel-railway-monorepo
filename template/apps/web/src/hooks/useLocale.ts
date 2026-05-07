"use client";
import type { Route } from "next";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
const LOCALES = ["en","es","fr","de","pt","zh","ar","ja","ko","hi"] as const;
export type Locale = typeof LOCALES[number];
export function useLocale(currentLocale: Locale) {
  const [pending, startTransition] = useTransition();
  const router   = useRouter();
  const pathname = usePathname();
  const setLocale = (locale: Locale) => startTransition(() => {
    const next = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.replace(next as Route);
  });
  return { locales: LOCALES, currentLocale, setLocale, pending };
}
