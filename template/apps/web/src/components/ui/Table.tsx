"use client";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <div className="w-full overflow-auto"><table className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>;
}
export const TableHeader = ({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className={cn("border-b", className)} {...p} />;
export const TableBody   = ({ className, ...p }: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody className={cn("[&_tr:last-child]:border-0", className)} {...p} />;
export const TableRow    = ({ className, ...p }: React.HTMLAttributes<HTMLTableRowElement>) => <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...p} />;
export const TableHead   = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)} {...p} />;
export const TableCell   = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className={cn("p-4 align-middle", className)} {...p} />;

interface SortableHeadProps { label: string; field: string; sort?: { field: string; dir: "asc" | "desc" }; onSort?: (f: string) => void; }
export function SortableHead({ label, field, sort, onSort }: SortableHeadProps) {
  const active = sort?.field === field;
  return (
    <TableHead>
      <button className="flex items-center gap-1 font-medium" onClick={() => onSort?.(field)}>
        {label}
        {active ? (sort!.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
      </button>
    </TableHead>
  );
}
