import useThemeStore from '@base/stores/useThemeStore';
import { isDark } from '@base/utils';

function ThemeButton() {
  const [theme, toggleTheme] = useThemeStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);

  return (
    <div
      onClick={toggleTheme}
      className="lg:ml-4 w-10 lg:w-11 flex justify-center items-center hover:bg-blue-50 dark:hover:bg-primary rounded-full cursor-pointer text-lg"
    >
      {isDark(theme) ? '☀️' : '🌙'}
    </div>
  );
}

export default ThemeButton;
