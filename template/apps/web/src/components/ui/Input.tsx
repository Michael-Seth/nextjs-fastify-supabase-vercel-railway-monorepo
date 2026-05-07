"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftAddon, rightAddon, type, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="relative flex items-center">
        {leftAddon && <div className="absolute left-3 text-muted-foreground">{leftAddon}</div>}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            leftAddon && "pl-9", rightAddon && "pr-9",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {rightAddon && <div className="absolute right-3 text-muted-foreground">{rightAddon}</div>}
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-muted-foreground text-xs mt-1">{hint}</p>}
    </div>
  )
);
Input.displayName = "Input";
