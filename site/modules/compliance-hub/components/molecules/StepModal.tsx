import React, { useState, useEffect, useRef } from 'react';
import { Step } from '../../constants/steps';
import { toast } from 'react-hot-toast';
import { API_BASE } from '../../../../base/utils/api';

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; icon: string }) => void;
  initialData: Step | null;
}

export default function StepModal({ isOpen, onClose, onSave, initialData }: StepModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSelectedIcon(initialData.icon || '');
    } else {
      setTitle('');
      setDescription('');
      setSelectedIcon('');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('タイトルを入力してください。');
      return;
    }
    if (!description.trim()) {
      setError('説明を入力してください。');
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      icon: selectedIcon,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div 
        className="w-full max-w-[500px] bg-white dark:bg-[#121620] border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#dee1e6] dark:border-midnight-800">
          <h3 className="text-[18px] font-bold text-[#171a1f] dark:text-light">
            {initialData ? 'ステップを編集' : 'ステップを追加'}
          </h3>
          <button
            onClick={onClose}
            className="text-[#9095a0] hover:text-[#565d6d] dark:hover:text-light transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-[24px] flex flex-col gap-[20px]">
          {error && (
            <div className="text-[13px] text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-[8px] border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          {/* Icon Selection - Upload only */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-bold text-[#171a1f] dark:text-light">
              アイコン
            </label>
            <div className="p-[16px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[12px]">
              <div className="flex items-center gap-[16px]">
                {/* Thumbnail Preview */}
                <div className="flex items-center justify-center w-[64px] h-[64px] rounded-[6px] border border-dashed border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-900 overflow-hidden select-none">
                  {selectedIcon && (selectedIcon.startsWith('data:image/') || selectedIcon.startsWith('http') || selectedIcon.startsWith('/')) ? (
                    <img src={selectedIcon.startsWith('/') && !selectedIcon.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${selectedIcon}` : (selectedIcon.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${selectedIcon}` : selectedIcon)} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[28px] text-[#9095a0]">📷</span>
                  )}
                </div>

                {/* Action Upload */}
                <div className="flex flex-col gap-[4px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        const uploadToastId = toast.loading('画像をアップロード中...');
                        try {
                          const res = await fetch(`${API_BASE}/upload/icon`, {
                            method: 'POST',
                            body: formData,
                          });
                          if (!res.ok) {
                            const errData = await res.json();
                            throw new Error(errData.detail || 'アップロードに失敗しました');
                          }
                          const data = await res.json();
                          setSelectedIcon(data.url);
                          toast.success('アイコン画像をアップロードしました', { id: uploadToastId });
                        } catch (err: any) {
                          toast.error(err.message || '画像のアップロードに失敗しました', { id: uploadToastId });
                        }
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-[32px] px-[12px] bg-white dark:bg-midnight-900 border border-[#171a1f] dark:border-gray-500 hover:bg-[#fafafb] dark:hover:bg-midnight-800 rounded-[6px] text-[12px] font-medium transition-colors"
                  >
                    画像を選択
                  </button>
                  <span className="text-[11px] text-[#565d6d] dark:text-gray-400">
                    推奨サイズ: 400x400px (JPG/PNG)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="step-title" className="text-[14px] font-bold text-[#171a1f] dark:text-light">
              タイトル
            </label>
            <input
              id="step-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: コンテンツの作成"
              className="w-full px-[12px] py-[10px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] text-[14px] text-[#171a1f] dark:text-light focus:outline-none focus:border-[#5570f6] dark:focus:border-[#7c91eb] transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="step-desc" className="text-[14px] font-bold text-[#171a1f] dark:text-light">
              説明
            </label>
            <textarea
              id="step-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ステップの詳細な説明を入力してください..."
              rows={4}
              className="w-full px-[12px] py-[10px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] text-[14px] text-[#171a1f] dark:text-light focus:outline-none focus:border-[#5570f6] dark:focus:border-[#7c91eb] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[12px] pt-[8px] border-t border-[#dee1e6] dark:border-midnight-800">
            <button
              type="button"
              onClick={onClose}
              className="px-[16px] py-[10px] border border-[#dee1e6] dark:border-midnight-800 text-[14px] font-bold rounded-[8px] hover:bg-[#fafafb] dark:hover:bg-midnight-900 transition-colors text-[#565d6d] dark:text-gray-400"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-[16px] py-[10px] bg-[#5570f6] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#405bd4] transition-colors shadow-sm"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
