"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps { page: number; totalPages: number; onPageChange: (p: number) => void; className?: string; }

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button onClick={() => onPageChange(Math.max(1, page-1))} disabled={page===1} className="p-2 rounded hover:bg-muted disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
      {pages.map(p => <button key={p} onClick={()=>onPageChange(p)} className={cn("h-9 w-9 rounded text-sm font-medium", p===page ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>{p}</button>)}
      <button onClick={() => onPageChange(Math.min(totalPages, page+1))} disabled={page===totalPages} className="p-2 rounded hover:bg-muted disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}
