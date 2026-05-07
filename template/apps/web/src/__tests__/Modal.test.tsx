import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/ui/Modal";

describe("Modal", () => {
  it("renders when open", () => { render(<Modal open onClose={vi.fn()} title="Test Modal"><p>Content</p></Modal>); expect(screen.getByText("Test Modal")).toBeInTheDocument(); expect(screen.getByText("Content")).toBeInTheDocument(); });
  it("does not render when closed", () => { render(<Modal open={false} onClose={vi.fn()}><p>Hidden</p></Modal>); expect(screen.queryByText("Hidden")).not.toBeInTheDocument(); });
  it("calls onClose on backdrop click", () => { const fn = vi.fn(); render(<Modal open onClose={fn}><p>x</p></Modal>); const backdrop = document.querySelector(".absolute.inset-0"); fireEvent.click(backdrop!); expect(fn).toHaveBeenCalled(); });
  it("calls onClose on Escape key", () => { const fn = vi.fn(); render(<Modal open onClose={fn}><p>x</p></Modal>); fireEvent.keyDown(document,{key:"Escape"}); expect(fn).toHaveBeenCalled(); });
});
