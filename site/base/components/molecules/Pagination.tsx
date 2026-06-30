import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const currentPageSafe = Math.min(currentPage, Math.max(1, totalPages));

  return (
    <div className="flex items-center justify-center gap-[8px] mt-[12px] font-base">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPageSafe - 1))}
        disabled={currentPageSafe === 1}
        className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] border transition-colors ${
          currentPageSafe === 1
            ? 'border-[#dee1e6] text-[#bcc1ca] dark:border-midnight-800 dark:text-gray-600 cursor-not-allowed'
            : 'border-[#dee1e6] hover:bg-[#fafafb] text-[#565d6d] dark:border-midnight-800 dark:hover:bg-midnight-900 dark:text-light'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-[14px] font-semibold transition-colors ${
            currentPageSafe === page
              ? 'bg-[#5570f6] text-white border border-[#5570f6]'
              : 'border border-[#dee1e6] hover:bg-[#fafafb] text-[#565d6d] dark:border-midnight-800 dark:hover:bg-midnight-900 dark:text-light'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPageSafe + 1))}
        disabled={currentPageSafe === totalPages}
        className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] border transition-colors ${
          currentPageSafe === totalPages
            ? 'border-[#dee1e6] text-[#bcc1ca] dark:border-midnight-800 dark:text-gray-600 cursor-not-allowed'
            : 'border-[#dee1e6] hover:bg-[#fafafb] text-[#565d6d] dark:border-midnight-800 dark:hover:bg-midnight-900 dark:text-light'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
