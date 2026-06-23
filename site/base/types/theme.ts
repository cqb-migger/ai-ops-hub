import { ThemeTypes } from '@base/constants';

export interface ThemeState {
  theme: ThemeTypes;
  toggleTheme: () => void;
}
