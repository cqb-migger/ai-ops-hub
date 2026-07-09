import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Tool } from '../../constants/tools';
import { useTranslation } from 'next-i18next';
import { API_BASE } from '../../../../base/utils/api';
import ToolDetailModal from '../../../tools/components/organisms/ToolDetailModal';

interface ToolCardProps {
  tool: Tool;
  onToggleFavorite?: (id: string | number) => void;
}

const MAX_VISIBLE_TAGS = 3;

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function ToolCard({ tool, onToggleFavorite }: ToolCardProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(!!tool.is_favorite);
  const { t } = useTranslation('common');

  useEffect(() => {
    setIsFavorite(!!tool.is_favorite);
  }, [tool.is_favorite]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (onToggleFavorite) {
        await onToggleFavorite(tool.id);
      } else {
        const nextFav = !isFavorite;
        setIsFavorite(nextFav);
        const { apiFetch } = await import('../../../../base/utils/api');
        const res = await apiFetch<{ is_favorite: boolean }>(`/tools/${tool.id}/favorite`, {
          method: 'POST',
        });
        setIsFavorite(res.is_favorite);
        if (res.is_favorite) {
          toast.success(t('dashboard.favAddSuccess', 'お気に入りに追加しました'));
        } else {
          toast.success(t('dashboard.favRemoveSuccess', 'お気に入りから削除しました'));
        }
      }
    } catch (err) {
      toast.error(t('common.error', 'エラーが発生しました'));
      setIsFavorite(!!tool.is_favorite);
    }
  };

  const handleLaunch = () => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    } else {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success(t('dashboard.simulatingLaunch', '{{name}}を起動しています... (シミュレーション)', { name: tool.name }), { duration: 2000 });
      });
    }
  };

  const visibleTags = tool.category.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = Math.max(0, tool.category.length - MAX_VISIBLE_TAGS);
  const hasLongDesc = tool.description && tool.description.length > 60;

  return (
    <div className="w-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_4px_0px_rgba(23,26,31,0.07)] p-[16px] flex flex-col gap-[8px] justify-between hover:shadow-md transition-shadow duration-200">
      {/* Upper part */}
      <div className="flex flex-col gap-[8px]">
        {/* Icon + Title + Help */}
        <div className="flex items-start justify-between gap-[10px] min-w-0">
          <div className="flex items-center gap-[10px] min-w-0">
            <div className="flex-shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center bg-[#f3f6fd] dark:bg-midnight-900 border border-[#dbe2f9] dark:border-midnight-700 text-[22px]">
              {tool.icon && (tool.icon.startsWith('data:image/') || tool.icon.startsWith('http') || tool.icon.startsWith('/')) ? (
                <img src={tool.icon.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${tool.icon}` : tool.icon} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                tool.icon || '🔧'
              )}
            </div>
            <h3 className="text-[15px] font-bold leading-[22px] text-[#0f295a] dark:text-light tracking-[-0.3px] font-base truncate">
              {tool.name}
            </h3>
          </div>
          <div className="flex items-center gap-[6px]">
            <button
              onClick={handleFavoriteClick}
              className={`flex-shrink-0 w-[28px] h-[28px] rounded-full border flex items-center justify-center transition-colors group ${
                isFavorite
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-500'
                  : 'border-[#dbe2f9] dark:border-midnight-700 bg-white dark:bg-midnight-900 text-[#5a73a3] dark:text-gray-400 hover:bg-[#ffe3e3] dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900'
              }`}
              title={(isFavorite ? t('dashboard.favRemoveTitle', 'お気に入りから削除') : t('dashboard.favAddTitle', 'お気に入りに追加')) as string}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-[#5a73a3] dark:text-gray-400 group-hover:text-red-500'
                }`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-shrink-0 w-[28px] h-[28px] rounded-full border border-[#dbe2f9] dark:border-midnight-700 bg-white dark:bg-midnight-900 flex items-center justify-center hover:bg-[#f0f3fa] dark:hover:bg-midnight-800 transition-colors"
              title={t('dashboard.detailTitle', '{{name}}の詳細情報', { name: tool.name }) as string}
            >
              <span className="text-[12px] font-semibold text-[#5a73a3] dark:text-gray-400 leading-none select-none">?</span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-[4px] items-center">
          {visibleTags.map((tag) => (
            <span key={tag} className="bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[10px] font-medium text-[#2c5097] dark:text-[#8fa4f5] rounded-full px-[10px] h-[20px] flex items-center justify-center whitespace-nowrap">
              {tag}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[10px] font-medium text-[#2c5097] dark:text-[#8fa4f5] rounded-full px-[8px] h-[20px] flex items-center justify-center whitespace-nowrap">
              +{hiddenCount}
            </span>
          )}
        </div>

        {/* Description 3-line clamp + blue ... tooltip */}
        <div className="relative">
          <p style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}
            className="text-[13px] leading-[19px] text-[#565d6d] dark:text-gray-400 font-normal font-base pr-[18px]">
            {tool.description}
          </p>
          {hasLongDesc && (
            <div className="absolute bottom-0 right-0 bg-white dark:bg-midnight-950 pl-[3px] flex items-center group/dots cursor-default select-none z-10">
              <span className="text-[13px] font-bold leading-[19px] text-[#9095a0] dark:text-gray-500 group-hover/dots:text-[#5570f6] dark:group-hover/dots:text-[#7c91eb] transition-colors">...</span>
              <div className="absolute bottom-full right-0 mb-[8px] hidden group-hover/dots:block w-[240px] p-[10px] bg-[#171a1f] dark:bg-midnight-900 text-white dark:text-light text-[12px] leading-[17px] rounded-[8px] shadow-xl z-30 text-left font-normal border border-gray-700 dark:border-midnight-800 break-words pointer-events-none">
                {tool.description}
                <div className="absolute top-full right-[6px] border-[6px] border-transparent border-t-[#171a1f] dark:border-t-midnight-900" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="pt-[4px]">
        <button
          onClick={handleLaunch}
          className="flex items-center justify-center gap-[6px] w-full h-[40px] text-white rounded-[12px] font-base font-semibold text-[14px] shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          style={{ background: 'linear-gradient(to right, #2563eb, #60a5fa)' }}
        >
          <span>{t('dashboard.launch')}</span>
          <ArrowRightIcon />
        </button>
      </div>

      {/* Detail Modal */}
      <ToolDetailModal
        toolId={String(tool.id)}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
