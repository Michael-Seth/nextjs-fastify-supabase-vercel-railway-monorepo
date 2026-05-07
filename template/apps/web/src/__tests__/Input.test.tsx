import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label", () => { render(<Input label="Email" />); expect(screen.getByText("Email")).toBeInTheDocument(); });
  it("shows error", () => { render(<Input error="Required" />); expect(screen.getByText("Required")).toBeInTheDocument(); });
  it("shows hint", () => { render(<Input hint="Use your work email" />); expect(screen.getByText("Use your work email")).toBeInTheDocument(); });
  it("fires onChange", () => { const fn = vi.fn(); render(<Input onChange={fn} />); fireEvent.change(screen.getByRole("textbox"),{target:{value:"hello"}}); expect(fn).toHaveBeenCalled(); });
});
