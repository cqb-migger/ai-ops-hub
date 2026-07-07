import React from 'react';

interface ItemCountProps {
  currentPage: number;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export default function ItemCount({ currentPage, totalItems, itemsPerPage, className = '' }: ItemCountProps) {
  if (totalItems === undefined || itemsPerPage === undefined) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPageSafe = Math.max(1, Math.min(currentPage, totalPages));
  
  const startItem = (currentPageSafe - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPageSafe * itemsPerPage, totalItems);

  return (
    <div className={`text-[14px] text-[#565d6d] dark:text-gray-400 font-medium ${className}`}>
      {totalItems > 0 ? (
        <>全 {totalItems} 件中 {startItem} - {endItem} 件を表示</>
      ) : (
        <>全 0 件中 0 件を表示</>
      )}
    </div>
  );
}
