import React from 'react';
import Link from 'next/link';
import { Tool } from '../../constants/tools';

interface ToolCardProps {
  tool: Tool;
}

const MAX_VISIBLE_TAGS = 3;

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function ToolCard({ tool }: ToolCardProps) {
  const handleLaunch = () => {
    if (tool.url) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    } else {
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success(`${tool.name}を起動しています... (シミュレーション)`, { duration: 2000 });
      });
    }
  };

  const visibleTags = tool.category.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = Math.max(0, tool.category.length - MAX_VISIBLE_TAGS);

  return (
    <div className="w-full h-[300px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[20px] shadow-[0px_2px_8px_0px_rgba(23,26,31,0.06)] p-[24px] flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
      {/* Upper part */}
      <div className="flex flex-col gap-[10px]">
        {/* Tool Icon, Title & Help Icon Row */}
        <div className="flex items-start justify-between gap-[12px] min-w-0">
          <div className="flex items-center gap-[12px] min-w-0">
            {/* Tool Icon — large circle with pale blue background & border */}
            <div className="flex-shrink-0 w-[48px] h-[48px] rounded-full overflow-hidden flex items-center justify-center bg-[#f3f6fd] dark:bg-midnight-900 border border-[#dbe2f9] dark:border-midnight-700 text-[24px]">
              {tool.icon && (tool.icon.startsWith('data:image/') || tool.icon.startsWith('http') || tool.icon.startsWith('/')) ? (
                <img src={tool.icon} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                tool.icon || '🔧'
              )}
            </div>

            {/* Tool Name — Deep Navy blue */}
            <h3 className="text-[18px] font-bold leading-[24px] text-[#0f295a] dark:text-light tracking-[-0.3px] font-base truncate">
              {tool.name}
            </h3>
          </div>

          {/* Help Icon Link — circle container with matching light blue border */}
          <Link
            href={`/tools/${tool.id}`}
            className="flex-shrink-0 w-[32px] h-[32px] rounded-full border border-[#dbe2f9] dark:border-midnight-700 bg-white dark:bg-midnight-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-midnight-800 transition-colors"
            title={`${tool.name}の詳細 hình`}
          >
            <span className="text-[14px] font-semibold text-[#5a73a3] dark:text-gray-400 leading-none select-none">?</span>
          </Link>
        </div>

        {/* Tags — blue outline pills with pale blue background */}
        <div className="flex flex-wrap gap-[6px] items-center">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[11px] font-medium text-[#2c5097] dark:text-[#8fa4f5] rounded-full px-[12px] h-[22px] flex items-center justify-center whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[11px] font-medium text-[#2c5097] dark:text-[#8fa4f5] rounded-full px-[10px] h-[22px] flex items-center justify-center whitespace-nowrap">
              +{hiddenCount}
            </span>
          )}
        </div>

        {/* Description with Tooltip */}
        <div className="relative group/desc mt-[2px]">
          <p className="text-[15px] leading-[22px] text-[#323842] dark:text-gray-300 font-normal font-base line-clamp-3 cursor-pointer">
            {tool.description}
          </p>
          {tool.description && tool.description.length > 60 && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px] hidden group-hover/desc:block w-[280px] p-[12px] bg-[#171a1f] dark:bg-midnight-900 text-white dark:text-light text-[13px] leading-[18px] rounded-[8px] shadow-xl z-30 text-left font-normal border border-gray-700 dark:border-midnight-800 break-all pointer-events-none">
              {tool.description}
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#171a1f] dark:border-t-midnight-900" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action — vibrant gradient button */}
      <div>
        <button
          onClick={handleLaunch}
          className="flex items-center justify-center gap-[8px] w-full h-[48px] text-white rounded-[14px] font-base font-semibold text-[16px] shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          style={{ background: 'linear-gradient(to right, #2563eb, #60a5fa)' }}
        >
          <span>ツールを起動</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>

  );
}
