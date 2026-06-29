import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

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

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-gray-400 dark:text-gray-600">
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] text-gray-400 dark:text-gray-500">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-gray-500 dark:text-gray-400">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface TemplateItem {
  id: string;
  name: string;
  language: string;
  content: string;
}

import { useTools } from '../../../../base/hooks/useTools';

export default function CreateToolForm() {
  const router = useRouter();
  const { createTool } = useTools();
  
  // Alert banner state
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Form states
  const [toolName, setToolName] = useState('商談データ分析アシスタント');
  const [description, setDescription] = useState(
    '入力された商談メモやCRMデータから、顧客の課題、ネクストアクション、受注確度を自動で分析・抽出するツールです。'
  );
  const [redirectUrl, setRedirectUrl] = useState('https://internal.app/tools/sales-analyzer');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['creative']);
  const [visibility, setVisibility] = useState<'public' | 'draft'>('public');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Prompt states
  const [basePrompt, setBasePrompt] = useState(
    `あなたは優秀なデータアナリストです。\n以下の{製品名}に関する商談データを分析し、次の3点を箇条書きで出力してください。\n\n1. 顧客の主要な課題\n2. 受注に向けたネクストアクション\n3. 推定される受注確度（高・中・低）と理由\n\nデータ:\n{データ}`
  );
  const [additionalTemplates, setAdditionalTemplates] = useState<TemplateItem[]>([
    {
      id: 'temp-1',
      name: '競合比較用フォーマット',
      language: '日本語',
      content: '上記の商談データに加えて、以下の競合情報を考慮し、当社ソリューションの優位性を強調した提案シナリオを作成してください。\n\n競合情報:\n{競合データ}',
    },
    {
      id: 'temp-2',
      name: '',
      language: '日本語',
      content: '',
    },
  ]);

  // Supplementary states
  const [adminMemo, setAdminMemo] = useState(
    '2023/11: プロンプトV2に更新。営業部からのフィードバックを反映し、確度判定を追加。'
  );

  // Refs for upload and cursor focus
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle line numbers dynamically
  const lines = basePrompt.split('\n');
  const totalLines = Math.max(6, lines.length);
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1);

  // Insert variable tag at active cursor selection
  const handleInsertVariable = (variableToken: string) => {
    const textarea = promptTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = basePrompt.substring(0, startPos);
    const textAfter = basePrompt.substring(endPos, basePrompt.length);

    const updatedText = textBefore + variableToken + textAfter;
    setBasePrompt(updatedText);

    // Reposition cursor after inserting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = startPos + variableToken.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  // Image Upload handler
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailUrl(event.target.result as string);
          toast.success('画像をアップロードしました');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Additional templates handlers
  const handleAddTemplate = () => {
    const newTemp: TemplateItem = {
      id: `temp-${Date.now()}`,
      name: '',
      language: '日本語',
      content: '',
    };
    setAdditionalTemplates([...additionalTemplates, newTemp]);
    toast.success('新しいテンプレートを追加しました');
  };

  const handleUpdateTemplate = (id: string, field: keyof TemplateItem, value: string) => {
    setAdditionalTemplates(
      additionalTemplates.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setAdditionalTemplates(additionalTemplates.filter((t) => t.id !== id));
    toast.success('テンプレートを削除しました');
  };

  const handleSave = async () => {
    if (!toolName.trim()) {
      toast.error('ツール名称を入力してください');
      return;
    }
    if (!description.trim()) {
      toast.error('説明を入力してください');
      return;
    }
    if (!redirectUrl.trim()) {
      toast.error('遷移先URLを入力してください');
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error('少なくとも1つのカテゴリを選択してください');
      return;
    }

    try {
      await createTool({
        name: toolName,
        description: description,
        url: redirectUrl,
        icon: thumbnailUrl || '🔧',
        status: visibility === 'public' ? '公開中' : '下書き',
        category: selectedCategories,
        details: {
          inputs: ['製品名', 'データ'],
          outputDescription: '受注確度 và ネクストアクション',
          prompts: [
            {
              title: '基本プロンプト',
              description: 'デフォルト',
              content: basePrompt
            },
            ...additionalTemplates.filter(t => t.name.trim()).map(t => ({
              title: t.name,
              description: t.language,
              content: t.content
            }))
          ]
        }
      });

      setShowSuccessAlert(true);
      toast.success('設定が正常に保存されました。');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        router.push('/manage-tools');
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'ツールの保存に失敗しました。');
    }
  };

  const handleCancel = () => {
    router.push('/manage-tools');
  };

  return (
    <div className="flex flex-col gap-[32px] w-full max-w-[880px] mx-auto text-[#171a1f] dark:text-light">
      
      {/* Title & Header info */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light font-base tracking-[-0.6px]">
          新規ツール作成
        </h2>
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
          ユーザーが利用できる新しいAIツールを登録します。プロンプトテンプレートを事前設定することで、ユーザーの入力手間を省くことができます。
        </p>
      </div>

      {/* Success alert banner */}
      {showSuccessAlert && (
        <div className="flex items-start justify-between bg-[#f0fdf4] dark:bg-midnight-900 border border-[#bbf7d0] dark:border-green-800 rounded-[6px] p-[16px] gap-[12px] transition-all duration-300">
          <div className="flex items-start gap-[12px]">
            <div className="mt-[2px]">
              <CircleCheckIcon />
            </div>
            <div className="flex flex-col gap-[4px] font-base">
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
            title="閉じる"
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
        <div className="flex flex-col gap-[16px] font-base">
          {/* Tool Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              ツール名称 <span className="text-[#f25a5a]">*</span>
            </label>
            <input
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] dark:focus:border-primary-400 transition-colors"
              placeholder="ツール名称を入力..."
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
              className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6] dark:focus:border-primary-400 transition-colors"
              placeholder="ツールの概要や用途を詳しく説明してください..."
            />
          </div>

          {/* Two Columns for URLs and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Redirect URL */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                遷移先URL <span className="text-[#f25a5a]">*</span>
              </label>
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] dark:focus:border-primary-400 transition-colors"
                placeholder="https://..."
              />
            </div>

            {/* Category checkboxes */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                カテゴリ (Hubs) <span className="text-[#f25a5a]">*</span>
              </span>
              <div className="flex items-center gap-[16px] h-[40px]">
                {['creative', 'compliance', 'data'].map((hub) => (
                  <label key={hub} className="flex items-center gap-[6px] cursor-pointer text-[14px] select-none text-[#171a1f] dark:text-light font-medium">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(hub)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, hub]);
                        } else {
                          setSelectedCategories(selectedCategories.filter((h) => h !== hub));
                        }
                      }}
                      className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                    />
                    <span className="capitalize">{hub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Visibility Settings */}
            <div className="flex flex-col gap-[6px]">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                公開設定
              </span>
              <div className="flex items-center gap-[20px] h-[40px]">
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span>公開</span>
                </label>
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'draft'}
                    onChange={() => setVisibility('draft')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span>非公開（ドラフト）</span>
                </label>
              </div>
            </div>
          </div>

          {/* Thumbnail Image */}
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              サムネイル画像
            </span>
            <div className="flex items-center gap-[16px]">
              {/* Image Preview / Icon Container */}
              <div className="flex items-center justify-center w-[64px] h-[64px] rounded-[6px] border border-dashed border-[#dee1e6] dark:border-midnight-850 bg-[#fafafb] dark:bg-midnight-900 overflow-hidden">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                ) : (
                  <UploadIcon />
                )}
              </div>

              {/* Action Upload */}
              <div className="flex flex-col gap-[4px]">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="h-[32px] px-[12px] bg-white dark:bg-midnight-900 border border-[#171a1f] dark:border-gray-500 hover:bg-[#fafafb] dark:hover:bg-midnight-800 rounded-[6px] text-[12px] font-medium transition-colors"
                >
                  画像をアップロード
                </button>
                <span className="text-[12px] text-[#565d6d] dark:text-gray-400">
                  推奨サイズ: 400x400px (JPG/PNG)
                </span>
              </div>
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
              プロンプト設定
            </h3>
          </div>
          <span className="h-[22px] px-[8px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-full text-[12px] font-semibold flex items-center justify-center select-none text-[#171a1f] dark:text-light">
            高度な設定
          </span>
        </div>

        {/* Section Body */}
        <div className="flex flex-col gap-[20px] font-base">
          {/* Base Prompt */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[4px]">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                基本プロンプト（デフォルト） <span className="text-[#f25a5a]">*</span>
              </span>
              <span className="text-[12px] text-[#565d6d] dark:text-gray-400">
                ツール起動時に初期入力されるテンプレートです。
              </span>
            </div>

            {/* Code Editor Styled Component */}
            <div className="flex flex-col border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] overflow-hidden bg-[#fafafa] dark:bg-midnight-950">
              {/* Insert Variable Bar */}
              <div className="flex items-center justify-between h-[39px] px-[12px] bg-white dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
                <div className="flex items-center gap-[8px] overflow-x-auto py-[4px]">
                  <span className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400 whitespace-nowrap">
                    変数挿入:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInsertVariable('{製品名}')}
                    className="h-[22px] px-[8px] bg-[#fafafb] dark:bg-midnight-800 border border-[#dee1e6] dark:border-midnight-700 hover:border-[#5570f6] rounded-[4px] text-[12px] text-[#5570f6] dark:text-[#7c91eb] transition-colors whitespace-nowrap"
                  >
                    {`{製品名}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertVariable('{ターゲット}')}
                    className="h-[22px] px-[8px] bg-[#fafafb] dark:bg-midnight-800 border border-[#dee1e6] dark:border-midnight-700 hover:border-[#5570f6] rounded-[4px] text-[12px] text-[#5570f6] dark:text-[#7c91eb] transition-colors whitespace-nowrap"
                  >
                    {`{ターゲット}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertVariable('{データ}')}
                    className="h-[22px] px-[8px] bg-[#fafafb] dark:bg-midnight-800 border border-[#dee1e6] dark:border-midnight-700 hover:border-[#5570f6] rounded-[4px] text-[12px] text-[#5570f6] dark:text-[#7c91eb] transition-colors whitespace-nowrap"
                  >
                    {`{データ}`}
                  </button>
                </div>

                <span className="text-[12px] font-normal text-[#565d6d] dark:text-gray-400 whitespace-nowrap">
                  Markdown対応
                </span>
              </div>

              {/* Textarea + Line Numbers Side by Side */}
              <div className="flex relative min-h-[140px] font-mono">
                {/* Gutter Line Numbers */}
                <div className="w-[40px] bg-[#f4f4f5] dark:bg-midnight-900 border-r border-[#dee1e6] dark:border-midnight-850 py-[12px] text-center text-[12px] leading-[23px] text-[#a1a1aa] dark:text-gray-500 select-none flex flex-col items-center">
                  {lineNumbers.map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>

                {/* Textarea Input */}
                <textarea
                  ref={promptTextareaRef}
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                  className="flex-1 bg-transparent p-[12px] outline-none resize-none text-[14px] leading-[23px] text-[#171a1f] dark:text-light font-mono overflow-y-auto min-h-[140px]"
                  placeholder="プロンプト本文を入力してください..."
                />
              </div>
            </div>

            {/* Character Count */}
            <div className="flex justify-end mt-[2px]">
              <span className="text-[12px] text-[#565d6d] dark:text-gray-400">
                文字数: {basePrompt.length} / 2000 (推奨)
              </span>
            </div>
          </div>

          {/* Additional Templates */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[8px]">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  追加プロンプトテンプレート
                </span>
                <span className="text-[12px] text-[#565d6d] dark:text-gray-400">
                  ユーザーが用途に合わせて選択できるバリエーションを登録します。
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddTemplate}
                className="flex items-center gap-[4px] h-[32px] px-[12px] bg-white dark:bg-midnight-900 border border-[#171a1f] dark:border-gray-500 hover:bg-[#fafafb] dark:hover:bg-midnight-800 rounded-[6px] text-[12px] font-medium transition-colors"
              >
                <PlusIcon />
                <span>テンプレートを追加</span>
              </button>
            </div>

            {/* List of Additional Templates */}
            <div className="flex flex-col gap-[16px] mt-[8px]">
              {additionalTemplates.map((template, idx) => (
                <div
                  key={template.id}
                  className="flex items-start bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] p-[16px] gap-[12px] relative group"
                >
                  {/* Grip / Drag Indicator Decoration */}
                  <div className="mt-[8px] cursor-grab" title="ドラッグして並び替え (シミュレーション)">
                    <GripIcon />
                  </div>

                  {/* Template Card Content */}
                  <div className="flex-1 flex flex-col gap-[12px]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-[12px] justify-between">
                      {/* Name input */}
                      <input
                        type="text"
                        value={template.name}
                        onChange={(e) => handleUpdateTemplate(template.id, 'name', e.target.value)}
                        placeholder="テンプレート名を入力..."
                        className="w-full sm:w-[240px] h-[31px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] font-medium outline-none focus:border-[#5570f6] dark:focus:border-primary-400"
                      />

                      {/* Language tag dropdown */}
                      <div className="flex items-center gap-[8px]">
                        <div className="flex items-center justify-center bg-[#f3f4f6] dark:bg-midnight-850 h-[30px] px-[12px] rounded-full text-[12px] font-semibold text-[#1e2128] dark:text-light">
                          {template.language}
                        </div>

                        {/* Delete template button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="flex items-center justify-center w-[30px] h-[30px] rounded-[6px] text-[#f25a5a] hover:bg-red-50 dark:hover:bg-midnight-900 transition-colors"
                          title="テンプレートを削除"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    {/* Textarea prompt input */}
                    <div className="relative">
                      <textarea
                        value={template.content}
                        onChange={(e) => handleUpdateTemplate(template.id, 'content', e.target.value)}
                        placeholder="プロンプト本文を入力..."
                        rows={3}
                        className="w-full p-[12px] bg-[#fafafa] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6] dark:focus:border-primary-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Box 3: 補足情報 (Supplementary Information) */}
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
            className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6] dark:focus:border-primary-400 transition-colors"
            placeholder="管理者間での共有メモや、プロンプトの更新履歴などを記録してください..."
          />
        </div>
      </section>

      {/* Footer divider and buttons */}
      <div className="flex flex-col gap-[16px] pt-[16px] border-t border-[#dee1e6] dark:border-midnight-800">
        <div className="flex items-center justify-end gap-[16px]">
          {/* Cancel */}
          <button
            type="button"
            onClick={handleCancel}
            className="h-[40px] px-[20px] bg-transparent hover:bg-gray-100 dark:hover:bg-midnight-850 rounded-[6px] text-[14px] font-medium text-[#171a1f] dark:text-light transition-colors"
          >
            キャンセル
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            className="h-[40px] px-[28px] bg-[#5570f6] hover:bg-[#395ce0] text-white rounded-[6px] text-[14px] font-medium shadow-[0px_1px_2px_rgba(23,26,31,0.08)] transition-all duration-200"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
