import { useEffect, useState } from 'react';

/**
 * True when the viewport is at Tailwind's `lg` breakpoint (1024px) or wider.
 *
 * SSR-safe: defaults to desktop so the server render matches the pre-responsive layout,
 * then corrects on mount. Use it to disable desktop-only affordances (e.g. the sidebar
 * collapse toggle) on small screens.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return isDesktop;
}
