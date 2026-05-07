import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => { render(<Button>Click me</Button>); expect(screen.getByText("Click me")).toBeInTheDocument(); });
  it("calls onClick", () => { const fn = vi.fn(); render(<Button onClick={fn}>Click</Button>); fireEvent.click(screen.getByText("Click")); expect(fn).toHaveBeenCalledOnce(); });
  it("shows loader when loading", () => { render(<Button loading>Save</Button>); expect(document.querySelector("svg")).toBeInTheDocument(); });
  it("is disabled when loading", () => { render(<Button loading>Save</Button>); expect(screen.getByRole("button")).toBeDisabled(); });
  it("applies variant classes", () => { render(<Button variant="destructive">Del</Button>); expect(screen.getByRole("button").className).toContain("destructive"); });
});
