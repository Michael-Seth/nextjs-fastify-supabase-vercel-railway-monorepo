import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useFeature } from "@/hooks/useFeature";
import { useFeatureFlagStore } from "@/stores/featureFlagStore";

describe("useFeature", () => {
  beforeEach(() => useFeatureFlagStore.setState({ flags: { betaDashboard: false, newEditor: true } }));
  it("returns false for disabled flag", () => { const { result } = renderHook(() => useFeature("betaDashboard")); expect(result.current).toBe(false); });
  it("returns true for enabled flag", () => { const { result } = renderHook(() => useFeature("newEditor")); expect(result.current).toBe(true); });
  it("returns false for unknown flag", () => { const { result } = renderHook(() => useFeature("nonExistent")); expect(result.current).toBe(false); });
  it("updates when flag changes", () => { const { result } = renderHook(() => useFeature("betaDashboard")); act(() => useFeatureFlagStore.getState().setFlag("betaDashboard", true)); expect(result.current).toBe(true); });
});
