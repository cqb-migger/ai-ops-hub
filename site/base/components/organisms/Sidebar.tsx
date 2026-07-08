import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import routes from '@base/configs/routers';
import useMenuStore from '@base/stores/useMenuStore';
import useAuthStore from '@base/stores/useAuthStore';

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

function PanelLeftClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
  );
}

function PanelLeftOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />
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
        className={`group relative overflow-hidden flex items-center gap-[12px] h-[36px] rounded-[6px] cursor-pointer transition-all duration-200 ${
          collapsed ? 'px-0 justify-center' : 'px-[12px]'
        } ${
          active
            ? 'text-white'
            : 'text-[#565d6d] hover:text-white dark:text-gray-300'
        }`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-200 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] ${
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
        <span className="relative z-10 flex-shrink-0">{icon}</span>
        {!collapsed && (
          <span className="relative z-10 text-[14px] font-[500] leading-[22px] font-base whitespace-nowrap overflow-hidden text-ellipsis">
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

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const fromPath = router.query.from as string;
  const isToolDetail = router.pathname.startsWith('/tools/');

  const checkIsActive = (href: string) => {
    if (router.pathname === href) return true;
    if (href !== '/' && router.pathname.startsWith(href)) return true;
    if (isToolDetail) {
      if (fromPath) {
        return fromPath === href || (href !== '/' && fromPath.startsWith(href));
      }
      return href === routes.path.home;
    }
    return false;
  };

  const navItems = [
    {
      href: routes.path.home,
      label: 'Dashboard',
      icon: <DashboardIcon />,
      active: checkIsActive(routes.path.home),
    },
    {
      href: routes.path.complianceHub,
      label: 'Compliance Hub',
      icon: <ShieldCheckIcon />,
      active: checkIsActive(routes.path.complianceHub),
    },
    {
      href: routes.path.creativeHub,
      label: 'Creative Hub',
      icon: <PaletteIcon />,
      active: checkIsActive(routes.path.creativeHub),
    },
    {
      href: routes.path.dataHub,
      label: 'Data Hub',
      icon: <ChartColumnIcon />,
      active: checkIsActive(routes.path.dataHub),
    },
  ];

  const adminItems = [
    {
      href: routes.path.manageTools,
      label: 'Manage Tools',
      icon: <WrenchIcon />,
      active: checkIsActive(routes.path.manageTools),
    },
    {
      href: routes.path.users,
      label: 'Users',
      icon: <UsersIcon />,
      active: checkIsActive(routes.path.users),
    },
  ];

  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col justify-between bg-[#f1f4fe] dark:bg-midnight-950 border-r border-[#dee1e6] dark:border-midnight-800 transition-all duration-300 ${
        isSidebarCollapsed ? 'w-[60px]' : 'w-[215px]'
      }`}
    >
      {/* Top Brand Logo & Toggle Button */}
      <div>
        {isSidebarCollapsed ? (
          <div className="flex items-center justify-center h-[64px] border-b border-[#dee1e6] dark:border-midnight-800">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="flex items-center justify-center w-[32px] h-[32px] rounded-[6px] text-[#565d6d] hover:text-[#5570f6] dark:text-gray-300 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-midnight-800 transition-all duration-200 cursor-pointer"
              title="Expand Sidebar"
            >
              <PanelLeftOpen />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between h-[64px] border-b border-[#dee1e6] dark:border-midnight-800 px-[16px]">
            <Link href="/" className="flex items-center gap-[8px] min-w-0 cursor-pointer">
              <div className="flex-shrink-0 w-[28px] h-[28px] flex items-center justify-center rounded-[6px] bg-[#5570f6]">
                <CompassIcon />
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[17px] leading-[20px] text-[#5570f6] dark:text-primary-400 whitespace-nowrap overflow-hidden text-ellipsis">
                AI Navigator
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="flex-shrink-0 flex items-center justify-center w-[24px] h-[24px] rounded-[6px] text-[#565d6d] hover:text-[#5570f6] dark:text-gray-400 dark:hover:text-white hover:bg-primary-50 dark:hover:bg-midnight-800 transition-all duration-200 cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose />
            </button>
          </div>
        )}

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
                  active={item.active}
                  collapsed={isSidebarCollapsed}
                />
              ))}
            </div>
          </div>

          {/* Administration Section */}
          {user?.role === 'admin' && (
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
                    active={item.active}
                    collapsed={isSidebarCollapsed}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div ref={dropdownRef} className="relative border-t border-[#dee1e6] dark:border-midnight-800 flex flex-col p-[12px]">
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className={`absolute bottom-full mb-[8px] z-50 bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] shadow-lg py-[4px] font-base ${
            isSidebarCollapsed ? 'left-[12px] w-[160px]' : 'left-[12px] right-[12px]'
          }`}>
            <div className="px-[12px] py-[6px] border-b border-[#dee1e6] dark:border-midnight-800 min-w-0">
              <span className="block text-[12px] font-bold text-[#171a1f] dark:text-light truncate">
                {user?.name || user?.email || 'Guest'}
              </span>
              <span className="block text-[10px] text-[#565d6d] dark:text-gray-400 truncate">
                {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Guest'}
              </span>
            </div>

            {/* Language Setting */}
            <div className="px-[12px] py-[8px] border-b border-[#dee1e6] dark:border-midnight-800 mb-[4px] flex items-center justify-between">
              <div className="flex items-center gap-[8px] text-[13px] text-[#565d6d] dark:text-gray-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
                <span>言語</span>
              </div>
              <select 
                value={router.locale || 'ja'} 
                onChange={(e) => {
                  const newLocale = e.target.value;
                  router.push(router.pathname, router.asPath, { locale: newLocale });
                }}
                className="bg-transparent text-[12px] font-medium text-[#171a1f] dark:text-light outline-none cursor-pointer focus:ring-2 focus:ring-[#5570f6] rounded-[4px]"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>
            <button
              onClick={() => {
                logout();
                import('react-hot-toast').then(({ default: toast }) => {
                  toast.success('ログアウトしました');
                });
                setShowDropdown(false);
                router.push('/login');
              }}
              className="flex items-center gap-[8px] w-full px-[12px] py-[8px] text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-left font-medium transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              <span>ログアウト</span>
            </button>
          </div>
        )}

        {/* User Profile */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-[12px] h-[48px] px-[4px] rounded-[8px] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer select-none transition-colors ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          }`}
        >
          <div className="relative flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] rounded-full overflow-hidden bg-[#fce4e7] dark:bg-[#4a2e35]">
            <div className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#b3261e] dark:text-red-300 font-base select-none">
              {(user?.name || user?.email || 'AN').substring(0, 2).toUpperCase()}
            </div>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light truncate font-base leading-tight">
                {user?.name || user?.email || 'Guest'}
              </span>
              <span className="text-[11px] text-[#565d6d] dark:text-gray-400 truncate font-base leading-tight">
                {user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Guest'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
