import React, { useEffect } from 'react';
import { Tool } from '../../../dashboard/constants/tools';
import { useTool } from '../../../../base/hooks/useTools';
import ToolDetailView from './ToolDetailView';
import { useRouter } from 'next/router';
import useAuthStore from '@base/stores/useAuthStore';
import { useTranslation } from 'next-i18next';

interface ToolDetailModalProps {
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}

export default function ToolDetailModal({ toolId, isOpen, onClose }: ToolDetailModalProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { tool, loading } = useTool(isOpen ? toolId : undefined);
  const { t } = useTranslation('common');

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] md:p-[40px] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-white dark:bg-midnight-950 w-full max-w-[1100px] h-[95vh] md:h-auto md:max-h-[95vh] rounded-[16px] shadow-2xl relative flex flex-col overflow-hidden p-[4px] md:p-[6px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[16px] md:top-[16px] md:right-[20px] p-[8px] bg-white/90 dark:bg-midnight-900/90 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-midnight-800 transition-colors z-20 border border-[#dee1e6] dark:border-midnight-700 shadow-sm"
          title={t('common.close', '閉じる') as string}
        >
          <svg xmlns="http://www.w3.org/2059/svg" className="w-[20px] h-[20px] text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fixed Header */}
        {!loading && tool && (
          <div className="flex-shrink-0 flex items-start justify-between gap-[16px] pt-[12px] px-[16px] md:pt-[16px] md:px-[24px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 z-10 relative">
            <div className="flex items-start gap-[16px]">
              {/* Avatar */}
              <div className="relative flex-shrink-0 w-[48px] h-[48px] rounded-full overflow-hidden bg-[#f3f6fd] dark:bg-midnight-900 shadow-sm border border-[#dbe2f9] dark:border-midnight-800 flex items-center justify-center text-[24px] select-none">
                {tool.icon && (tool.icon.startsWith('data:image/') || tool.icon.startsWith('http') || tool.icon.startsWith('/')) ? (
                  <img
                    src={tool.icon}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{tool.icon || '🔧'}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-[4px] min-w-0 pr-[40px]">
                <div className="flex items-center gap-[12px] flex-wrap">
                  <h2 className="text-[24px] font-bold leading-[30px] text-[#171a1f] dark:text-light tracking-[0.5px] font-base truncate">
                    {tool.name}
                  </h2>
                </div>
                <p className="text-[15px] font-normal leading-[24px] text-[#565d6d] dark:text-gray-400 font-base line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Edit Action for Admin */}
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  onClose();
                  router.push(`/manage-tools/edit/${tool.id}`);
                }}
                className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-gray-50 dark:hover:bg-midnight-800 text-[#171a1f] dark:text-light font-base font-semibold text-[14px] shadow-sm transition-all duration-200 shrink-0 mr-[40px] md:mr-[48px]"
              >
                <PenIcon />
                <span>{t('common.edit', '編集')}</span>
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="w-full h-full overflow-y-auto rounded-[12px]">
          <div className="p-[16px] md:p-[24px] pt-[16px] md:pt-[20px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-[48px] text-center w-full min-h-[400px]">
                <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                  {t('common.loading', '読み込み中...')}
                </p>
              </div>
            ) : tool ? (
              <ToolDetailView tool={tool} hideHeader={true} hideLaunchButton={true} />
            ) : (
              <div className="flex flex-col items-center justify-center p-[48px] text-center w-full min-h-[400px]">
                <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                  {t('toolDetail.notFound', 'ツールが見つかりませんでした。')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
        {!loading && tool && (
          <div className="flex-shrink-0 flex items-center justify-end gap-[12px] px-[16px] py-[12px] md:px-[24px] border-t border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 rounded-b-[12px] z-10 relative">
            <button
              onClick={onClose}
              className="px-[20px] py-[10px] text-[#565d6d] dark:text-gray-300 font-semibold text-[14px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-700 rounded-[8px] hover:bg-gray-50 dark:hover:bg-midnight-800 transition-colors shadow-sm"
            >
              {t('common.close', '閉じる')}
            </button>

            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] px-[20px] py-[10px] bg-[#5570f6] text-white text-[14px] font-semibold rounded-[8px] hover:bg-[#435bce] transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2500/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-[16px] h-[16px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                {t('toolDetail.openTool', 'ツールを開く')}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
