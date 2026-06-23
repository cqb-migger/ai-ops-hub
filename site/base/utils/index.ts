import { ThemeTypes } from '@base/constants';

export const isDark = (theme: ThemeTypes) => theme == ThemeTypes.dark;
export const setTheme = (theme: ThemeTypes) => {
  const root = window.document.documentElement;
  root.classList.remove(isDark(theme) ? ThemeTypes.light : ThemeTypes.dark);
  root.classList.add(theme);
};
