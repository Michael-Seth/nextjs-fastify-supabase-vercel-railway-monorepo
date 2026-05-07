import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton, SkeletonTable, SkeletonCard } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders with animate-pulse class", () => { const { container } = render(<Skeleton className="h-4 w-32" />); expect(container.firstChild).toHaveClass("animate-pulse"); });
  it("SkeletonTable renders correct rows", () => { const { container } = render(<SkeletonTable rows={3} cols={2} />); expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(3); });
  it("SkeletonCard renders", () => { const { container } = render(<SkeletonCard />); expect(container.querySelectorAll(".animate-pulse").length).toBe(3); });
});
