import React from 'react';
import Sidebar from '../organisms/Sidebar';
import useMenuStore from '@base/stores/useMenuStore';

interface Props {
  header?: React.ReactNode;
  footer: React.ReactNode;
  children?: React.ReactNode;
  hideSidebar?: boolean;
}

export default function PageTemplate({ header, footer, children, hideSidebar = false }: Props) {
  const isSidebarCollapsed = useMenuStore((state) => state.isSidebarCollapsed);

  return (
    <div className="min-h-screen bg-[#f1f4fe] dark:bg-midnight-950 text-[#171a1f] dark:text-light font-base">
      {/* Navigation Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${hideSidebar
          ? 'pl-0'
          : isSidebarCollapsed
            ? 'pl-[60px]'
            : 'pl-[215px]'
          }`}
      >
        {/* Header bar (rendered if provided) */}
        {header && header}

        {/* Page Content */}
        <main className="flex-1 bg-gray-100 dark:bg-midnight-900 p-[24px] w-full">
          {children}
        </main>

        {/* Footer */}
        {footer}
      </div>
    </div>
  );
}
