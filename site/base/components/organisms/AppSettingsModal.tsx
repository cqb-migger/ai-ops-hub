import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { apiFetch } from '@base/utils/api';
import useAppConfigStore, { DEFAULT_APP_NAME } from '@base/stores/useAppConfigStore';
import { resolveLogoUrl } from '@base/components/organisms/Sidebar';

interface AppSettingsModalProps {
  onClose: () => void;
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ImageUploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px] text-[#9095a0]">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

export default function AppSettingsModal({ onClose }: AppSettingsModalProps) {
  const { t } = useTranslation('common');
  const appName = useAppConfigStore((state) => state.appName);
  const logoUrl = useAppConfigStore((state) => state.logoUrl);
  const setConfig = useAppConfigStore((state) => state.setConfig);

  const [name, setName] = useState(appName);
  const [logo, setLogo] = useState<string | null>(logoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handlePickLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('settings.logoMustBeImage', '画像ファイルを選択してください'));
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await apiFetch<{ file_url: string }>('/upload/file', {
        method: 'POST',
        body: form,
      });
      setLogo(res.file_url);
    } catch (err: any) {
      toast.error(err?.message || t('settings.uploadFailed', 'アップロードに失敗しました'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(t('settings.nameRequired', 'アプリ名を入力してください'));
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch<{ app_name: string; logo_url: string | null }>('/settings/app', {
        method: 'PUT',
        body: JSON.stringify({ app_name: trimmed, logo_url: logo }),
      });
      setConfig({ appName: res.app_name, logoUrl: res.logo_url });
      toast.success(t('settings.saveSuccess', '設定を保存しました'));
      onClose();
    } catch (err: any) {
      toast.error(err?.message || t('settings.saveFailed', '設定の保存に失敗しました'));
    } finally {
      setSaving(false);
    }
  };

  const previewLogo = resolveLogoUrl(logo);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] bg-black/40 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden text-[#171a1f] dark:text-light font-base">
        {/* Header */}
        <div className="flex items-center justify-between px-[16px] sm:px-[24px] py-[16px] sm:py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
          <h3 className="text-[16px] font-bold leading-[24px]">
            {t('settings.title', 'アプリ設定')}
          </h3>
        </div>

        {/* Body */}
        <div className="px-[16px] sm:px-[24px] py-[16px] sm:py-[20px] flex flex-col gap-[16px]">
          {/* App Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold">{t('settings.appName', 'アプリ名')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={DEFAULT_APP_NAME}
              className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6]"
            />
          </div>

          {/* Logo */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold">{t('settings.logo', 'ロゴ')}</label>
            <div className="flex items-center gap-[12px]">
              <div className="flex items-center justify-center w-[56px] h-[56px] rounded-[8px] border border-dashed border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900 overflow-hidden shrink-0">
                {previewLogo ? (
                  <img src={previewLogo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <ImageUploadIcon />
                )}
              </div>
              <div className="flex items-center gap-[8px] flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-[36px] px-[14px] bg-[#5570f6] text-white hover:bg-[#395ce0] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[6px] text-[13px] font-semibold transition-colors shrink-0 whitespace-nowrap"
                >
                  {uploading ? t('common.loading', '読み込み中...') : t('settings.uploadLogo', 'ロゴをアップロード')}
                </button>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    className="h-[36px] px-[14px] border border-[#dee1e6] dark:border-midnight-800 hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-300 rounded-[6px] text-[13px] font-semibold transition-colors shrink-0 whitespace-nowrap"
                  >
                    {t('settings.removeLogo', 'ロゴを削除')}
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePickLogo} className="hidden" />
            </div>
            <p className="text-[12px] text-[#9095a0] dark:text-gray-500 mt-[2px]">
              {t('settings.logoHint', 'PNG / JPG / SVG。正方形の画像を推奨します。')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-[12px] px-[16px] sm:px-[24px] py-[16px] bg-[#fafafb] dark:bg-midnight-900/50 border-t border-[#dee1e6] dark:border-midnight-800">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-700 bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-medium text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] transition-colors"
          >
            {t('common.cancel', 'キャンセル')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-[36px] px-[20px] bg-[#5570f6] hover:bg-[#395ce0] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[8px] text-[14px] font-semibold transition-colors"
          >
            {saving ? t('common.loading', '読み込み中...') : t('common.save', '保存')}
          </button>
        </div>
      </div>
    </div>
  );
}
