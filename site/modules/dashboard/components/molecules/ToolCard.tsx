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

const TOOL_ICONS: Record<string, string> = {
  'ChatGPT (GPT-4o)': 'http://localhost:3845/assets/ec99497976a9731d061ae187fabe013b28e763e9.png',
  'ChatPro Enterprise': 'http://localhost:3845/assets/48bb8541d7c0769e311742688649f4c8bd0e0b29.png',
  'DesignGenius AI': 'http://localhost:3845/assets/efb4c35a8fdab57789ecd52490543dadb4a3a3c0.png',
  'CodeAssistant Pro': 'http://localhost:3845/assets/efb4c35a8fdab57789ecd52490543dadb4a3a3c0.png',
  'Midjourney': 'http://localhost:3845/assets/3cbb79e7bb9709e7da467c53d555258f2fa56af6.png',
};

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M12 22C17.52 22 22 17.52 22 12S17.52 2 12 2 2 6.48 2 12c0 2.76 2.24 5 5 5h4v5h1z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'コーディング':
      return <CodeIcon />;
    case 'データ分析':
      return <ChartIcon />;
    case 'コンプライアンス':
      return <ShieldIcon />;
    case '画像生成':
      return <PaletteIcon />;
    default:
      return <MessageIcon />;
  }
};

const getCategoryIconBg = (category: string) => {
  switch (category) {
    case 'コーディング':
      return 'bg-[#eff6ff] text-[#1e40af] dark:bg-[#1e3a8a]/40 dark:text-[#93c5fd] border border-[#dbeafe] dark:border-midnight-800';
    case 'データ分析':
      return 'bg-[#ecfdf5] text-[#065f46] dark:bg-[#064e3b]/40 dark:text-[#a7f3d0] border border-[#d1fae5] dark:border-midnight-800';
    case 'コンプライアンス':
      return 'bg-[#fef2f2] text-[#991b1b] dark:bg-[#7f1d1d]/40 dark:text-[#fca5a5] border border-[#fee2e2] dark:border-midnight-800';
    case '画像生成':
      return 'bg-[#faf5ff] text-[#6b21a8] dark:bg-[#581c87]/40 dark:text-[#e9d5ff] border border-[#f3e8ff] dark:border-midnight-800';
    default:
      return 'bg-[#fff7ed] text-[#9a3412] dark:bg-[#7c2d12]/40 dark:text-[#ffedd5] border border-[#ffedd5] dark:border-midnight-800';
  }
};

function QuestionIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] text-[#9095a0] dark:text-gray-500 hover:text-[#5570f6] dark:hover:text-primary-400 transition-colors">
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
            <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full overflow-hidden flex items-center justify-center">
              {TOOL_ICONS[tool.name] ? (
                <img
                  src={TOOL_ICONS[tool.name]}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center rounded-full ${getCategoryIconBg(tool.category[0])}`}>
                  {getCategoryIcon(tool.category[0])}
                </div>
              )}
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
        <div className="border-t border-[#dee1e6] dark:border-midnight-800 w-full" />
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
