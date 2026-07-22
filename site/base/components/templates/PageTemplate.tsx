import React from 'react';
import Link from 'next/link';
import Sidebar from '../organisms/Sidebar';
import useMenuStore from '@base/stores/useMenuStore';

interface Props {
  header?: React.ReactNode;
  footer: React.ReactNode;
  children?: React.ReactNode;
  hideSidebar?: boolean;
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export default function PageTemplate({ header, footer, children, hideSidebar = false }: Props) {
  const isSidebarCollapsed = useMenuStore((state) => state.isSidebarCollapsed);
  const setIsMobileMenuActive = useMenuStore((state) => state.setIsMobileMenuActive);

  return (
    <div className="min-h-screen bg-[#f1f4fe] dark:bg-midnight-950 text-[#171a1f] dark:text-light font-base">
      {/* Navigation Sidebar (off-canvas drawer on mobile) */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content Area — the sidebar only offsets content from the `lg` breakpoint up. */}
      <div
        className={`flex flex-col min-w-0 min-h-screen transition-all duration-300 pl-0 ${hideSidebar
          ? 'lg:pl-0'
          : isSidebarCollapsed
            ? 'lg:pl-[60px]'
            : 'lg:pl-[215px]'
          }`}
      >
        {/* Mobile top bar with hamburger — hidden once the sidebar docks at lg. */}
        {!hideSidebar && (
          <div className="lg:hidden sticky top-0 z-30 flex items-center gap-[12px] h-[56px] px-[16px] bg-[#f1f4fe] dark:bg-midnight-950 border-b border-[#dee1e6] dark:border-midnight-800">
            <button
              type="button"
              onClick={() => setIsMobileMenuActive(true)}
              aria-label="Open menu"
              className="flex items-center justify-center w-[38px] h-[38px] rounded-[8px] text-[#565d6d] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <HamburgerIcon />
            </button>
            <Link href="/" className="flex items-center gap-[8px] min-w-0">
              <div className="flex-shrink-0 w-[26px] h-[26px] flex items-center justify-center rounded-[6px] bg-[#5570f6]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#5570f6] dark:text-primary-400 truncate">
                AI Navigator
              </span>
            </Link>
          </div>
        )}

        {/* Header bar (rendered if provided) */}
        {header && header}

        {/* Page Content */}
        <main className="flex-1 min-w-0 bg-gray-100 dark:bg-midnight-900 p-[16px] sm:p-[24px] w-full max-w-full overflow-x-hidden">
          {children}
        </main>

        {/* Footer */}
        {footer}
      </div>
    </div>
  );
}
