import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import { useUsers, SSOUser } from '../../../../base/hooks/useUsers';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { ROLE_OPTIONS, ROLE_BADGE_COLORS } from '../../../manage-tools/constants/roles';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getRoleBadgeStyle = (role: string) => {
  return ROLE_BADGE_COLORS[role] || ROLE_BADGE_COLORS.default;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Change Role Modal ────────────────────────────────────────────────────────

interface ChangeRoleModalProps {
  user: SSOUser;
  onClose: () => void;
  onSave: (newRole: string) => Promise<void>;
}

function ChangeRoleModal({ user, onClose, onSave }: ChangeRoleModalProps) {
  const [pendingRole, setPendingRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (pendingRole === user.role) { onClose(); return; }
    setSaving(true);
    try {
      await onSave(pendingRole);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={handleBackdrop}
    >
      <div className="w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div>
            <h3 className="text-[16px] font-bold text-[#171a1f] dark:text-light leading-[24px]">役割を変更</h3>
            <p className="text-[13px] text-[#565d6d] dark:text-gray-400 mt-[2px]">{user.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-[32px] h-[32px] rounded-full hover:bg-[#f3f4f6] dark:hover:bg-midnight-800 text-[#9095a0] hover:text-[#171a1f] dark:hover:text-white transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Body — radio list */}
        <div className="px-[24px] py-[20px] flex flex-col gap-[10px]">
          <p className="text-[13px] font-medium text-[#565d6d] dark:text-gray-400 mb-[4px]">役割を選択してください</p>
          {ROLE_OPTIONS.map((opt) => {
            const checked = pendingRole === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] border cursor-pointer transition-all select-none ${checked
                  ? 'bg-[#eef0fd] dark:bg-[#2a3060] border-[#5570f6] dark:border-[#5570f6]/60'
                  : 'bg-white dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 hover:border-[#9095a0] dark:hover:border-midnight-700'
                  }`}
              >
                {/* Custom radio */}
                <span className={`flex-shrink-0 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${checked
                  ? 'border-[#5570f6] bg-[#5570f6]'
                  : 'border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900'
                  }`}>
                  {checked && <span className="w-[7px] h-[7px] rounded-full bg-white" />}
                </span>
                <input
                  type="radio"
                  name="role"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setPendingRole(opt.value)}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[14px] font-medium ${checked ? 'text-[#5570f6] dark:text-[#7c91eb]' : 'text-[#171a1f] dark:text-light'}`}>
                    {opt.label}
                  </span>
                </div>
                {/* Current badge */}
                {opt.value === user.role && (
                  <span className="flex-shrink-0 text-[10px] font-semibold px-[8px] py-[2px] rounded-full bg-[#f3f4f6] dark:bg-midnight-800 text-[#565d6d] dark:text-gray-400 border border-[#dee1e6] dark:border-midnight-700">
                    現在
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[10px] px-[24px] py-[16px] border-t border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-[16px] h-[36px] rounded-[8px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900 text-[14px] font-medium text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] transition-colors"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-[20px] h-[36px] rounded-[8px] bg-[#5570f6] hover:bg-[#4560e6] disabled:opacity-60 text-[14px] font-semibold text-white transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export default function UserManagementTable() {
  const { users, loading, updateUserRole } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [editingUser, setEditingUser] = useState<SSOUser | null>(null);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedRole]);

  const filteredUsers = useMemo(() =>
    users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === '' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    }),
    [users, searchQuery, selectedRole]
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentPageSafe = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPageSafe]);

  async function handleSaveRole(newRole: string) {
    if (!editingUser) return;
    await updateUserRole(editingUser.id, newRole as any);
    toast.success(`「${editingUser.name}」の役割を変更しました。`);
  }

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Modal */}
      {editingUser && (
        <ChangeRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveRole}
        />
      )}

      {/* Title */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
          ユーザー管理
        </h2>
        <p className="text-[14px] font-normal leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
          ログインするユーザーの権限とアクセス状態を管理します。
        </p>
      </div>

      {/* Search & filter */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        showRoleFilterOnly={true}
        placeholder="ユーザー名、メールで検索..."
      />

      <div className="flex flex-col gap-[12px] w-full">
        <ItemCount
          currentPage={currentPageSafe}
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        {/* Table */}
        <div className="w-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] overflow-hidden shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
                <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[60px]">STT</th>
                <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base">ユーザー</th>
                <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[220px]">役割</th>
                <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[160px]">最終ログイン</th>
                <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[90px]">操作</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                    読み込み中...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#dee1e6] dark:border-midnight-800 hover:bg-[#fafafb]/50 dark:hover:bg-midnight-900/50 transition-colors duration-150"
                  >
                    {/* STT */}
                    <td className="py-[16px] px-[20px] text-[14px] text-[#565d6d] dark:text-gray-400 font-base font-medium">
                      {(currentPageSafe - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>

                    {/* User */}
                    <td className="py-[16px] px-[20px]">
                      <div className="flex items-center gap-[12px]">
                        <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-bold font-base select-none bg-[#e0e7ff] text-[#5570f6] dark:bg-[#1e1b4b]/50 dark:text-[#c7d2fe]">
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
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="py-[16px] px-[20px]">
                      <span className={`inline-flex items-center text-[11px] font-semibold px-[10px] py-[3px] whitespace-nowrap font-base ${getRoleBadgeStyle(user.role)}`}>
                        {ROLE_OPTIONS.find((r) => r.value === user.role)?.label ?? user.role}
                      </span>
                    </td>

                    {/* Last login */}
                    <td className="py-[16px] px-[20px]">
                      <span className="text-[13px] font-normal text-[#565d6d] dark:text-gray-400 font-base">
                        {user.lastLogin}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-[16px] px-[20px] text-right whitespace-nowrap">
                      {user.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          title="役割を変更"
                          className="inline-flex items-center justify-center w-[28px] h-[28px] text-[#565d6d] dark:text-gray-400 hover:text-[#5570f6] dark:hover:text-[#7c91eb] transition-colors"
                        >
                          <EditIcon />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                    該当するユーザーが見つかりませんでした。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}
