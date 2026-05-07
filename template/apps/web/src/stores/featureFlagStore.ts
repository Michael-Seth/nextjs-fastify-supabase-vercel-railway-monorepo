import { create } from "zustand"; import { persist } from "zustand/middleware";
interface FlagState {
  flags: Record<string, boolean>;
  setFlag: (k: string, v: boolean) => void;
  isEnabled: (k: string) => boolean;
  loadRemoteFlags: (flags: Record<string, boolean>) => void;
}
export const useFeatureFlagStore = create<FlagState>()(
  persist((set, get) => ({
    flags: { darkMode: false, betaDashboard: false, newEditor: false },
    setFlag: (k, v) => set(s => ({ flags: { ...s.flags, [k]: v } })),
    isEnabled: (k) => get().flags[k] ?? false,
    loadRemoteFlags: (flags) => set({ flags }),
  }), { name: "feature-flags" })
);
