"use client";
import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

export interface SearchProps {
  placeholder?: string;
  onSearch: (q: string) => void;
  debounceMs?: number;
  className?: string;
  autoFocus?: boolean;
}

export function Search({ placeholder = "Search…", onSearch, debounceMs = 300, className, autoFocus }: SearchProps) {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, debounceMs);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { onSearch(debounced); }, [debounced]);
  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);
  return (
    <div className={cn("relative flex items-center", className)}>
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      {q && <button onClick={()=>{setQ("");onSearch("");}} className="absolute right-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
    </div>
  );
}
