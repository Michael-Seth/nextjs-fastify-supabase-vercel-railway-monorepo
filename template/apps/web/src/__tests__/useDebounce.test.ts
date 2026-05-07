import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it("returns initial value immediately", () => { const { result } = renderHook(() => useDebounce("hello", 300)); expect(result.current).toBe("hello"); });
  it("delays update", () => { const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), { initialProps: { v: "a" } }); rerender({ v: "b" }); expect(result.current).toBe("a"); act(() => vi.advanceTimersByTime(300)); expect(result.current).toBe("b"); });
  it("cancels previous timer on rapid changes", () => { const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), { initialProps: { v: "a" } }); rerender({ v: "b" }); rerender({ v: "c" }); act(() => vi.advanceTimersByTime(300)); expect(result.current).toBe("c"); });
});
