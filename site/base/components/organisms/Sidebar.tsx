import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '@base/configs/routers';
import useMenuStore from '@base/stores/useMenuStore';

// Icons
function CompassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px] text-white">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l7-2a1 1 0 0 1 .48 0l7 2A1 1 0 0 1 20 6v7z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.02984 19.1713 5.28266 19.2293 5.51266 19.1493C6.18266 18.9193 6.91266 18.9193 7.58266 19.1493C7.81266 19.2293 7.97266 19.4293 8.02266 19.6693C8.16266 20.3693 8.52266 21.0093 9.04266 21.4993C9.21266 21.6693 9.47266 21.7093 9.69266 21.6093C10.4227 21.2593 11.2127 21.0993 12 22Z" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ChartColumnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
}

function SidebarLink({ href, label, icon, active, collapsed }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-[12px] h-[36px] px-[12px] rounded-[6px] cursor-pointer transition-all duration-200 ${
          active
            ? 'bg-[#5570f6] text-white'
            : 'text-[#565d6d] hover:text-[#5570f6] dark:text-gray-300 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-midnight-800'
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && (
          <span className="text-[14px] font-[500] leading-[22px] font-base whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useMenuStore((state) => [
    state.isSidebarCollapsed,
    state.setIsSidebarCollapsed,
  ]);

  const navItems = [
    { href: routes.path.home, label: 'Dashboard', icon: <DashboardIcon /> },
    { href: routes.path.complianceHub, label: 'Compliance Hub', icon: <ShieldCheckIcon /> },
    { href: routes.path.creativeHub, label: 'Creative Hub', icon: <PaletteIcon /> },
    { href: routes.path.dataHub, label: 'Data Hub', icon: <ChartColumnIcon /> },
  ];

  const adminItems = [
    { href: routes.path.manageTools, label: 'Manage Tools', icon: <WrenchIcon /> },
    { href: routes.path.teamUsers, label: 'Team & Users', icon: <UsersIcon /> },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-between bg-[#f1f4fe] dark:bg-midnight-950 border-r border-[#dee1e6] dark:border-midnight-800 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-[64px]' : 'w-[256px]'
      }`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center h-[64px] border-b border-[#dee1e6] dark:border-midnight-800 px-[16px] gap-[10px]">
          <div className="flex-shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[6px] bg-[#5570f6]">
            <CompassIcon />
          </div>
          {!isSidebarCollapsed && (
            <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[20px] leading-[20px] text-[#5570f6] dark:text-primary-400 whitespace-nowrap">
              AI Navigator
            </span>
          )}
        </div>

        {/* Menu Sections */}
        <div className="flex flex-col gap-[24px] p-[12px]">
          {/* Navigation Section */}
          <div className="flex flex-col gap-[8px]">
            {!isSidebarCollapsed && (
              <span className="text-[12px] font-[600] leading-[16px] text-[#565d6d] dark:text-gray-400 tracking-[0.6px] uppercase px-[16px] mt-[12px]">
                Navigation
              </span>
            )}
            <div className="flex flex-col gap-[4px]">
              {navItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={router.pathname === item.href}
                  collapsed={isSidebarCollapsed}
                />
              ))}
            </div>
          </div>

          {/* Administration Section */}
          <div className="flex flex-col gap-[8px]">
            {!isSidebarCollapsed && (
              <span className="text-[12px] font-[600] leading-[16px] text-[#565d6d] dark:text-gray-400 tracking-[0.6px] uppercase px-[16px]">
                Administration
              </span>
            )}
            <div className="flex flex-col gap-[4px]">
              {adminItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={router.pathname === item.href}
                  collapsed={isSidebarCollapsed}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Collapse Button */}
      <div className="p-[12px] border-t border-[#dee1e6] dark:border-midnight-800">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex items-center justify-center lg:justify-start gap-[12px] w-full h-[36px] px-[12px] rounded-[6px] text-[#565d6d] hover:text-[#5570f6] dark:text-gray-300 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-midnight-800 transition-all duration-200"
        >
          <span className="flex-shrink-0">
            <MenuIcon />
          </span>
          {!isSidebarCollapsed && (
            <span className="text-[14px] font-[500] leading-[22px] font-base whitespace-nowrap">
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
