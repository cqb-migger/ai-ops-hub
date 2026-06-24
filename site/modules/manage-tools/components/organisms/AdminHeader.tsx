import React from 'react';
import Link from 'next/link';
import ThemeButton from '@base/components/molecules/Button/ThemeButton';

function HouseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[14px] h-[14px] text-[#9095a0] dark:text-gray-500"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[20px] h-[20px] text-[#5570f6]"
    >
      <path d="m19 2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path d="m19 16 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path d="M15 8.5 4 19.5 2.5 21 1.5 20 3 18.5 14 7.5z" />
      <path d="m8.5 5 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
    </svg>
  );
}

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[65px] bg-white dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800 px-[32px]">
      {/* Left side brand logo & breadcrumbs */}
      <div className="flex items-center gap-[24px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-[8px]">
          <WandIcon />
          <span className="font-['Inter'] font-bold text-[18px] leading-[28px] text-[#5570f6] dark:text-[#7c91eb]">
            PromptDash Admin
          </span>
        </Link>

        {/* Separator line */}
        <div className="w-0 h-[24px] border-r border-[#dee1e6] dark:border-midnight-800" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-[8px] text-[14px] leading-[20px]">
          <Link href="/" className="flex items-center gap-[4px] text-[#565d6d] dark:text-gray-400 hover:text-[#5570f6] dark:hover:text-primary-300 transition-colors">
            <HouseIcon />
            <span className="font-['Inter'] font-normal">ホーム</span>
          </Link>
          <ChevronRightIcon />
          <Link href="/manage-tools" className="font-['Inter'] font-normal text-[#565d6d] dark:text-gray-400 hover:text-[#5570f6] dark:hover:text-primary-300 transition-colors">
            ツール管理
          </Link>
          <ChevronRightIcon />
          <span className="font-['Inter'] font-medium text-[#171a1f] dark:text-light">
            新規ツール作成
          </span>
        </nav>
      </div>

      {/* Right side controls (Theme switch, avatar) */}
      <div className="flex items-center gap-[16px]">
        <ThemeButton />
        
        {/* Separator line */}
        <div className="w-0 h-[24px] border-r border-[#dee1e6] dark:border-midnight-800" />

        {/* User initials avatar */}
        <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#e9ecfc] dark:bg-[#1d3fbc] text-[#5570f6] dark:text-light font-['Inter'] font-bold text-[14px]">
          AD
        </div>
      </div>
    </header>
  );
}
