import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "@/hooks/usePagination";

describe("usePagination", () => {
  it("initialises with page 1", () => { const { result } = renderHook(() => usePagination()); expect(result.current.page).toBe(1); });
  it("next() increments page", () => { const { result } = renderHook(() => usePagination()); act(() => result.current.next()); expect(result.current.page).toBe(2); });
  it("prev() does not go below 1", () => { const { result } = renderHook(() => usePagination()); act(() => result.current.prev()); expect(result.current.page).toBe(1); });
  it("reset() returns to 1", () => { const { result } = renderHook(() => usePagination()); act(() => result.current.next()); act(() => result.current.next()); act(() => result.current.reset()); expect(result.current.page).toBe(1); });
  it("calculates offset correctly", () => { const { result } = renderHook(() => usePagination(3, 20)); expect(result.current.offset).toBe(40); });
});
