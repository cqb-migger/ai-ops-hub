import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { ThemeState } from '@base/types/theme';
import { ThemeTypes } from '@base/constants';
import { setTheme } from '@base/utils';

const useStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: ThemeTypes.light,
        toggleTheme: () => {
          const newTheme =
            get().theme == ThemeTypes.light
              ? ThemeTypes.dark
              : ThemeTypes.light;

          setTheme(newTheme);
          set({ theme: newTheme });
        },
      }),
      {
        name: 'theme-storage',
      }
    ),
    { name: 'theme' }
  )
);

const useThemeStore = ((selector, compare) => {
  const store = useStore(selector, compare);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (hydrated) {
    try {
      const stored = localStorage.getItem('theme-storage');
      const themeVal = stored
        ? JSON.parse(stored)?.state?.theme
        : ThemeTypes.light;
      setTheme(themeVal || ThemeTypes.light);
    } catch (e) {
      setTheme(ThemeTypes.light);
    }
  }

  return hydrated
    ? store
    : selector({
        theme: ThemeTypes.light,
        toggleTheme: () => null,
      });
}) as typeof useStore;

export default useThemeStore;
