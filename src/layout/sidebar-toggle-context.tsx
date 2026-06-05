import { createContext, useContext } from "react";

type SidebarToggleContextValue = {
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
};

const SidebarToggleContext = createContext<SidebarToggleContextValue | null>(null);

export const SidebarToggleProvider = SidebarToggleContext.Provider;

export const useSidebarToggle = () => useContext(SidebarToggleContext);
