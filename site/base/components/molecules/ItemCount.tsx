import React from 'react';
import { useTranslation } from 'next-i18next';

interface ItemCountProps {
  currentPage: number;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export default function ItemCount({ currentPage, totalItems, itemsPerPage, className = '' }: ItemCountProps) {
  const { t } = useTranslation('common');

  if (totalItems === undefined || itemsPerPage === undefined) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPageSafe = Math.max(1, Math.min(currentPage, totalPages));
  
  const startItem = (currentPageSafe - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPageSafe * itemsPerPage, totalItems);

  return (
    <div className={`text-[14px] text-[#565d6d] dark:text-gray-400 font-medium ${className}`}>
      {totalItems > 0 ? (
        <>{t('common.showingItems', { total: totalItems, start: startItem, end: endItem })}</>
      ) : (
        <>{t('common.showingNoItems')}</>
      )}
    </div>
  );
}
