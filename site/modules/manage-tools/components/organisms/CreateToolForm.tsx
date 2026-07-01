import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { API_BASE } from '../../../../base/utils/api';
import { useTools } from '../../../../base/hooks/useTools';
import { ROLE_OPTIONS } from '../../constants/roles';

// SVG Icons
function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MessageSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-gray-300 dark:text-gray-600">
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] text-gray-400 dark:text-gray-500">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function ImageUploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-gray-400 dark:text-gray-500">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function DocumentUploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-gray-400 dark:text-gray-500">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" x2="12" y1="18" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

interface PromptItem {
  id: string;
  name: string;
  content: string;
  isPublic?: boolean;
  categories?: string[];
}

interface RoleSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function RoleSelect({ value, onChange, options, placeholder = '選択...' }: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full z-20">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] flex items-center justify-between cursor-pointer select-none"
      >
        <span className={selectedOption ? "text-[#171a1f] dark:text-light font-semibold" : "text-[#565d6d] dark:text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-[4px] w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-lg z-50 py-[8px] flex flex-col">
          {/* Search Input */}
          <div className="px-[12px] pb-[8px] mb-[4px] border-b border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900">
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-[32px] px-[8px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-850 rounded-[4px] text-[13px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light"
            />
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto flex flex-col">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-[12px] py-[8px] hover:bg-[#fafafb] dark:hover:bg-midnight-800 cursor-pointer text-[14px] select-none transition-colors ${opt.value === value
                    ? 'bg-[#eff6ff] text-[#5570f6] font-semibold dark:bg-[#5570f6]/20 dark:text-primary-400'
                    : 'text-[#171a1f] dark:text-light'
                    }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#5570f6] dark:text-primary-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-[12px] py-[8px] text-[13px] text-gray-400 dark:text-gray-500 text-center">
                一致する結果はありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



export default function CreateToolForm() {
  const router = useRouter();
  const { createTool } = useTools();

  // Alert banner state
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);

  // Form states
  const [toolName, setToolName] = useState('商談データ分析アシスタント');
  const [description, setDescription] = useState(
    '入力された商談メモやCRMデータから、顧客の課題、ネクストアクション、受注確度を自動で分析・抽出するツールです。'
  );
  const [redirectUrl, setRedirectUrl] = useState('https://internal.app/tools/sales-analyzer');
  const [categories, setCategories] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [loginIds, setLoginIds] = useState<string[]>(['']);
  const [visibility, setVisibility] = useState<'public' | 'draft'>('public');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Prompt settings

  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: 'p1',
      name: '',
      content: '',
      isPublic: true,
      categories: [],
    }
  ]);

  // Guide settings
  const [guideContent, setGuideContent] = useState('');
  const [isGuidePreview, setIsGuidePreview] = useState(false);

  // Supplementary states
  const [adminMemo, setAdminMemo] = useState(
    '2023/11: プロンプトV2に更新。営業部からのフィードバックを反映し、確度判定を追加。'
  );

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const referenceFileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const handleTriggerUpload = () => fileInputRef.current?.click();
  const handleTriggerGuideUpload = () => guideFileInputRef.current?.click();
  const handleTriggerReferenceUpload = () => referenceFileInputRef.current?.click();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
    }
    if (isCategoryOpen || isRoleOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryOpen, isRoleOpen]);

  const handleAddPrompt = () => {
    setPrompts([...prompts, { id: `p${Date.now()}`, name: '', content: '', isPublic: true, categories: [] }]);
  };

  const handleUpdatePrompt = (id: string, field: keyof PromptItem, value: any) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleToggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleToggleRole = (roleVal: string) => {
    if (roles.includes(roleVal)) {
      setRoles(roles.filter((r) => r !== roleVal));
    } else {
      setRoles([...roles, roleVal]);
    }
  };

  const handleAddLoginId = () => {
    setLoginIds([...loginIds, '']);
  };

  const handleUpdateLoginId = (index: number, val: string) => {
    const updated = [...loginIds];
    updated[index] = val;
    setLoginIds(updated);
  };

  const handleRemoveLoginId = (index: number) => {
    setLoginIds(loginIds.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    // Implement save logic later
    toast.success('保存しました');
  };

  const handleCancel = () => {
    router.push('/manage-tools');
  };

  return (
    <div className="flex flex-col gap-[24px] w-full text-[#171a1f] dark:text-light font-base">

      {/* Header */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
          新規ツール作成
        </h2>
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400">
          ユーザーが利用できる新しいAIツールを登録します。プロンプトテンプレートを事前設定することで、ユーザーの入力手間を省くことができます。
        </p>
      </div>

      {/* Success Alert Banner */}
      {showSuccessAlert && (
        <div className="flex items-start justify-between bg-[#f0fdf4] dark:bg-midnight-900 border border-[#bbf7d0] dark:border-green-800 rounded-[6px] p-[16px] gap-[12px]">
          <div className="flex items-start gap-[12px]">
            <div className="mt-[2px]">
              <CircleCheckIcon />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px] font-medium text-[#166534] dark:text-green-300">
                ツールとプロンプトを保存しました（デモ表示）
              </span>
              <span className="text-[14px] font-normal text-[#15803d] dark:text-green-400">
                設定が正常に保存されました。引き続き編集するか、一覧に戻ることができます。
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessAlert(false)}
            className="text-[#15803d] dark:text-green-400 hover:opacity-80 p-[4px] text-[16px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Box 1: 基本情報 (Basic Information) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[24px] gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <SettingsIcon />
          <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
            基本情報
          </h3>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-[20px]">

          {/* Tool Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              ツール名称 <span className="text-[#f25a5a]">*</span>
            </label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              説明（概要） <span className="text-[#f25a5a]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
            />
          </div>

          {/* URL, Category, Role Row */}
          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px]">
            {/* URL (takes roughly 50%) */}
            <div className="flex flex-col gap-[6px] flex-[2]">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                遷移先URL
              </label>
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6]"
              />
            </div>

            {/* Category (takes roughly 33%) */}
            <div ref={categoryDropdownRef} className="flex flex-col gap-[6px] flex-1 relative">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                カテゴリ <span className="text-[#f25a5a]">*</span>
              </label>

              {/* Custom Multi-select Dropdown */}
              <div className="relative">
                <div
                  className="w-full min-h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span className={categories.length > 0 ? "text-[#171a1f] dark:text-light font-semibold" : "text-[#565d6d] dark:text-gray-400"}>
                    {categories.length > 0 ? `${categories.length}件選択中` : 'カテゴリを選択...'}
                  </span>
                  <ChevronDownIcon />
                </div>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-[4px] w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-lg z-10 py-[8px] flex flex-col">
                    {['クリエイティブハブ', 'コンプライアンスハブ', 'データハブ'].map((cat) => (
                      <div
                        key={cat}
                        onClick={() => handleToggleCategory(cat)}
                        className={`flex items-center justify-between px-[12px] py-[8px] hover:bg-[#fafafb] dark:hover:bg-midnight-800 cursor-pointer text-[14px] select-none transition-colors ${categories.includes(cat)
                          ? 'bg-[#eff6ff] text-[#5570f6] font-semibold dark:bg-[#5570f6]/20 dark:text-primary-400'
                          : 'text-[#171a1f] dark:text-light'
                          }`}
                      >
                        <span>{cat}</span>
                        {categories.includes(cat) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#5570f6] dark:text-primary-400">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Category Tags */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-[8px] mt-[4px]">
                  {categories.map((cat) => (
                    <span key={cat} className="inline-flex items-center gap-[6px] bg-[#f3f4f6] dark:bg-midnight-850 text-[#1e2128] dark:text-gray-300 text-[12px] font-semibold rounded-[11px] px-[12px] h-[26px]">
                      {cat}
                      <button type="button" onClick={() => handleToggleCategory(cat)} className="text-[#9095a1] hover:text-[#f25a5a]">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Role (takes roughly 25%) */}
            <div ref={roleDropdownRef} className="flex flex-col gap-[6px] flex-1 relative">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                すべての役割 <span className="text-[#f25a5a]">*</span>
              </label>

              {/* Custom Multi-select Dropdown */}
              <div className="relative">
                <div
                  className="w-full min-h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setIsRoleOpen(!isRoleOpen)}
                >
                  <span className={roles.length > 0 ? "text-[#171a1f] dark:text-light font-semibold" : "text-[#565d6d] dark:text-gray-400"}>
                    {roles.length > 0 ? `${roles.length}件選択中` : 'ロールを選択...'}
                  </span>
                  <ChevronDownIcon />
                </div>

                {isRoleOpen && (
                  <div className="absolute top-full left-0 mt-[4px] w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-lg z-10 py-[8px] flex flex-col font-base">
                    {ROLE_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => handleToggleRole(opt.value)}
                        className={`flex items-center justify-between px-[12px] py-[8px] hover:bg-[#fafafb] dark:hover:bg-midnight-800 cursor-pointer text-[14px] select-none transition-colors ${roles.includes(opt.value)
                          ? 'bg-[#eff6ff] text-[#5570f6] font-semibold dark:bg-[#5570f6]/20 dark:text-primary-400'
                          : 'text-[#171a1f] dark:text-light'
                          }`}
                      >
                        <span>{opt.label}</span>
                        {roles.includes(opt.value) && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#5570f6] dark:text-primary-400">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Role Tags */}
              {roles.length > 0 && (
                <div className="flex flex-wrap gap-[8px] mt-[4px]">
                  {roles.map((roleVal) => {
                    const label = ROLE_OPTIONS.find(opt => opt.value === roleVal)?.label || roleVal;
                    return (
                      <span key={roleVal} className="inline-flex items-center gap-[6px] bg-[#f3f4f6] dark:bg-midnight-850 text-[#1e2128] dark:text-gray-300 text-[12px] font-semibold rounded-[11px] px-[12px] h-[26px]">
                        {label}
                        <button type="button" onClick={() => handleToggleRole(roleVal)} className="text-[#9095a1] hover:text-[#f25a5a]">
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Login ID Row */}
          <div className="flex flex-col gap-[8px] mt-[4px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                Login ID
              </label>
              <button
                type="button"
                onClick={handleAddLoginId}
                className="h-[28px] px-[12px] bg-[#f1f4fe] dark:bg-midnight-800 hover:bg-[#e4ebfc] dark:hover:bg-midnight-700 text-[#5570f6] dark:text-[#7c91eb] rounded-[6px] text-[12px] font-semibold flex items-center gap-[4px] transition-colors"
              >
                <PlusIcon />
                <span>追加</span>
              </button>
            </div>

            <div className="flex flex-col gap-[8px]">
              {loginIds.map((id, index) => (
                <div key={index} className="flex items-center gap-[12px]">
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => handleUpdateLoginId(index, e.target.value)}
                    placeholder="Login IDを入力..."
                    className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6]"
                  />
                  {loginIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLoginId(index)}
                      className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-red-50 dark:hover:bg-red-950/30 text-[#f25a5a] transition-colors duration-200"
                      title="削除"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
              {loginIds.length === 0 && (
                <p className="text-[13px] text-gray-400 dark:text-gray-500 italic">Login IDが設定されていません。「追加」ボタンをクリックして追加してください。</p>
              )}
            </div>
          </div>

          {/* Icon and Visibility Settings Row */}
          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] mt-[4px]">
            {/* Thumbnail Image */}
            <div className="flex flex-col gap-[6px] flex-[2]">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                アイコン
              </span>
              <div className="flex flex-row items-center gap-[16px]">
                {/* Image Preview Box */}
                <div className="flex items-center justify-center w-[56px] h-[56px] rounded-[6px] border border-dashed border-[#dee1e6] dark:border-midnight-850 bg-[#fafafb] dark:bg-midnight-900 overflow-hidden shrink-0">
                  <ImageUploadIcon />
                </div>
                {/* Upload Button & Text */}
                <div className="flex flex-col gap-[6px]">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleTriggerUpload}
                    className="h-[32px] px-[12px] w-fit bg-white dark:bg-midnight-900 border border-[#171a1f] dark:border-gray-500 hover:bg-[#fafafb] dark:hover:bg-midnight-800 rounded-[6px] text-[12px] font-medium transition-colors"
                  >
                    画像をアップロード
                  </button>
                  <span className="text-[11px] text-[#565d6d] dark:text-gray-400">
                    推奨サイズ: 400x400px (JPG/PNG)
                  </span>
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="flex flex-col gap-[6px] flex-1">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                公開設定
              </span>
              <div className="flex items-center gap-[24px] h-[56px]">
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span className={visibility === 'public' ? 'text-[#171a1f] font-medium' : 'text-[#565d6d]'}>公開</span>
                </label>
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'draft'}
                    onChange={() => setVisibility('draft')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span className={visibility === 'draft' ? 'text-[#171a1f] font-medium' : 'text-[#565d6d]'}>非公開（ドラフト）</span>
                </label>
              </div>
            </div>
          </div>

          {/* Reference Materials (リファレンス) */}
          <div className="flex flex-col gap-[6px] mt-[16px]">
            <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              リファレンス
            </span>
            <div
              className="flex flex-col items-center justify-center w-full py-[32px] px-[20px] mt-[4px] border-2 border-dashed border-[#dee1e6] dark:border-midnight-800 rounded-[8px] bg-[#fafafb] hover:bg-[#f3f4f6] dark:bg-midnight-900 dark:hover:bg-midnight-850 cursor-pointer transition-colors group"
              onClick={handleTriggerReferenceUpload}
            >
              <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 mb-[12px] group-hover:scale-105 transition-transform shadow-sm">
                <DocumentUploadIcon />
              </div>
              <div className="flex flex-col items-center gap-[4px] text-center">
                <p className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  クリックしてアップロード<span className="font-normal text-[#565d6d] dark:text-gray-400">、またはファイルをドラッグ＆ドロップ</span>
                </p>
                <p className="text-[12px] text-[#9095a1] dark:text-gray-500 mt-[2px]">
                  全ファイル形式対応 (最大 50MB)
                </p>
              </div>
              <input
                type="file"
                ref={referenceFileInputRef}
                className="hidden"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Box 2: プロンプト設定 (Prompt Settings) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[24px] gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div className="flex items-center gap-[8px]">
            <MessageSquareIcon />
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
              推奨プロンプト設定
            </h3>
          </div>
        </div>

        {/* List of Prompts */}
        <div className="flex flex-col gap-[20px] font-base">
          {prompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className="flex flex-col gap-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] p-[20px] bg-[#fafafb] dark:bg-midnight-900/40 shadow-sm"
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800/80">
                <span className="text-[14px] font-bold text-[#5570f6] dark:text-[#7c91eb]">
                  プロンプト設定 #{index + 1}
                </span>
                {prompts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-[#f25a5a] transition-colors shadow-sm"
                    title="プロンプトを削除"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-[12px]">
                {/* Prompt Name */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                    プロンプト名 <span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    type="text"
                    value={prompt.name}
                    onChange={(e) => handleUpdatePrompt(prompt.id, 'name', e.target.value)}
                    placeholder="プロンプト名を入力..."
                    className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[4px] text-[14px] outline-none focus:border-[#5570f6]"
                  />
                </div>

                {/* Prompt Content */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                    プロンプト本文 <span className="text-[#f25a5a]">*</span>
                  </label>
                  <textarea
                    value={prompt.content}
                    onChange={(e) => handleUpdatePrompt(prompt.id, 'content', e.target.value)}
                    placeholder="プロンプト本文を入力..."
                    rows={3}
                    className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[4px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
                  />
                </div>

                {/* Prompt Options Row: Visibility & Categories */}
                <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] mt-[4px]">
                  {/* Visibility Radios */}
                  <div className="flex flex-col gap-[6px] flex-1">
                    <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                      公開設定 <span className="text-[#f25a5a]">*</span>
                    </label>
                    <div className="flex items-center gap-[16px] h-[40px]">
                      <label className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                        <input
                          type="radio"
                          name={`prompt-visibility-${prompt.id}`}
                          checked={prompt.isPublic !== false}
                          onChange={() => handleUpdatePrompt(prompt.id, 'isPublic', true)}
                          className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer"
                        />
                        <span className={prompt.isPublic !== false ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>公開</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                        <input
                          type="radio"
                          name={`prompt-visibility-${prompt.id}`}
                          checked={prompt.isPublic === false}
                          onChange={() => handleUpdatePrompt(prompt.id, 'isPublic', false)}
                          className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer"
                        />
                        <span className={prompt.isPublic === false ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>非公開</span>
                      </label>
                    </div>
                  </div>

                  {/* Categories Checkboxes */}
                  <div className="flex flex-col gap-[6px] flex-[2]">
                    <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                      カテゴリ
                    </label>
                    <div className="flex flex-wrap items-center gap-[16px] min-h-[40px]">
                      {categories.length === 0 ? (
                        <span className="text-[12px] text-gray-400 dark:text-gray-500">
                          基本情報でカテゴリを選択してください
                        </span>
                      ) : (
                        categories.map((cat) => {
                          const isChecked = (prompt.categories || []).includes(cat);
                          return (
                            <label key={cat} className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  const currentSelected = prompt.categories || [];
                                  const nextSelected = isChecked
                                    ? currentSelected.filter((c) => c !== cat)
                                    : [...currentSelected, cat];
                                  handleUpdatePrompt(prompt.id, 'categories', nextSelected);
                                }}
                                className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer rounded-[3px]"
                              />
                              <span className={isChecked ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>
                                {cat}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Character Count Row */}
                <div className="flex justify-end mt-[4px]">
                  <span className="text-[11px] text-[#9095a1] dark:text-gray-500">
                    文字数: {prompt.content.length} / 2000 (推奨)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-[4px]">
          <button
            type="button"
            onClick={handleAddPrompt}
            className="flex items-center gap-[6px] h-[36px] px-[16px] bg-[#f1f4fe] dark:bg-midnight-800 hover:bg-[#e4ebfc] dark:hover:bg-midnight-700 text-[#5570f6] dark:text-[#7c91eb] rounded-[6px] text-[14px] font-semibold transition-colors"
          >
            <PlusIcon />
            <span>プロンプト追加</span>
          </button>
        </div>
      </section>

      {/* Box 3: 活用ガイド設定 (Usage Guide Settings) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[24px] gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div className="flex items-center gap-[8px]">
            <BookIcon />
            <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
              活用ガイド設定
            </h3>
          </div>
        </div>

        {/* Guide Content & Upload Materials */}
        <div className="flex flex-col gap-[20px] font-base">
          {/* Guide Content */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                ガイド内容
              </label>
              <button
                type="button"
                onClick={() => setIsGuidePreview(!isGuidePreview)}
                className="h-[26px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-700 hover:bg-[#fafafb] dark:hover:bg-midnight-800 text-[#171a1f] dark:text-light rounded-full text-[12px] font-semibold flex items-center justify-center select-none transition-colors"
              >
                {isGuidePreview ? '編集に戻る' : 'Markdown プレビュー'}
              </button>
            </div>
            {isGuidePreview ? (
              <div className="w-full min-h-[106px] p-[12px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] overflow-y-auto text-[#171a1f] dark:text-light">
                {guideContent ? (
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-[20px] font-bold mt-4 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-[17px] font-bold mt-3 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-[15px] font-bold mt-3 mb-1" {...props} />,
                      p: ({ node, ...props }) => <p className="my-[6px] leading-[22px]" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-[20px] my-[6px] space-y-[2px]" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-[20px] my-[6px] space-y-[2px]" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-[22px]" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#5570f6] pl-[12px] italic text-[#565d6d] dark:text-gray-400 my-[8px]" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-[#f0f0f0] dark:bg-midnight-800 rounded px-[4px] py-[1px] text-[13px] font-mono" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-[#f0f0f0] dark:bg-midnight-800 rounded-[4px] p-[12px] overflow-x-auto text-[13px] font-mono my-[8px]" {...props} />,
                      hr: ({ node, ...props }) => <hr className="border-[#dee1e6] dark:border-midnight-800 my-[12px]" {...props} />,
                    }}
                  >
                    {guideContent}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">コンテンツは空です</p>
                )}
              </div>
            ) : (
              <textarea
                value={guideContent}
                onChange={(e) => setGuideContent(e.target.value)}
                placeholder="ガイド内容を入力..."
                rows={4}
                className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
              />
            )}
            <div className="flex justify-end">
              <span className="text-[11px] text-[#9095a1] dark:text-gray-500">
                文字数: {guideContent.length} / 2000 (推奨)
              </span>
            </div>
          </div>

          {/* Guide Materials (ガイド資料) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              ガイド資料
            </label>
            <div
              className="flex flex-col items-center justify-center w-full py-[32px] px-[20px] mt-[4px] border-2 border-dashed border-[#dee1e6] dark:border-midnight-800 rounded-[8px] bg-[#fafafb] hover:bg-[#f3f4f6] dark:bg-midnight-900 dark:hover:bg-midnight-850 cursor-pointer transition-colors group"
              onClick={handleTriggerGuideUpload}
            >
              <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 mb-[12px] group-hover:scale-105 transition-transform shadow-sm">
                <DocumentUploadIcon />
              </div>
              <div className="flex flex-col items-center gap-[4px] text-center">
                <p className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  クリックしてアップロード<span className="font-normal text-[#565d6d] dark:text-gray-400">、またはファイルをドラッグ＆ドロップ</span>
                </p>
                <p className="text-[12px] text-[#9095a1] dark:text-gray-500 mt-[2px]">
                  JPG, PNG, PDF形式 (最大 10MB)
                </p>
              </div>
              <input
                type="file"
                ref={guideFileInputRef}
                accept=".jpg,.png,.pdf"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Box 4: 補足情報 (Supplementary Information) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[24px] gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <FileTextIcon />
          <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
            補足情報
          </h3>
        </div>

        {/* Admin Memo */}
        <div className="flex flex-col gap-[6px] font-base">
          <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
            管理者用メモ（非公開）
          </label>
          <textarea
            value={adminMemo}
            onChange={(e) => setAdminMemo(e.target.value)}
            rows={4}
            className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
            placeholder="管理者間での共有メモや、プロンプトの更新履歴などを記録してください..."
          />
        </div>
      </section>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-center gap-[16px] pt-[8px] pb-[32px]">
        <button
          type="button"
          onClick={handleCancel}
          className="h-[40px] px-[32px] bg-white dark:bg-midnight-900 hover:bg-gray-50 border border-[#dee1e6] rounded-[6px] text-[14px] font-semibold text-[#171a1f] dark:text-light transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="h-[40px] px-[48px] bg-[#5570f6] hover:bg-[#395ce0] text-white rounded-[6px] text-[14px] font-semibold shadow-[0px_1px_2px_rgba(23,26,31,0.08)] transition-all duration-200"
        >
          保存
        </button>
      </div>
    </div>
  );
}
