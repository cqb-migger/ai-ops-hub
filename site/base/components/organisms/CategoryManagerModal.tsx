import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { apiFetch } from '@base/utils/api';
import { Category } from '@base/hooks/useCategories';

interface CategoryManagerModalProps {
  categories: Category[];
  onClose: () => void;
  onChanged: () => void;
}

interface FormState {
  name_ja: string;
  name_en: string;
  menu_name_ja: string;
  menu_name_en: string;
  icon: string;
  has_step_flow: boolean;
}

const emptyForm: FormState = {
  name_ja: '',
  name_en: '',
  menu_name_ja: '',
  menu_name_en: '',
  icon: '',
  has_step_flow: false,
};

function toForm(c: Category): FormState {
  return {
    name_ja: c.name_ja || '',
    name_en: c.name_en || '',
    menu_name_ja: c.menu_name_ja || '',
    menu_name_en: c.menu_name_en || '',
    icon: c.icon || '',
    has_step_flow: !!c.has_step_flow,
  };
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

// Fields that must be filled before saving.
const REQUIRED_FIELDS: (keyof FormState)[] = ['name_ja', 'name_en', 'menu_name_ja', 'menu_name_en'];

export default function CategoryManagerModal({ categories, onClose, onChanged }: CategoryManagerModalProps) {
  const { t } = useTranslation('common');
  // null = list view; 'new' = create; number = editing that category id.
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const startCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setEditing('new');
  };
  const startEdit = (c: Category) => {
    setForm(toForm(c));
    setErrors({});
    setEditing(c.id);
  };
  // Update a field and clear its inline error as the user types.
  const set = (patch: Partial<FormState>) => {
    setForm((f) => ({ ...f, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      (Object.keys(patch) as (keyof FormState)[]).forEach((k) => delete next[k]);
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    REQUIRED_FIELDS.forEach((field) => {
      if (!String(form[field] ?? '').trim()) {
        next[field] = t('categories.fieldRequired', 'この項目は必須です') as string;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name_ja: form.name_ja.trim(),
        name_en: form.name_en.trim(),
        menu_name_ja: form.menu_name_ja.trim(),
        menu_name_en: form.menu_name_en.trim(),
        icon: form.icon.trim() || null,
        has_step_flow: form.has_step_flow,
      };
      if (editing === 'new') {
        await apiFetch('/categories/', { method: 'POST', body: JSON.stringify(payload) });
        toast.success(t('categories.created', 'カテゴリを作成しました'));
        onChanged();
        onClose(); // Đóng modal khi tạo mới thành công
      } else {
        await apiFetch(`/categories/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast.success(t('categories.updated', 'カテゴリを更新しました'));
        onChanged();
        setEditing(null);
      }
    } catch (err: any) {
      toast.error(err?.message || t('categories.saveFailed', 'カテゴリの保存に失敗しました'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    setDeletingId(c.id);
    try {
      await apiFetch(`/categories/${c.id}`, { method: 'DELETE' });
      toast.success(t('categories.deleted', 'カテゴリを削除しました'));
      onChanged();
    } catch (err: any) {
      // Backend returns 409 with a message when the category is still used by tools.
      const msg = String(err?.message || '');
      if (/assigned|in use|使用|linked/i.test(msg)) {
        toast.error(t('categories.deleteInUse', 'このカテゴリはツールに紐づいているため削除できません。'));
      } else {
        toast.error(msg || t('categories.deleteFailed', 'カテゴリの削除に失敗しました'));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls =
    'w-full h-[38px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] max-h-[90vh] flex flex-col bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden text-[#171a1f] dark:text-light font-base">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-[16px] sm:px-[24px] py-[16px] border-b border-[#dee1e6] dark:border-midnight-800">
          <h3 className="text-[16px] font-bold leading-[24px]">
            {editing === null
              ? t('categories.manage', 'カテゴリを管理')
              : editing === 'new'
                ? t('categories.addTitle', 'カテゴリを追加')
                : t('categories.editTitle', 'カテゴリを編集')}
          </h3>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[16px] sm:px-[24px] py-[16px]">
          {editing === null ? (
            /* List view */
            <div className="flex flex-col gap-[8px]">
              {categories.length === 0 ? (
                <p className="text-[13px] text-[#565d6d] dark:text-gray-400 py-[16px] text-center">
                  {t('categories.empty', 'カテゴリがありません')}
                </p>
              ) : (
                categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] border border-[#dee1e6] dark:border-midnight-800"
                  >
                    <span className="flex-shrink-0 w-[24px] text-center text-[16px] leading-none">
                      {c.icon && !c.icon.startsWith('http') && !c.icon.startsWith('/') ? c.icon : '🏷️'}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[14px] font-semibold truncate">{c.menu_name_ja || c.name_ja || c.slug}</span>
                      <span className="text-[12px] text-[#565d6d] dark:text-gray-400 truncate">
                        {c.slug}
                        {c.has_step_flow ? ` · ${t('categories.stepBadge', 'ステップ')}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      title={t('common.edit', '編集') as string}
                      aria-label={t('common.edit', '編集') as string}
                      className="flex-shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-[6px] text-[#565d6d] dark:text-gray-300 hover:text-[#5570f6] hover:bg-[#f3f4f6] dark:hover:bg-midnight-800 transition-colors"
                    >
                      <PenIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      title={t('common.delete', '削除') as string}
                      aria-label={t('common.delete', '削除') as string}
                      className="flex-shrink-0 flex items-center justify-center w-[30px] h-[30px] rounded-[6px] text-[#f25a5a] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Form view */
            <div className="flex flex-col gap-[14px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold">
                    {t('categories.nameJa', 'カテゴリ名 (日本語)')} <span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    className={`${inputCls}${errors.name_ja ? ' border-[#f25a5a] focus:border-[#f25a5a]' : ''}`}
                    value={form.name_ja}
                    onChange={(e) => set({ name_ja: e.target.value })}
                  />
                  {errors.name_ja && <span className="text-[11px] text-[#f25a5a]">{errors.name_ja}</span>}
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold">
                    {t('categories.nameEn', 'カテゴリ名 (English)')} <span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    className={`${inputCls}${errors.name_en ? ' border-[#f25a5a] focus:border-[#f25a5a]' : ''}`}
                    value={form.name_en}
                    onChange={(e) => set({ name_en: e.target.value })}
                  />
                  {errors.name_en && <span className="text-[11px] text-[#f25a5a]">{errors.name_en}</span>}
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold">
                    {t('categories.menuNameJa', 'メニュー名 (日本語)')} <span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    className={`${inputCls}${errors.menu_name_ja ? ' border-[#f25a5a] focus:border-[#f25a5a]' : ''}`}
                    value={form.menu_name_ja}
                    onChange={(e) => set({ menu_name_ja: e.target.value })}
                  />
                  {errors.menu_name_ja && <span className="text-[11px] text-[#f25a5a]">{errors.menu_name_ja}</span>}
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[13px] font-semibold">
                    {t('categories.menuNameEn', 'メニュー名 (English)')} <span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    className={`${inputCls}${errors.menu_name_en ? ' border-[#f25a5a] focus:border-[#f25a5a]' : ''}`}
                    value={form.menu_name_en}
                    onChange={(e) => set({ menu_name_en: e.target.value })}
                  />
                  {errors.menu_name_en && <span className="text-[11px] text-[#f25a5a]">{errors.menu_name_en}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold">{t('categories.icon', 'アイコン (絵文字)')}</label>
                <input className={inputCls} value={form.icon} onChange={(e) => set({ icon: e.target.value })} placeholder="🏷️" />
              </div>

              <label className="flex items-center gap-[10px] cursor-pointer select-none">
                <input type="checkbox" checked={form.has_step_flow} onChange={(e) => set({ has_step_flow: e.target.checked })} className="w-[16px] h-[16px] accent-[#5570f6]" />
                <span className="text-[13px] font-medium">{t('categories.hasStepFlow', 'ステップ（レビューフロー）を表示する')}</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between gap-[12px] px-[16px] sm:px-[24px] py-[16px] bg-[#fafafb] dark:bg-midnight-900/50 border-t border-[#dee1e6] dark:border-midnight-800">
          {editing === null ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-medium text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] transition-colors"
              >
                {t('common.close', '閉じる')}
              </button>
              <button
                type="button"
                onClick={startCreate}
                className="h-[36px] px-[20px] bg-[#5570f6] hover:bg-[#395ce0] text-white rounded-[8px] text-[14px] font-semibold transition-colors"
              >
                {t('categories.add', 'カテゴリを追加')}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-medium text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] transition-colors"
              >
                {t('common.back', '戻る')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-[36px] px-[20px] bg-[#5570f6] hover:bg-[#395ce0] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[8px] text-[14px] font-semibold transition-colors"
              >
                {saving ? t('common.loading', '読み込み中...') : t('common.save', '保存')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
