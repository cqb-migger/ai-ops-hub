export interface MenuItem {
  key: string;
  text: string;
  to: string;
  isOutside: boolean;
  isActive: boolean;
}

export interface MenuState {
  isMobileMenuActive: boolean;
  setIsMobileMenuActive: (newVal: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (newVal: boolean) => void;
}
