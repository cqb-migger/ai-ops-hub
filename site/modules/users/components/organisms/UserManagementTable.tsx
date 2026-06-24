import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

interface SSOUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  department: string;
  provider: 'Google' | 'Okta' | 'Microsoft';
  lastLogin: string;
  isActive: boolean;
}

const INITIAL_USERS: SSOUser[] = [
  {
    id: '1',
    name: 'Nguyen Van An',
    email: 'an.nguyen@company.com',
    role: 'Admin',
    department: 'Engineering',
    provider: 'Google',
    lastLogin: '2分前',
    isActive: true,
  },
  {
    id: '2',
    name: 'Tran Thi Binh',
    email: 'binh.tran@company.com',
    role: 'Member',
    department: 'Engineering',
    provider: 'Google',
    lastLogin: '1時間前',
    isActive: true,
  },
  {
    id: '3',
    name: 'Le Hoang Chi',
    email: 'chi.le@company.com',
    role: 'Member',
    department: 'Marketing',
    provider: 'Okta',
    lastLogin: '1日前',
    isActive: true,
  },
  {
    id: '4',
    name: 'Pham Minh Duy',
    email: 'duy.pham@company.com',
    role: 'Viewer',
    department: 'Design',
    provider: 'Google',
    lastLogin: '3日前',
    isActive: false,
  },
  {
    id: '5',
    name: 'Hoang Quoc Em',
    email: 'em.hoang@company.com',
    role: 'Member',
    department: 'Operations',
    provider: 'Okta',
    lastLogin: 'たった今',
    isActive: true,
  },
  {
    id: '6',
    name: 'Vu Thu Giang',
    email: 'giang.vu@company.com',
    role: 'Viewer',
    department: 'Finance',
    provider: 'Microsoft',
    lastLogin: '1週間前',
    isActive: false,
  },
];

// Helper to extract initials
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  const first = parts[0];
  const last = parts[parts.length - 1];
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

