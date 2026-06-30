import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Tool } from '../../../dashboard/constants/tools';
import { API_BASE } from '../../../../base/utils/api';

interface ToolDetailViewProps {
  tool: Tool;
}

// Icons
function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="19" x2="5" y1="12" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#565d6d] dark:text-gray-400">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function SparklesIcon({ className = "w-[20px] h-[20px] text-[#5570f6]" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function ShieldAlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-amber-600 dark:text-amber-400">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

export default function ToolDetailView({ tool }: ToolDetailViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('プロンプトをコピーしました！');
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleLaunchTool = () => {
    toast.success('外部ツールを起動します... (シミュレーション)');
  };

  const details = tool.details || {
    inputs: ['必要な情報またはファイル'],
    outputDescription: '分析結果またはアウトプットドキュメント。',
    prompts: [
      {
        title: `${tool.name} の基本プロンプト`,
        description: '標準的な実行手順テンプレートです。',
        content: `以下のデータに基づいて処理を行ってください。\n\n[※ここにデータをペーストしてください]`,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-[28px] w-full max-w-[800px] mx-auto">
      {/* Back button */}
      <Link href="/">
        <span className="flex items-center gap-[8px] text-[#565d6d] hover:text-[#5570f6] dark:text-gray-300 dark:hover:text-white text-[14px] leading-[22px] font-base font-medium cursor-pointer w-fit transition-colors duration-200">
          <ArrowLeftIcon />
          <span>ダッシュボードに戻る</span>
        </span>
      </Link>

      {/* Title box */}
      <div className="flex items-start gap-[16px] pb-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
        {/* Avatar */}
        <div className="relative flex-shrink-0 w-[64px] h-[64px] rounded-full overflow-hidden bg-[#f3f6fd] dark:bg-midnight-900 shadow-sm border border-[#dbe2f9] dark:border-midnight-800 flex items-center justify-center text-[32px] select-none">
          {tool.icon && (tool.icon.startsWith('data:image/') || tool.icon.startsWith('http') || tool.icon.startsWith('/')) ? (
            <img
              src={tool.icon.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${tool.icon}` : tool.icon}
              alt={tool.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{tool.icon || '🔧'}</span>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-[8px] min-w-0">
          <div className="flex items-center gap-[12px] flex-wrap">
            <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base truncate">
              {tool.name}
            </h2>
            {tool.category.map((cat) => (
              <span key={cat} className="bg-[#f3f4f6] dark:bg-midnight-850 text-[12px] font-semibold text-[#1e2128] dark:text-gray-300 rounded-[11px] px-[12px] h-[22px] flex items-center whitespace-nowrap">
                {cat}
              </span>
            ))}
            {tool.role && (
              <span className="bg-[#e0e7ff] dark:bg-indigo-950/40 text-[12px] font-semibold text-[#4f46e5] dark:text-indigo-300 rounded-[11px] px-[12px] h-[22px] flex items-center whitespace-nowrap gap-[4px]">
                💼 {tool.role === 'sales' ? '営業 (Sales)' : tool.role === 'marketing' ? 'マーケティング' : tool.role === 'dev' ? '開発 (Dev)' : tool.role}
              </span>
            )}
            {tool.visibility && (
              <span className={`text-[12px] font-semibold rounded-[11px] px-[12px] h-[22px] flex items-center whitespace-nowrap gap-[4px] ${
                tool.visibility === 'public'
                  ? 'bg-[#dcfce7] dark:bg-green-950/40 text-[#15803d] dark:text-green-300'
                  : 'bg-[#fee2e2] dark:bg-red-950/40 text-[#b91c1c] dark:text-red-300'
              }`}>
                🌐 {tool.visibility === 'public' ? '公開' : '非公開'}
              </span>
            )}
            {tool.promptVisibility && (
              <span className="bg-[#fef3c7] dark:bg-amber-950/40 text-[12px] font-semibold text-[#b45309] dark:text-amber-300 rounded-[11px] px-[12px] h-[22px] flex items-center whitespace-nowrap gap-[4px]">
                🔒 プロンプト: {tool.promptVisibility === 'public' ? '公開' : '非公開'}
              </span>
            )}
          </div>
          <p className="text-[18px] font-normal leading-[28px] text-[#565d6d] dark:text-gray-400 font-base">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Task Prerequisites */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[8px]">
          <FileTextIcon />
          <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
            タスクの前提条件
          </h3>
        </div>

        {/* Panels Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          {/* Input Panel */}
          <div className="bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[20px] flex flex-col gap-[16px] shadow-sm">
            <div className="flex items-center gap-[8px]">
              <ChevronRightIcon />
              <span className="text-[14px] font-semibold leading-[20px] text-[#565d6d] dark:text-gray-400 tracking-[0.7px] uppercase font-base">
                提供するデータ (Input)
              </span>
            </div>
            <div className="flex flex-col gap-[10px]">
              {details.inputs.map((input, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-midnight-900 border border-[rgba(222,225,230,0.5)] dark:border-midnight-800 rounded-[6px] h-[46px] px-[12px] flex items-center gap-[10px] shadow-sm"
                >
                  <div className="flex-shrink-0 bg-[#5570f6] w-[6px] h-[6px] rounded-full" />
                  <span className="text-[14px] text-[#171a1f] dark:text-light font-base truncate">
                    {input}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[20px] flex flex-col gap-[16px] shadow-sm">
            <div className="flex items-center gap-[8px]">
              <ChevronRightIcon />
              <span className="text-[14px] font-semibold leading-[20px] text-[#565d6d] dark:text-gray-400 tracking-[0.7px] uppercase font-base">
                期待する結果 (Output)
              </span>
            </div>
            <div className="bg-white dark:bg-midnight-900 border border-[rgba(222,225,230,0.5)] dark:border-midnight-800 rounded-[6px] min-h-[158px] p-[16px] shadow-sm flex items-start">
              <p className="text-[14px] leading-[23px] text-[#171a1f] dark:text-light font-base">
                {details.outputDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Guide */}
      {tool.guideContent && (
        <div className="flex flex-col gap-[16px] mt-[12px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[24px] shadow-sm">
          <div className="flex items-center gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
            <BookOpenIcon />
            <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
              活用ガイド
            </h3>
          </div>
          <div className="prose dark:prose-invert max-w-none text-[14px] leading-[24px] text-[#323842] dark:text-gray-300 font-base whitespace-pre-wrap">
            {tool.guideContent}
          </div>
          {tool.guideMaterials && tool.guideMaterials.length > 0 && (
            <div className="flex flex-col gap-[8px] mt-[12px] pt-[16px] border-t border-[#dee1e6] dark:border-midnight-800">
              <span className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400 uppercase tracking-[0.5px]">
                関連資料 (Materials)
              </span>
              <div className="flex flex-wrap gap-[12px]">
                {tool.guideMaterials.map((material, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-[8px] px-[12px] py-[8px] bg-[#f3f4f6] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-[#e5e7eb] dark:hover:bg-midnight-850 cursor-pointer transition-colors w-fit"
                  >
                    <PaperclipIcon />
                    <span className="text-[13px] font-medium text-[#171a1f] dark:text-light truncate max-w-[200px]">
                      {material}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Memo */}
      {tool.adminMemo && (
        <div className="bg-[#fffbeb] dark:bg-amber-950/20 border border-[#fef3c7] dark:border-amber-900/50 rounded-[12px] p-[16px] mt-[12px] flex gap-[12px] items-start">
          <div className="flex-shrink-0 mt-[2px]">
            <ShieldAlertIcon />
          </div>
          <div className="flex flex-col gap-[4px] min-w-0">
            <span className="text-[13px] font-semibold text-[#b45309] dark:text-amber-400 font-base uppercase tracking-[0.5px]">
              管理者用メモ (非公開)
            </span>
            <p className="text-[13px] leading-[20px] text-[#78350f] dark:text-amber-300/90 font-base whitespace-pre-wrap">
              {tool.adminMemo}
            </p>
          </div>
        </div>
      )}

      {/* Recommended Prompts */}
      <div className="flex flex-col gap-[16px] mt-[12px]">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-[12px]">
          <div className="flex items-center gap-[8px]">
            <SparklesIcon />
            <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
              推奨プロンプト
            </h3>
          </div>
          <span className="text-[12px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
            ステップ 1 / {details.prompts.length}
          </span>
        </div>
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
          以下のプロンプトをコピーし、ツール起動後のチャット入力欄に貼り付けて開始してください。[※]の部分はお手元のデータで書き換える必要があります。
        </p>

        {/* Prompts Cards List */}
        <div className="flex flex-col gap-[24px]">
          {details.prompts.map((prompt, idx) => {
            const isRec = prompt.isRecommended;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-midnight-950 border rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-md transition-colors duration-200 ${
                  isRec
                    ? 'border-[#5570f6]/50 dark:border-[#5570f6]/40'
                    : 'border-[#dee1e6] dark:border-midnight-800'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-[16px] flex-wrap">
                  <div className="flex items-center gap-[12px]">
                    <h4 className="text-[18px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
                      {prompt.title}
                    </h4>
                    {isRec && (
                      <div className="bg-[#5570f6] h-[22px] rounded-[11px] px-[10px] flex items-center gap-[4px]">
                        <SparklesIcon className="w-[12px] h-[12px] text-white" />
                        <span className="text-[12px] font-semibold text-white font-base leading-[16px]">
                          推奨
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(prompt.content, idx)}
                    className="flex items-center gap-[8px] h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-primary-50 dark:hover:bg-midnight-900 text-[#171a1f] dark:text-light font-base font-medium text-[14px] shadow-sm transition-colors duration-200"
                  >
                    {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedIndex === idx ? 'コピーしました' : 'プロンプトをコピー'}</span>
                  </button>
                </div>

                {/* Subtitle */}
                <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
                  {prompt.description}
                </p>

                {/* Content Box */}
                <div className="bg-[#fafafb]/50 dark:bg-midnight-900 border border-[rgba(222,225,230,0.5)] dark:border-midnight-800 rounded-[6px] p-[16px] max-h-[330px] overflow-y-auto">
                  <pre className="text-[14px] leading-[23px] text-[#171a1f] dark:text-light font-mono whitespace-pre-wrap">
                    {prompt.content}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[20px] pt-[24px] border-t border-[#dee1e6] dark:border-midnight-800 mt-[12px]">
        <div className="flex flex-col gap-[6px]">
          <h4 className="text-[16px] font-semibold leading-[24px] text-[#171a1f] dark:text-light font-base">
            準備は完了しましたか？
          </h4>
          <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
            プロンプトをコピーしたら、ツールを起動してタスクを開始しましょう。
          </p>
        </div>
        <button
          onClick={handleLaunchTool}
          className="flex items-center justify-center gap-[8px] w-[219px] h-[48px] bg-[#5570f6] text-white hover:bg-primary-600 rounded-[6px] shadow-md font-base font-medium text-[14px] transition-all duration-200"
        >
          <span>ツールを起動</span>
          <ExternalLinkIcon />
        </button>
      </div>
    </div>
  );
}
