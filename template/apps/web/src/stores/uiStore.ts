import { create } from "zustand";
interface UIState {
  sidebarOpen: boolean; theme: "light" | "dark";
  toggleSidebar: () => void; setSidebarOpen: (v: boolean) => void; toggleTheme: () => void;
}
export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true, theme: "light",
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