// Helper to determine avatar color based on name hash
const getAvatarBg = (name: string) => {
  const colors = [
    'bg-[#fee2e2] text-[#ef4444] dark:bg-[#450a0a]/50 dark:text-[#fca5a5]',
    'bg-[#dbeafe] text-[#3b82f6] dark:bg-[#172554]/50 dark:text-[#93c5fd]',
    'bg-[#dcfce7] text-[#22c55e] dark:bg-[#064e3b]/50 dark:text-[#86efac]',
    'bg-[#fef9c3] text-[#eab308] dark:bg-[#422006]/50 dark:text-[#fde047]',
    'bg-[#f3e8ff] text-[#a855f7] dark:bg-[#3b0764]/50 dark:text-[#d8b4fe]',
    'bg-[#fae8ff] text-[#d946ef] dark:bg-[#4a044e]/50 dark:text-[#f5d0fe]',
    'bg-[#e0e7ff] text-[#6366f1] dark:bg-[#1e1b4b]/50 dark:text-[#c7d2fe]',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Icons
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function InactiveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<SSOUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleToggleActive = (id: string, name: string, currentStatus: boolean) => {
    const actionText = currentStatus ? '無効化' : '有効化';
    if (confirm(`本当に「${name}」のアカウントを${actionText}しますか？`)) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, isActive: !user.isActive } : user
        )
      );
      toast.success(`「${name}」のアカウントを${actionText}しました。`);
    }
  };

  const getRoleBadgeStyle = (role: 'Admin' | 'Member' | 'Viewer') => {
    switch (role) {
      case 'Admin':
        return 'bg-[#eff6ff] text-[#1e40af] dark:bg-[#1e3a8a]/40 dark:text-[#93c5fd]';
      case 'Member':
        return 'bg-[#f3f4f6] text-[#374151] dark:bg-[#374151]/40 dark:text-[#d1d5db]';
      case 'Viewer':
        return 'bg-[#faf5ff] text-[#6b21a8] dark:bg-[#581c87]/40 dark:text-[#e9d5ff]';
      default:
        return 'bg-[#f3f4f6] text-[#374151]';
    }
  };

  const getProviderBadgeStyle = (provider: 'Google' | 'Okta' | 'Microsoft') => {
    switch (provider) {
      case 'Google':
        return 'border-[#dee1e6] dark:border-midnight-800 text-[#ea4335] dark:text-[#f87171]';
      case 'Okta':
        return 'border-[#dee1e6] dark:border-midnight-800 text-[#007dc1] dark:text-[#38bdf8]';
      case 'Microsoft':
        return 'border-[#dee1e6] dark:border-midnight-800 text-[#00a4ef] dark:text-[#60a5fa]';
      default:
        return 'border-[#dee1e6] dark:border-midnight-800 text-[#565d6d]';
    }
  };

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title section without Create Button */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
          ユーザー管理
        </h2>
        <p className="text-[14px] font-normal leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
          SSO経由でログインするユーザーのアクセス状態を管理します。
        </p>
      </div>

      {/* Search & filter row */}
      <div className="flex items-center gap-[16px]">
        {/* Search input */}
        <div className="relative flex items-center w-[319px] h-[39px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] px-[12px] gap-[8px]">
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ユーザー名、メール、部門で検索..."
            className="w-full bg-transparent border-none outline-none text-[14px] leading-[22px] text-[#171a1f] dark:text-light placeholder-[#565d6d] dark:placeholder-gray-500 font-base"
          />
        </div>

        {/* Funnel button */}
        <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-primary-50 dark:hover:bg-midnight-800 transition-colors duration-200">
          <FunnelIcon />
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px]">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[320px]">
                ユーザー
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[140px]">
                役割
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[180px]">
                部門
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[140px]">
                SSOプロバイダー
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[160px]">
                最終ログイン
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-center w-[120px]">
                ステータス
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[100px]">
                有効化
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#dee1e6] dark:border-midnight-800 hover:bg-[#fafafb]/50 dark:hover:bg-midnight-900/50 transition-colors duration-150"
                >
                  {/* User Profile */}
                  <td className="py-[16px] px-[20px] flex items-center gap-[12px]">
                    <div className={`flex-shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-bold font-base select-none ${getAvatarBg(user.name)}`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col gap-[2px] min-w-0">
                      <span className="text-[14px] font-medium leading-[20px] text-[#171a1f] dark:text-light font-base truncate">
                        {user.name}
                      </span>
                      <span className="text-[12px] font-normal leading-[16px] text-[#565d6d] dark:text-gray-400 font-base truncate">
                        {user.email}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-[16px] px-[20px]">
                    <span className={`inline-flex items-center justify-center text-[12px] font-semibold rounded-[11px] px-[10px] h-[22px] font-base ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-[16px] px-[20px]">
                    <span className="text-[14px] font-normal text-[#171a1f] dark:text-light font-base">
                      {user.department}
                    </span>
                  </td>

                  {/* SSO Provider */}
                  <td className="py-[16px] px-[20px]">
                    <span className={`inline-flex items-center justify-center text-[11px] font-medium border rounded-[4px] px-[8px] py-[2px] font-base ${getProviderBadgeStyle(user.provider)}`}>
                      {user.provider} SSO
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="py-[16px] px-[20px]">
                    <span className="text-[13px] font-normal text-[#565d6d] dark:text-gray-400 font-base">
                      {user.lastLogin}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-[16px] px-[20px] text-center">
                    <span className={`inline-flex items-center justify-center gap-[6px] text-[12px] font-semibold font-base ${
                      user.isActive ? 'text-[#22c55e]' : 'text-[#9ca3af]'
                    }`}>
                      {user.isActive ? <CircleCheckIcon /> : <InactiveIcon />}
                      <span>{user.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>

                  {/* Action: Toggle Switch */}
                  <td className="py-[16px] px-[20px] text-right">
                    <div className="flex items-center justify-end">
                      <button
                        role="switch"
                        aria-checked={user.isActive}
                        onClick={() => handleToggleActive(user.id, user.name, user.isActive)}
                        className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          user.isActive ? 'bg-[#5570f6]' : 'bg-[#dee1e6] dark:bg-midnight-800'
                        }`}
                        title={user.isActive ? 'アカウントを無効化する' : 'アカウントを有効化する'}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            user.isActive ? 'translate-x-[20px]' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                  該当するユーザーが見つかりませんでした。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
