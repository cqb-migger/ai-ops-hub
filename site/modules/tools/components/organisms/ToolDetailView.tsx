import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Tool } from '../../../dashboard/constants/tools';
import { API_BASE } from '../../../../base/utils/api';
import useAuthStore from '@base/stores/useAuthStore';
import { useTranslation } from 'next-i18next';

interface ToolDetailViewProps {
  tool: Tool;
  hideHeader?: boolean;
  hideLaunchButton?: boolean;
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

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
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

export default function ToolDetailView({ tool, hideHeader = false, hideLaunchButton = false }: ToolDetailViewProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { t } = useTranslation('common');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedLoginIdIndex, setCopiedLoginIdIndex] = useState<number | null>(null);
  const [isMcpOpen, setIsMcpOpen] = useState<boolean>(false);
  const [mcpTab, setMcpTab] = useState<'stdio' | 'http'>('stdio');

  useEffect(() => {
    if (tool?.mcp_type) {
      setMcpTab(tool.mcp_type);
    }
  }, [tool?.mcp_type]);

  const fromPath = router.query.from as string;
  const backHref = fromPath || '/';

  let backLabel = t('toolDetail.backToDashboard', 'ダッシュボードに戻る');
  if (fromPath?.startsWith('/compliance-hub')) backLabel = t('toolDetail.backToCompliance', 'コンプライアンスハブに戻る');
  else if (fromPath?.startsWith('/creative-hub')) backLabel = t('toolDetail.backToCreative', 'クリエイティブハブに戻る');
  else if (fromPath?.startsWith('/data-hub')) backLabel = t('toolDetail.backToData', 'データハブに戻る');
  else if (fromPath?.startsWith('/manage-tools')) backLabel = t('toolDetail.backToManageTools', 'ツール管理に戻る');

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success(t('toolDetail.copySuccessPrompt', 'プロンプトをコピーしました！'));
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleCopyLoginId = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedLoginIdIndex(index);
    toast.success(t('toolDetail.copySuccessLoginId', 'ログインIDをコピーしました！'));
    setTimeout(() => {
      setCopiedLoginIdIndex(null);
    }, 2000);
  };

  const handleLaunchTool = () => {
    toast.success(t('toolDetail.launchSimulation', '外部ツールを起動します... (シミュレーション)'));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownloadFile = async (fileId: number, originalName: string) => {
    try {
      const url = `${API_BASE}/tools/${tool.id}/guide-files/${fileId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        toast.error(t('toolDetail.downloadFailed', 'ファイルのダウンロードに失敗しました。'));
        return;
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error(t('toolDetail.downloadFailed', 'ファイルのダウンロードに失敗しました。'));
    }
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

  const currentPath = router.pathname;
  let filterCategoryId: number | null = null;
  if (currentPath.startsWith('/creative-hub') || fromPath?.startsWith('/creative-hub')) {
    filterCategoryId = 1;
  } else if (currentPath.startsWith('/compliance-hub') || fromPath?.startsWith('/compliance-hub')) {
    filterCategoryId = 2;
  } else if (currentPath.startsWith('/data-hub') || fromPath?.startsWith('/data-hub')) {
    filterCategoryId = 3;
  }

  const displayPrompts = (tool.prompts && tool.prompts.length > 0)
    ? tool.prompts
      .filter(p => {
        if (filterCategoryId === null) return true;
        return (
          p.categories?.some((cat: any) => cat.id === filterCategoryId) ||
          (p as any).category_ids?.includes(filterCategoryId)
        );
      })
      .map(p => ({
        title: p.title || '',
        description: p.description || '',
        content: p.content || '',
        isRecommended: p.isRecommended ?? p.is_recommended ?? false
      }))
    : (details.prompts || []);

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title box */}
      {!hideHeader && (
        <div className="flex items-start justify-between gap-[16px] dark:border-midnight-800">
          <div className="flex items-start gap-[16px] min-w-0">
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
                <h2 className="text-[22px] sm:text-[30px] font-bold leading-[30px] sm:leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base truncate">
                  {tool.name}
                </h2>
              </div>
              <p className="text-[18px] font-normal leading-[28px] text-[#565d6d] dark:text-gray-400 font-base">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Edit Action for Admin */}
          {user?.role === 'admin' && (
            <button
              onClick={() => router.push(`/manage-tools/edit/${tool.id}`)}
              className="flex-shrink-0 flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-gray-50 dark:hover:bg-midnight-800 text-[#171a1f] dark:text-light font-base font-semibold text-[14px] shadow-sm transition-all duration-200"
            >
              <PenIcon />
              <span>{t('common.edit')}</span>
            </button>
          )}
        </div>
      )}

      {/* Login Info & Launch Card */}
      {((tool.loginIds && tool.loginIds.length > 0) || tool.url) && (
        <div className="bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px] mt-[12px]">
          <div className="flex items-center justify-between border-b dark:border-midnight-800 pb-[12px] flex-wrap gap-[12px]">
            <div className="flex items-center gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-[20px] h-[20px] text-[#5570f6]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
                {t('toolDetail.connectionSettings', '接続・ログイン設定')}
              </h3>
            </div>
            {!hideLaunchButton && tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#5570f6] hover:bg-[#405bd4] text-white text-[13px] font-bold rounded-[8px] transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2059/svg" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                <span>{t('toolDetail.openTool', 'ツールを開く')}</span>
              </a>
            )}
          </div>

          {tool.loginIds && tool.loginIds.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              <span className="text-[13px] font-semibold text-[#565d6d] dark:text-gray-400">
                {t('toolDetail.loginId', 'ログインID')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[12px]">
                {tool.loginIds.map((loginId, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-[12px] bg-[#f8fafc] dark:bg-midnight-900 border border-[#e2e8f0] dark:border-midnight-800 rounded-[8px] hover:bg-[#f1f5f9] dark:hover:bg-midnight-850 transition-colors"
                  >
                    <span className="text-[14px] font-mono text-[#0f172a] dark:text-light font-medium truncate pr-[8px]">
                      {loginId}
                    </span>
                    <button
                      onClick={() => handleCopyLoginId(loginId, index)}
                      className="text-[#64748b] hover:text-[#5570f6] dark:text-gray-400 dark:hover:text-[#7c91eb] transition-colors flex-shrink-0"
                      title={t('common.copy', 'コピー') as string}
                    >
                      {copiedLoginIdIndex === index ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-[16px] h-[16px] text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-[16px] h-[16px]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0A2.25 2.25 0 0 1 13.5 5.25h-3a2.25 2.25 0 0 1-2.166-1.612m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.546.546.908 1.287.908 2.112v12.75a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25V5.375c0-.825.362-1.566.908-2.112" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tool.mcp_name && (
        <div className="bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[24px] shadow-sm flex flex-col mt-[12px]">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsMcpOpen(!isMcpOpen)}
          >
            <div className="flex items-center gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6]">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" x2="6.01" y1="6" y2="6" />
                <line x1="6" x2="6.01" y1="18" y2="18" />
              </svg>
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
                {t('toolDetail.mcpConnectionSettings')}
              </h3>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className={`w-[20px] h-[20px] text-gray-500 transition-transform duration-200 ${isMcpOpen ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {isMcpOpen && (
            <div className="mt-[20px] border-t border-[#dee1e6] dark:border-midnight-800 pt-[20px] flex flex-col gap-[20px]">

              {/* Name Field */}
              <div className="flex flex-col gap-[6px]">
                <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  {t('common.name')}
                </label>
                <div className="text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                  {tool.mcp_name || ''}
                </div>
              </div>

              {/* Tab Selector (Fully Interactive) */}
              <div className="flex border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] overflow-hidden p-[2px] bg-[#f3f4f6] dark:bg-midnight-900 select-none">
                <button
                  type="button"
                  onClick={() => setMcpTab('stdio')}
                  className={`flex-1 py-[8px] text-center text-[13px] font-semibold rounded-[4px] transition-all duration-200 ${mcpTab === 'stdio'
                    ? 'bg-[#c5c7cb] dark:bg-midnight-700 text-[#171a1f] dark:text-light shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  STDIO
                </button>
                <button
                  type="button"
                  onClick={() => setMcpTab('http')}
                  className={`flex-1 py-[8px] text-center text-[13px] font-semibold rounded-[4px] transition-all duration-200 ${mcpTab === 'http'
                    ? 'bg-[#c5c7cb] dark:bg-midnight-700 text-[#171a1f] dark:text-light shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {t('mcp.streamableHttp')}
                </button>
              </div>

              {/* Tab Content Box */}
              {mcpTab === 'stdio' ? (
                <div className="border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] p-[20px] bg-[#fafafb] dark:bg-midnight-900/40 flex flex-col gap-[20px]">

                  {/* Command */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpStdioCommand')}
                    </span>
                    <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                      {tool.mcp_stdio_command || '-'}
                    </div>
                  </div>

                  {/* Arguments */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpStdioArgs')}
                    </span>
                    <div className="flex flex-col gap-[8px] py-[4px]">
                      {tool.mcp_stdio_args && tool.mcp_stdio_args.length > 0 ? (
                        tool.mcp_stdio_args.map((arg, idx) => (
                          <div key={idx} className="font-mono text-[14px] text-[#171a1f] dark:text-light break-all">
                            {arg || '-'}
                          </div>
                        ))
                      ) : (
                        <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                          -
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Environment variables */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpStdioEnv')}
                    </span>
                    <div className="flex flex-col gap-[8px] py-[4px]">
                      {tool.mcp_stdio_env && tool.mcp_stdio_env.length > 0 ? (
                        tool.mcp_stdio_env.map((env, idx) => (
                          <div key={idx} className="flex items-center gap-[12px]">
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all pr-[4px]">
                              {env.key || '-'}
                            </div>
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all">
                              {(user?.role === 'admin') ? (env.value || '-') : '••••••'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                          -
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Env Passthrough */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpStdioEnvPassthrough')}
                    </span>
                    <div className="flex flex-col gap-[8px] py-[4px]">
                      {tool.mcp_stdio_env_passthrough && tool.mcp_stdio_env_passthrough.length > 0 ? (
                        tool.mcp_stdio_env_passthrough.map((p, idx) => (
                          <div key={idx} className="font-mono text-[14px] text-[#171a1f] dark:text-light break-all">
                            {p || '-'}
                          </div>
                        ))
                      ) : (
                        <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                          -
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Working directory */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpStdioWorkDir')}
                    </span>
                    <div className="font-mono text-[14px] text-[#171a1f] dark:text-light break-all py-[4px]">
                      {tool.mcp_stdio_work_dir || '-'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] p-[20px] bg-[#fafafb] dark:bg-midnight-900/40 flex flex-col gap-[20px]">

                  {/* HTTP URL */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpHttpUrl')}
                    </span>
                    <div className="font-mono text-[14px] text-[#171a1f] dark:text-light break-all py-[4px]">
                      {tool.mcp_http_url || '-'}
                    </div>
                  </div>

                  {/* Bearer Token */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpHttpBearerTokenEnv')}
                    </span>
                    <div className="font-mono text-[14px] text-[#171a1f] dark:text-light break-all py-[4px]">
                      {tool.mcp_http_bearer_token_env || '-'}
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpHttpHeaders')}
                    </span>
                    <div className="flex flex-col gap-[8px] py-[4px]">
                      {tool.mcp_http_headers && tool.mcp_http_headers.length > 0 ? (
                        tool.mcp_http_headers.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-[12px]">
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all pr-[4px]">
                              {h.key || '-'}
                            </div>
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all">
                              {(user?.role === 'admin') ? (h.value || '-') : '••••••'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                          -
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Headers from Env */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[13px] font-semibold text-[#171a1f] dark:text-light">
                      {t('toolDetail.mcpHttpHeadersFromEnv')}
                    </span>
                    <div className="flex flex-col gap-[8px] py-[4px]">
                      {tool.mcp_http_headers_from_env && tool.mcp_http_headers_from_env.length > 0 ? (
                        tool.mcp_http_headers_from_env.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-[12px]">
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all pr-[4px]">
                              {h.key || '-'}
                            </div>
                            <div className="flex-1 font-mono text-[14px] text-[#171a1f] dark:text-light break-all">
                              {h.value || '-'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="font-mono text-[14px] text-[#171a1f] dark:text-light py-[4px]">
                          -
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Usage Guide */}
      {tool.guideContent && (
        <div className="flex flex-col gap-[16px] mt-[12px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[24px] shadow-sm">
          <div className="flex items-center justify-between pb-[12px] border-b dark:border-midnight-800">
            <div className="flex items-center gap-[8px]">
              <BookOpenIcon />
              <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
                {t('toolDetail.guide', '活用ガイド')}
              </h3>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-[14px] leading-[24px] text-[#323842] dark:text-gray-300 font-base">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-[22px] font-bold mt-4 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-[18px] font-bold mt-3 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-[16px] font-bold mt-3 mb-1" {...props} />,
                p: ({ node, ...props }) => <p className="my-[8px] leading-[24px]" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-[20px] my-[8px] space-y-[4px]" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-[20px] my-[8px] space-y-[4px]" {...props} />,
                li: ({ node, ...props }) => <li className="leading-[24px]" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#5570f6] pl-[12px] italic text-[#565d6d] dark:text-gray-400 my-[8px]" {...props} />,
                code: ({ node, ...props }) => <code className="bg-[#f0f0f0] dark:bg-midnight-800 rounded px-[4px] py-[1px] text-[13px] font-mono" {...props} />,
                pre: ({ node, ...props }) => <pre className="bg-[#f0f0f0] dark:bg-midnight-800 rounded-[4px] p-[12px] overflow-x-auto text-[13px] font-mono my-[8px]" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-[#dee1e6] dark:border-midnight-800 my-[12px]" {...props} />,
              }}
            >
              {tool.guideContent}
            </ReactMarkdown>
          </div>
          {tool.guideMaterials && tool.guideMaterials.length > 0 && (
            <div className="flex flex-col gap-[8px] mt-[12px] pt-[16px] border-t border-[#dee1e6] dark:border-midnight-800">
              <span className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400 uppercase tracking-[0.5px]">
                {t('toolDetail.materials', '関連資料 (Materials)')}
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


      {/* Reference / Downloadable documents */}
      {tool.guide_files && tool.guide_files.length > 0 && (
        <div className="flex flex-col gap-[16px] mt-[12px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[24px] shadow-sm">
          <div className="flex items-center gap-[8px] pb-[12px] border-b dark:border-midnight-800">
            <FileTextIcon />
            <h3 className="text-[20px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base">
              {t('toolDetail.reference', 'リファレンス資料')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
            {[...tool.guide_files]
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => handleDownloadFile(file.id, file.original_name)}
                  className="group flex items-center gap-[12px] p-[12px] bg-[#f8fafc] dark:bg-midnight-900 border border-[#e2e8f0] dark:border-midnight-800 rounded-[8px] hover:border-[#5570f6] dark:hover:border-[#5570f6] hover:bg-[#f1f5f9] dark:hover:bg-midnight-850 transition-colors text-left"
                >
                  <div className="flex-shrink-0 w-[36px] h-[36px] rounded-[8px] bg-[#eef2ff] dark:bg-midnight-800 flex items-center justify-center">
                    <PaperclipIcon />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[14px] font-medium text-[#171a1f] dark:text-light truncate">
                      {file.original_name}
                    </span>
                    {file.file_size ? (
                      <span className="text-[12px] text-[#565d6d] dark:text-gray-400">
                        {formatFileSize(file.file_size)}
                      </span>
                    ) : null}
                  </div>
                  <span className="flex-shrink-0 text-[#64748b] dark:text-gray-400 group-hover:text-[#5570f6] dark:group-hover:text-[#7c91eb] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </span>
                </button>
              ))}
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
              {t('toolDetail.recommendedPrompts', '推奨プロンプト')}
            </h3>
          </div>
        </div>
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
          {t('toolDetail.recommendedPromptsDesc', '以下のプロンプトをコピーし、ツール起動後のチャット入力欄に貼り付けて開始してください。[※]の部分はお手元のデータで書き換える必要があります。')}
        </p>

        {/* Prompts Cards List */}
        <div className="flex flex-col gap-[24px]">
          {displayPrompts.length > 0 ? (
            displayPrompts.map((prompt, idx) => {
              const isRec = prompt.isRecommended;
              return (
                <div
                  key={idx}
                  className={`bg-white dark:bg-midnight-950 border rounded-[16px] p-[24px] flex flex-col gap-[16px] shadow-md transition-colors duration-200 ${isRec
                    ? 'border-[#5570f6]/50 dark:border-[#5570f6]/40'
                    : 'border-[#dee1e6] dark:border-midnight-800'
                    }`}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-[16px] flex-wrap">
                    <div className="flex items-center gap-[12px] min-w-0 flex-1">
                      <h4 className="text-[18px] font-semibold leading-[28px] text-[#171a1f] dark:text-light font-base break-all">
                        {prompt.title}
                      </h4>
                    </div>
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(prompt.content, idx)}
                      className="flex items-center justify-center gap-[8px] h-[36px] min-w-[180px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-primary-50 dark:hover:bg-midnight-900 text-[#171a1f] dark:text-light font-base font-medium text-[14px] shadow-sm transition-colors duration-200"
                    >
                      {copiedIndex === idx ? <CheckIcon /> : <CopyIcon />}
                      <span>{copiedIndex === idx ? t('toolDetail.copied', 'コピーしました') : t('toolDetail.copyPrompt', 'プロンプトをコピー')}</span>
                    </button>
                  </div>

                  {/* Content Box */}
                  <div className="bg-[#fafafb]/50 dark:bg-midnight-900 border border-[rgba(222,225,230,0.5)] dark:border-midnight-800 rounded-[6px] p-[16px] max-h-[330px] overflow-y-auto">
                    <pre className="text-[14px] leading-[23px] text-[#171a1f] dark:text-light font-mono whitespace-pre-wrap break-all">
                      {prompt.content}
                    </pre>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-[32px] border border-dashed border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-gray-500 dark:text-gray-400 font-base font-medium">
              {t('toolDetail.noPrompts', 'このカテゴリに関連する推奨プロンプトはありません。')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

