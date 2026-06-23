import { MenuState } from '@base/types/menu';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      isMobileMenuActive: false,
      setIsMobileMenuActive: (newVal) => {
        set({ isMobileMenuActive: newVal });
      },
    }),
    { name: 'menu' }
  )
);

export default useMenuStore;
