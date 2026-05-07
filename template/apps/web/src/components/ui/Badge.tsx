import { cn } from "@/lib/utils";
const variants = { default:"bg-primary text-primary-foreground", secondary:"bg-secondary text-secondary-foreground", destructive:"bg-destructive text-destructive-foreground", outline:"border border-input text-foreground", success:"bg-green-100 text-green-800", warning:"bg-yellow-100 text-yellow-800" };
export function Badge({ className, variant="default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)} {...props} />;
}
