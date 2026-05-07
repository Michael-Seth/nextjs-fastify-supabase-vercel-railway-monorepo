"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sideClasses: Record<string, string> = {
  left:   "inset-y-0 left-0 h-full border-r",
  right:  "inset-y-0 right-0 h-full border-l",
  top:    "inset-x-0 top-0 border-b",
  bottom: "inset-x-0 bottom-0 border-t",
};

const defaultSize: Record<string, string> = {
  left: "w-80", right: "w-80", top: "h-64", bottom: "h-64",
};

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right" | "top" | "bottom";
  size?: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, side = "right", size, children }: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 bg-card shadow-xl flex flex-col",
            sideClasses[side],
            size ?? defaultSize[side]
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            {title && (
              <DialogPrimitive.Title className="text-lg font-semibold">
                {title}
              </DialogPrimitive.Title>
            )}
            <DialogPrimitive.Close className="ml-auto text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
