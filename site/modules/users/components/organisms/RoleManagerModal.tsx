import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Role, useRoles, roleDisplayName } from '../../../../base/hooks/useRoles';
import { apiFetch } from '../../../../base/utils/api';
import toast from 'react-hot-toast';

interface RoleManagerModalProps {
  onClose: () => void;
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function RoleManagerModal({ onClose }: RoleManagerModalProps) {
  const { t } = useTranslation('common');
  const { roles, loading, refetch } = useRoles();
  const router = useRouter();
  
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({ name_ja: '', name_en: '', description: '' });
  const [saving, setSaving] = useState(false);

  const startAdd = () => {
    setIsAdding(true);
    setEditingRole(null);
    setFormData({ name_ja: '', name_en: '', description: '' });
  };

  const startEdit = (role: Role) => {
    setIsAdding(false);
    setEditingRole(role);
    setFormData({
      name_ja: role.name_ja || role.name || '',
      name_en: role.name_en || '',
      description: role.description || '',
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingRole(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_ja || !formData.name_en) return;
    setSaving(true);
    try {
      if (isAdding) {
        await apiFetch('/roles/', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        toast.success(t('roles.addSuccess', 'Role added successfully'));
      } else if (editingRole) {
        await apiFetch(`/roles/${editingRole.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        toast.success(t('roles.updateSuccess', 'Role updated successfully'));
      }
      await refetch();
      cancelEdit();
    } catch (err: any) {
      toast.error(err.message || t('common.error', 'An error occurred'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (!confirm(t('roles.confirmDelete', 'Are you sure you want to delete this role?') as string)) return;
    try {
      await apiFetch(`/roles/${role.id}`, { method: 'DELETE' });
      toast.success(t('roles.deleteSuccess', 'Role deleted successfully'));
      await refetch();
    } catch (err: any) {
      toast.error(err.message || t('common.error', 'An error occurred'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px]">
      <div
        className="absolute inset-0 bg-[#171a1f]/40 dark:bg-[#0b0d12]/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[600px] bg-white dark:bg-midnight-950 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#dee1e6] dark:border-midnight-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900/50">
          <h3 className="text-[18px] font-bold text-[#171a1f] dark:text-light">
            {t('roles.manageRoles', '役割の管理')}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-[32px] h-[32px] rounded-full hover:bg-gray-200 dark:hover:bg-midnight-800 text-[#9095a0] dark:text-gray-400 transition-colors"
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-[24px] flex flex-col gap-[20px] max-h-[60vh]">
          {/* Form */}
          {(isAdding || editingRole) && (
            <form onSubmit={handleSave} className="flex flex-col gap-[12px] p-[16px] bg-gray-50 dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px]">
              <h4 className="text-[14px] font-bold text-[#171a1f] dark:text-light mb-[4px]">
                {isAdding ? t('roles.addNew', '新しい役割の追加') : t('roles.editRole', '役割の編集')}
              </h4>
              <div className="flex flex-col gap-[4px]">
                <label className="text-[12px] font-medium text-[#565d6d] dark:text-gray-400">
                  {t('roles.nameJa', '役割名 (日本語)')} <span className="text-[#f25a5a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_ja}
                  onChange={(e) => setFormData({ ...formData, name_ja: e.target.value })}
                  className="h-[36px] px-[12px] rounded-[6px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-800 text-[#171a1f] dark:text-light"
                  placeholder="例: 開発者"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="text-[12px] font-medium text-[#565d6d] dark:text-gray-400">
                  {t('roles.nameEn', '役割名 (English)')} <span className="text-[#f25a5a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="h-[36px] px-[12px] rounded-[6px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-800 text-[#171a1f] dark:text-light"
                  placeholder="e.g. Developer"
                />
              </div>
              <div className="flex justify-end gap-[8px] mt-[4px]">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-[12px] h-[32px] rounded-[6px] border border-[#dee1e6] dark:border-midnight-700 text-[13px] font-medium hover:bg-gray-100 dark:hover:bg-midnight-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-[16px] h-[32px] rounded-[6px] bg-[#5570f6] text-white text-[13px] font-medium hover:bg-[#4560e6] transition-colors disabled:opacity-60"
                >
                  {saving ? t('common.saving', '保存中...') : t('common.save', '保存')}
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-bold text-[#171a1f] dark:text-light">
                {t('roles.existingRoles', '既存の役割')}
              </span>
              {!isAdding && !editingRole && (
                <button
                  onClick={startAdd}
                  className="h-[32px] px-[12px] flex items-center justify-center gap-[6px] rounded-[6px] bg-[#5570f6] text-white text-[13px] font-semibold hover:bg-primary-600 transition-colors shadow-sm"
                >
                  <PlusIcon />
                  <span>{t('roles.addRole', '役割を追加')}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-[20px] text-[13px] text-[#565d6d] dark:text-gray-400">
                {t('common.loading', '読み込み中...')}
              </div>
            ) : (
              <div className="flex flex-col border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] overflow-hidden divide-y divide-[#dee1e6] dark:divide-midnight-800">
                {roles.map(role => (
                  <div key={role.id} className="flex items-center justify-between p-[12px] bg-white dark:bg-midnight-950">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[#171a1f] dark:text-light">{roleDisplayName(role, router.locale)}</span>
                      <span className="text-[12px] text-[#9095a0] dark:text-gray-500">{role.code}</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <button
                        onClick={() => startEdit(role)}
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-400 transition-colors"
                      >
                        <PenIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(role)}
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
                {roles.length === 0 && (
                  <div className="text-center py-[20px] text-[13px] text-[#565d6d] dark:text-gray-400">
                    {t('roles.noRoles', '役割がありません')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
