// src/hooks/useOnlineStatus.ts
import { useState, useEffect } from "react";

export function useOnlineStatus() {
  const [online, setOnline] = useState(true); // always start true on server

  useEffect(() => {
    const on   = () => setOnline(true);
    const off  = () => setOnline(false);
    const sync = () => { if (navigator.onLine) on(); else off(); };
    sync();
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online",  on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return online;
}