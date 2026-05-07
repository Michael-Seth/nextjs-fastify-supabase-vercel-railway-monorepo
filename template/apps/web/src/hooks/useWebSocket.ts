import { useEffect, useRef, useState, useCallback } from "react";

export type WSStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onError?: (e: Event) => void;
  reconnectDelay?: number;
  maxRetries?: number;
  enabled?: boolean;
}

export function useWebSocket({ url, onMessage, onError, reconnectDelay = 2000, maxRetries = 5, enabled = true }: UseWebSocketOptions) {
  const ws         = useRef<WebSocket | null>(null);
  const retries    = useRef(0);
  const connectRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<WSStatus>("disconnected");

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;
    ws.current = new WebSocket(url);
    ws.current.onopen    = () => { setStatus("connected"); retries.current = 0; };
    ws.current.onmessage = (e) => { try { onMessage?.(JSON.parse(e.data)); } catch { onMessage?.(e.data); } };
    ws.current.onerror   = (e) => { setStatus("error"); onError?.(e); };
    ws.current.onclose   = () => {
      setStatus("disconnected");
      if (retries.current < maxRetries) { retries.current++; setTimeout(() => connectRef.current?.(), reconnectDelay * retries.current); }
    };
  }, [url, enabled, onMessage, onError, reconnectDelay, maxRetries]);

  useEffect(() => { connectRef.current = connect; });

  useEffect(() => {
    if (!enabled) return;
    connect();
    return () => { ws.current?.close(); };
  }, [connect, enabled]);

  const send = useCallback((data: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(data));
  }, []);

  return { status, send, isConnected: status === "connected" };
}
