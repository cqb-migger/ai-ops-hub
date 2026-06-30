import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import { useUsers } from '../../../../base/hooks/useUsers';
import Pagination from '../../../../base/components/molecules/Pagination';

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

export default function UserManagementTable() {
  const { users, loading, toggleUserRole } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('すべての役割');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        selectedRole === 'すべての役割' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentPageSafe = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPageSafe]);

  const handleToggleRole = async (id: number, name: string, currentRole: 'Admin' | 'Member') => {
    const nextRole = currentRole === 'Admin' ? 'Member' : 'Admin';
    const actionText = nextRole === 'Admin' ? '管理者 (Admin) に変更' : '一般ユーザー (Member) に変更';
    if (confirm(`本当に「${name}」の権限を${actionText}しますか？`)) {
      try {
        await toggleUserRole(id, currentRole);
        toast.success(`「${name}」の権限を変更しました。`);
      } catch (err: any) {
        toast.error(err.message || '権限の更新に失敗しました。');
      }
    }
  };

  const getRoleBadgeStyle = (role: 'Admin' | 'Member') => {
    switch (role) {
      case 'Admin':
        return 'bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[#2c5097] dark:text-[#8fa4f5] rounded-full';
      case 'Member':
        return 'bg-[#f3f4f6] dark:bg-midnight-800/60 border border-[#dee1e6] dark:border-midnight-700 text-[#565d6d] dark:text-gray-300 rounded-full';
      default:
        return 'bg-[#f3f4f6] text-[#374151] rounded-full';
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
          ログインするユーザーの権限とアクセス状態を管理します。
        </p>
      </div>

      {/* Search & filter row */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        showRoleFilterOnly={true}
        placeholder="ユーザー名、メールで検索..."
      />

      {/* Table Container */}
      <div className="w-full overflow-x-auto bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px]">
        <table className="w-full min-w-[700px] border-collapse text-left">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[60px]">
                STT
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[400px]">
                ユーザー
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[160px]">
                役割
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[220px]">
                最終ログイン
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[120px]">
                管理者権限
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                  読み込み中...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              paginatedUsers.map((user, index) => {
                const isAdmin = user.role === 'Admin';
                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#dee1e6] dark:border-midnight-800 hover:bg-[#fafafb]/50 dark:hover:bg-midnight-900/50 transition-colors duration-150"
                  >
                    {/* STT */}
                    <td className="py-[16px] px-[20px] text-[14px] text-[#565d6d] dark:text-gray-400 font-base font-medium">
                      {(currentPageSafe - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

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
                      <span className={`inline-flex items-center justify-center text-[11px] font-semibold px-[10px] h-[20px] font-base ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="py-[16px] px-[20px]">
                      <span className="text-[13px] font-normal text-[#565d6d] dark:text-gray-400 font-base">
                        {user.lastLogin}
                      </span>
                    </td>

                    {/* Action: Toggle Switch */}
                    <td className="py-[16px] px-[20px] text-right">
                      <div className="flex items-center justify-end">
                        <button
                          role="switch"
                          aria-checked={isAdmin}
                          onClick={() => handleToggleRole(user.id, user.name, user.role)}
                          className={`relative inline-flex h-[24px] w-[44px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isAdmin ? 'bg-[#5570f6]' : 'bg-[#dee1e6] dark:bg-midnight-800'
                          }`}
                          title={isAdmin ? '管理者権限を無効にする' : '管理者権限を有効にする'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isAdmin ? 'translate-x-[20px]' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                  該当するユーザーが見つかりませんでした。
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-[20px] py-[16px] border-t border-[#dee1e6] dark:border-midnight-800 bg-gray-50 dark:bg-midnight-950">
          <Pagination
            currentPage={currentPageSafe}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            className="mt-0"
          />
        </div>
      </div>
    </div>
  );
}
