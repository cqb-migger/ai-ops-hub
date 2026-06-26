import React from 'react';
import Link from 'next/link';
import { Tool } from '../../constants/tools';

interface ToolCardProps {
  tool: Tool;
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-[#5570f6] dark:text-[#5570f6] hover:opacity-80 transition-opacity">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" x2="12.01" y1="17" y2="17" />
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

  return (
    <div className="w-full h-[250px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07)] p-[20px] flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      {/* Upper part */}
      <div className="flex flex-col gap-[8px]">
        {/* Tool Icon, Title & Help Icon Row */}
        <div className="flex items-center justify-between gap-[8px] min-w-0">
          <div className="flex items-center gap-[8px] min-w-0">
            {/* Tool Icon */}
            <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-midnight-900 border border-gray-100 dark:border-midnight-800 text-[14px]">
              {tool.icon || '🔧'}
            </div>

            {/* Tool Name */}
            <h3 className="text-[15px] font-semibold leading-[22px] text-[#171a1f] dark:text-light tracking-[-0.4px] font-base truncate">
              {tool.name}
            </h3>
          </div>

          {/* Help Icon Link */}
          <Link href={`/tools/${tool.id}`} className="flex-shrink-0" title={`${tool.name}の詳細情報`}>
            <QuestionIcon />
          </Link>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-[6px] items-center overflow-hidden h-[19px]">
          {/* Category (Outlined) */}
          <span className="border border-[#dee1e6] dark:border-midnight-800 text-[10px] font-semibold text-[#565d6d] dark:text-gray-300 rounded-[10px] px-[8px] h-[19px] flex items-center justify-center whitespace-nowrap">
            {tool.category[0]}
          </span>

          {/* Roles (Solid) */}
          {tool.category.slice(1).map((tag) => (
            <span
              key={tag}
              className="bg-[#f3f4f6] dark:bg-midnight-850 text-[10px] font-medium text-[#565d6d] dark:text-gray-300 rounded-[6px] px-[6px] h-[19px] flex items-center justify-center whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal font-base line-clamp-3 mt-[4px]">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="flex flex-col gap-[12px]">
        <button
          onClick={handleLaunch}
          className="flex items-center justify-center gap-[8px] w-full h-[36px] bg-[#5570f6] text-white hover:bg-primary-600 rounded-[6px] font-base font-medium text-[14px] shadow-sm transition-all duration-200"
        >
          <span>ツールを起動</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

