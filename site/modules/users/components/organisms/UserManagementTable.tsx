import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import { useUsers, SSOUser } from '../../../../base/hooks/useUsers';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { ROLE_BADGE_COLORS } from '../../../manage-tools/constants/roles';
import { translateRole } from '../../../../base/utils/labels';
import { useTranslation } from 'next-i18next';
import { useRoles } from '../../../../base/hooks/useRoles';
import RoleManagerModal from './RoleManagerModal';

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
  onSave: (newRoles: string[]) => Promise<void>;
}

function ChangeRoleModal({ user, onClose, onSave }: ChangeRoleModalProps) {
  const [pendingRoles, setPendingRoles] = useState<string[]>(user.roles || (user.role ? [user.role] : []));
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation('common');
  const { roles } = useRoles();
  const router = useRouter();

  // Admin is exclusive: selecting admin clears others; selecting another clears admin.
  const toggleRole = (code: string) => {
    setPendingRoles((prev) => {
      if (code === 'admin') {
        return prev.includes('admin') ? [] : ['admin'];
      }
      const withoutAdmin = prev.filter((r) => r !== 'admin');
      return withoutAdmin.includes(code)
        ? withoutAdmin.filter((r) => r !== code)
        : [...withoutAdmin, code];
    });
  };

  async function handleSave() {
    if (pendingRoles.length === 0) return;
    setSaving(true);
    try {
      await onSave(pendingRoles);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/40 backdrop-blur-[2px]"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] sm:px-[24px] py-[16px] sm:py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div>
            <h3 className="text-[16px] font-bold text-[#171a1f] dark:text-light leading-[24px]">{t('users.changeRole', '役割を変更')}</h3>
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
        <div className="px-[16px] sm:px-[24px] py-[16px] sm:py-[20px] flex flex-col gap-[10px]">
          <p className="text-[13px] font-medium text-[#565d6d] dark:text-gray-400 mb-[4px]">{t('users.selectRolesPrompt', '役割を選択してください（複数選択可）')}</p>
          {roles.map((opt) => {
            const checked = pendingRoles.includes(opt.code);
            const disabled = pendingRoles.includes('admin') && opt.code !== 'admin';
            return (
              <label
                key={opt.code}
                className={`flex items-center gap-[12px] px-[16px] py-[14px] rounded-[10px] border transition-all select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${checked
                  ? 'bg-[#eef0fd] dark:bg-[#2a3060] border-[#5570f6] dark:border-[#5570f6]/60'
                  : 'bg-white dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 hover:border-[#9095a0] dark:hover:border-midnight-700'
                  }`}
              >
                {/* Custom checkbox */}
                <span className={`flex-shrink-0 w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-colors ${checked
                  ? 'border-[#5570f6] bg-[#5570f6]'
                  : 'border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900'
                  }`}>
                  {checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[11px] h-[11px]">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  value={opt.code}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleRole(opt.code)}
                  className="sr-only"
                />
                <div className="flex-1 min-w-0">
                  <span className={`text-[14px] font-medium ${checked ? 'text-[#5570f6] dark:text-[#7c91eb]' : 'text-[#171a1f] dark:text-light'}`}>
                    {translateRole(opt.code, t, roles, router.locale)}
                  </span>
                </div>
                {/* Current badge */}
                {(user.roles || []).includes(opt.code) && (
                  <span className="flex-shrink-0 text-[10px] font-semibold px-[8px] py-[2px] rounded-full bg-[#f3f4f6] dark:bg-midnight-800 text-[#565d6d] dark:text-gray-400 border border-[#dee1e6] dark:border-midnight-700">
                    {t('users.currentRole', '現在')}
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-[12px] px-[16px] sm:px-[24px] py-[16px] border-t border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-[16px] h-[36px] rounded-[8px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900 text-[14px] font-medium text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-[20px] h-[36px] rounded-[8px] bg-[#5570f6] hover:bg-[#4560e6] disabled:opacity-60 text-[14px] font-semibold text-white transition-colors"
          >
            {saving ? t('common.loading') : t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

export default function UserManagementTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation('common');

  // Modal state
  const [editingUser, setEditingUser] = useState<SSOUser | null>(null);
  const [managingRoles, setManagingRoles] = useState(false);
  const router = useRouter();

  // Debounce + trim search before sending to the API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page whenever the filters change
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, selectedRole]);

  const { roles } = useRoles();
  const { users, total, loading, updateUserRoles } = useUsers({
    search: debouncedSearch || undefined,
    role: selectedRole || undefined,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedUsers = users;

  async function handleSaveRoles(newRoles: string[]) {
    if (!editingUser) return;
    await updateUserRoles(editingUser.id, newRoles);
    toast.success(t('users.saveSuccess'));
  }

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[28px] w-full">
      {/* Modal */}
      {editingUser && (
        <ChangeRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveRoles}
        />
      )}
      
      {managingRoles && (
        <RoleManagerModal onClose={() => setManagingRoles(false)} />
      )}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[22px] sm:text-[30px] font-bold leading-[30px] sm:leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
            {t('nav.userManagement')}
          </h2>
          <p className="hidden md:block text-[14px] font-normal leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
            {t('users.desc', 'ログインするユーザーの権限とアクセス状態を管理します。')}
          </p>
        </div>
        <button
          onClick={() => setManagingRoles(true)}
          className="h-[36px] px-[16px] flex items-center justify-center rounded-[8px] bg-[#5570f6] text-white text-[14px] font-semibold hover:bg-primary-600 transition-colors shadow-sm"
        >
          {t('roles.manageRoles', '役割の管理')}
        </button>
      </div>

      {/* Search & filter */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        showRoleFilterOnly={true}
        placeholder={t('users.searchPlaceholder', 'ユーザー名、メールで検索...') as string}
      />

      <div className="flex flex-col gap-[12px] w-full">
        <ItemCount
          currentPage={currentPageSafe}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        {/* Mobile Card List */}
        <div className="md:hidden flex flex-col gap-[12px]">
          {loading ? (
            <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
              {t('common.loading')}
            </div>
          ) : paginatedUsers.length > 0 ? (
            <>
              {paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[12px] p-[16px] shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)] flex items-start gap-[12px]"
                >
                  <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-bold font-base select-none bg-[#e0e7ff] text-[#5570f6] dark:bg-[#1e1b4b]/50 dark:text-[#c7d2fe]">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex flex-col gap-[6px] min-w-0 flex-1">
                    <span className="text-[14px] font-semibold leading-[20px] text-[#171a1f] dark:text-light font-base truncate">
                      {user.name}
                    </span>
                    <span className="text-[12px] font-normal leading-[16px] text-[#565d6d] dark:text-gray-400 font-base truncate">
                      {user.email}
                    </span>
                    <div className="flex items-center flex-wrap gap-[8px] mt-[2px]">
                      {(user.roles && user.roles.length ? user.roles : [user.role]).map((rc) => (
                        <span key={rc} className={`inline-flex items-center text-[11px] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap font-base ${getRoleBadgeStyle(rc)}`}>
                          {translateRole(rc, t, roles, router.locale)}
                        </span>
                      ))}
                      <span className="text-[12px] text-[#565d6d] dark:text-gray-400 font-base">
                        {user.lastLogin}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingUser(user)}
                    title={t('users.changeRole', '役割を変更') as string}
                    className="flex-shrink-0 inline-flex items-center justify-center w-[32px] h-[32px] rounded-[6px] text-[#565d6d] dark:text-gray-400 hover:text-[#5570f6] dark:hover:text-[#7c91eb] hover:bg-gray-100 dark:hover:bg-midnight-800 transition-colors"
                  >
                    <EditIcon />
                  </button>
                </div>
              ))}
              <Pagination
                currentPage={currentPageSafe}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                hideItemCount={true}
              />
            </>
          ) : (
            <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base border border-[#dee1e6] dark:border-midnight-800 rounded-[12px]">
              {t('users.noUsers', '該当するユーザーが見つかりませんでした。')}
            </div>
          )}
        </div>

        {/* Table (desktop) */}
        <div className="hidden md:block w-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] overflow-hidden shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[60px]">{t('users.stt', 'No')}</th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base">{t('users.name', 'ユーザー')}</th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[220px]">{t('users.role', '役割')}</th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[160px]">{t('users.lastLogin', '最終ログイン')}</th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[90px]">{t('common.action', '操作')}</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : paginatedUsers.length > 0 ? (
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
                        <span className={`inline-flex items-center text-[11px] font-semibold px-[10px] py-[3px] rounded-full whitespace-nowrap font-base ${getRoleBadgeStyle(user.role)}`}>
                          {translateRole(user.role, t, roles, router.locale)}
                        </span>
                      </td>

                      {/* Last login */}
                      <td className="py-[16px] px-[20px]">
                        <span className="text-[13px] font-normal text-[#565d6d] dark:text-gray-400 font-base">
                          {user.lastLogin}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-[16px] px-[20px] whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          title={t('users.changeRole', '役割を変更') as string}
                          className="inline-flex items-center justify-center w-[28px] h-[28px] text-[#565d6d] dark:text-gray-400 hover:text-[#5570f6] dark:hover:text-[#7c91eb] transition-colors"
                        >
                          <EditIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                      {t('users.noUsers', '該当するユーザーが見つかりませんでした。')}
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
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
              hideItemCount={true}
              className="mt-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
