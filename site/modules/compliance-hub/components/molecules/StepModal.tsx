import React, { useState, useEffect, useRef } from 'react';
import { STEP_ICON_OPTIONS, Step } from '../../constants/steps';
import { toast } from 'react-hot-toast';

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; icon: string }) => void;
  initialData: Step | null;
}

export default function StepModal({ isOpen, onClose, onSave, initialData }: StepModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('✏️');
  const [iconType, setIconType] = useState<'emoji' | 'upload'>('emoji');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageUrl = (iconStr: string) => {
    return iconStr && (iconStr.startsWith('data:image/') || iconStr.startsWith('http') || iconStr.startsWith('/'));
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSelectedIcon(initialData.icon);
      if (isImageUrl(initialData.icon)) {
        setIconType('upload');
      } else {
        setIconType('emoji');
      }
    } else {
      setTitle('');
      setDescription('');
      setSelectedIcon('✏️');
      setIconType('emoji');
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

          {/* Icon Selection - Emoji vs Image upload */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-bold text-[#171a1f] dark:text-light">
              アイコン
            </label>
            <div className="p-[16px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[12px] flex flex-col gap-[12px]">
              {/* Tabs */}
              <div className="flex border-b border-[#dee1e6] dark:border-midnight-800 pb-[1px] gap-[16px]">
                <button
                  type="button"
                  onClick={() => setIconType('emoji')}
                  className={`pb-[8px] text-[13px] font-semibold transition-colors relative ${
                    iconType === 'emoji'
                      ? 'text-[#5570f6] dark:text-[#7c91eb] border-b-2 border-[#5570f6] dark:border-[#7c91eb]'
                      : 'text-[#9095a0] hover:text-[#565d6d]'
                  }`}
                >
                  絵文字から選択
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('upload')}
                  className={`pb-[8px] text-[13px] font-semibold transition-colors relative ${
                    iconType === 'upload'
                      ? 'text-[#5570f6] dark:text-[#7c91eb] border-b-2 border-[#5570f6] dark:border-[#7c91eb]'
                      : 'text-[#9095a0] hover:text-[#565d6d]'
                  }`}
                >
                  画像をアップロード
                </button>
              </div>

              {/* Selected Preview */}
              <div className="flex items-center gap-[10px] mb-[4px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
                <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#f1f4fe] dark:bg-midnight-900 border-2 border-[#5570f6] dark:border-[#7c91eb] shadow-sm overflow-hidden">
                  {isImageUrl(selectedIcon) ? (
                    <img src={selectedIcon} alt="Selected Icon" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[24px]">{selectedIcon}</span>
                  )}
                </div>
                <span className="text-[13px] text-[#565d6d] dark:text-gray-400">選択中のアイコン</span>
              </div>

              {/* Emoji Grid */}
              {iconType === 'emoji' && (
                <div className="grid grid-cols-8 gap-[6px]">
                  {STEP_ICON_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedIcon(emoji)}
                      className={`w-full aspect-square flex items-center justify-center rounded-[8px] text-[20px] transition-all duration-150 hover:scale-110 ${
                        selectedIcon === emoji && !isImageUrl(selectedIcon)
                          ? 'bg-[#5570f6]/15 dark:bg-[#5570f6]/20 ring-2 ring-[#5570f6] dark:ring-[#7c91eb]'
                          : 'bg-white dark:bg-midnight-900 hover:bg-[#f1f4fe] dark:hover:bg-midnight-800 border border-[#dee1e6] dark:border-midnight-800'
                      }`}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Image Upload Box */}
              {iconType === 'upload' && (
                <div className="flex items-center gap-[16px]">
                  {/* Thumbnail Preview */}
                  <div className="flex items-center justify-center w-[64px] h-[64px] rounded-[6px] border border-dashed border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-900 overflow-hidden">
                    {isImageUrl(selectedIcon) ? (
                      <img src={selectedIcon} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[28px] text-[#9095a0]">📷</span>
                    )}
                  </div>

                  {/* Action Upload */}
                  <div className="flex flex-col gap-[4px]">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setSelectedIcon(event.target.result as string);
                              toast.success('アイコン画像を読み込みました');
                            }
                          };
                          reader.readAsDataURL(file);
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
              )}
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
