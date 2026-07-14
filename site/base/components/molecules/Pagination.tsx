import React from 'react';
import { useTranslation } from 'next-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
  hideItemCount?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, className = 'mt-[20px]', hideItemCount = false }: PaginationProps) {
  const { t } = useTranslation('common');
  const currentPageSafe = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  
  const showPaginationControls = totalPages >= 1;
  const showItemCount = !hideItemCount && totalItems !== undefined && itemsPerPage !== undefined;

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showPaginationControls && !showItemCount) return null;

  const startItem = (currentPageSafe - 1) * (itemsPerPage || 1) + 1;
  const endItem = Math.min(currentPageSafe * (itemsPerPage || 1), totalItems || 0);

  return (
    <div className={`flex items-center ${hideItemCount ? 'justify-center' : 'justify-between'} w-full font-base ${className}`}>
      {!hideItemCount && (
        <div className="text-[14px] text-[#565d6d] dark:text-gray-400 font-medium">
          {showItemCount && totalItems !== undefined && totalItems > 0 && (
            <>{t('common.showingItems', { total: totalItems, start: startItem, end: endItem })}</>
          )}
          {showItemCount && totalItems === 0 && (
            <>{t('common.showingNoItems')}</>
          )}
        </div>
      )}

      {showPaginationControls ? (
        <div className="flex items-center gap-[8px]">
          {/* Previous Page Button */}
      <button
        onClick={() => handlePageChange(Math.max(1, currentPageSafe - 1))}
        disabled={currentPageSafe === 1}
        className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] border transition-colors ${
          currentPageSafe === 1
            ? 'border-[#dee1e6] text-[#bcc1ca] dark:border-midnight-800 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-midnight-900'
            : 'border-[#dee1e6] bg-white hover:bg-[#fafafb] text-[#565d6d] dark:border-midnight-800 dark:bg-midnight-900 dark:hover:bg-midnight-800 dark:text-light'
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
          onClick={() => handlePageChange(page)}
          className={`group relative overflow-hidden w-[36px] h-[36px] flex items-center justify-center rounded-[8px] text-[14px] font-semibold transition-all duration-200 ${
            currentPageSafe === page
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white border border-[#dee1e6] text-[#565d6d] hover:text-white hover:border-transparent dark:border-midnight-800 dark:bg-midnight-900 dark:text-light'
          }`}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-200 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] ${
              currentPageSafe === page ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
          <span className="relative z-10">{page}</span>
        </button>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => handlePageChange(Math.min(totalPages, currentPageSafe + 1))}
        disabled={currentPageSafe === totalPages}
        className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] border transition-colors ${
          currentPageSafe === totalPages
            ? 'border-[#dee1e6] text-[#bcc1ca] dark:border-midnight-800 dark:text-gray-600 cursor-not-allowed bg-white dark:bg-midnight-900'
            : 'border-[#dee1e6] bg-white hover:bg-[#fafafb] text-[#565d6d] dark:border-midnight-800 dark:bg-midnight-900 dark:hover:bg-midnight-800 dark:text-light'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
