"use client";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useRetryQueue } from "@/hooks/useRetryQueue";
import { useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { flush } = useRetryQueue();
  useEffect(() => { if (online) flush(); }, [online, flush]);
  if (online) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg text-sm font-medium">
      <WifiOff className="h-4 w-4" />
      You are offline — changes will sync when you reconnect
    </div>
  );
}
