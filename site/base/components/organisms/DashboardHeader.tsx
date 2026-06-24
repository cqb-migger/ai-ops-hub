import React from 'react';
import ThemeButton from '../molecules/Button/ThemeButton';

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[64px] bg-white dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800 px-[32px]">
      {/* Search bar */}
      <div className="relative flex items-center w-[447px] h-[35px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] px-[12px] gap-[8px]">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search tools, guides, templates..."
          className="w-full bg-transparent border-none outline-none text-[14px] leading-[22px] text-[#171a1f] dark:text-light placeholder-[#565d6d] dark:placeholder-gray-500 font-base"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-[16px]">
        {/* Dark Mode toggle */}
        <ThemeButton />

        {/* Separator Line */}
        <div className="w-0 h-[24px] border-r border-[#dee1e6] dark:border-midnight-800" />

        {/* Avatar */}
        <div className="relative flex items-center justify-center w-[32px] h-[32px] rounded-full overflow-hidden bg-[#fce4e7] dark:bg-[#4a2e35] cursor-pointer">
          {/* Fallback avatar if local server asset is offline */}
          <img
            src="http://localhost:3845/assets/709c4e40e160703b4d5465c009c441b8854bf5d0.png"
            alt="User Avatar"
            onError={(e) => {
              // Replace with SVG fallback representation
              e.currentTarget.style.display = 'none';
              const sibling = e.currentTarget.nextElementSibling as HTMLElement;
              if (sibling) sibling.style.display = 'flex';
            }}
            className="w-full h-full object-cover"
          />
          <div className="hidden absolute inset-0 items-center justify-center text-[12px] font-bold text-[#b3261e] dark:text-red-300 font-base select-none">
            AN
          </div>
        </div>
      </div>
    </header>
  );
}
