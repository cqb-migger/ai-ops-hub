import React, { useState, useEffect } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { useTranslation } from 'next-i18next';
import { API_BASE } from '../../../../base/utils/api';
import useAuthStore from '../../../../base/stores/useAuthStore';

const ITEMS_PER_PAGE = 16;

export default function CreativeHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const { tools, total, loading, toggleFavorite } = useTools({
    category: 'creative',
    visibility: 'public',
    search: debouncedSearch || undefined,
    role: selectedRole || undefined,
    sort: selectedSort,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });
  const token = useAuthStore((state) => state.token);
  const { t } = useTranslation('common');

  const handleDownloadAll = () => {
    const params = new URLSearchParams();
    params.append('hub', 'creative');
    if (searchQuery) params.append('search', searchQuery);
    if (selectedRole) params.append('role', selectedRole);
    if (token) params.append('token', token);

    const downloadUrl = `${API_BASE}/tools/download-guides?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  };

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedRole, selectedSort]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedCards = tools;

  return (
    <div className="flex flex-col gap-[28px] w-full text-[#171a1f] dark:text-light font-base">
      {/* Page Header */}
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-base font-bold text-[30px] leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light">
          {t('nav.creativeHub')}
        </h1>
        <p className="font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400">
          {t('creative.desc', 'クリエイティブ制作に関する業務ガイド・テンプレート・ナレッジを集約')}
        </p>
      </div>

      <div className="flex flex-col gap-[12px] w-full">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          showSort
          showRoleFilterOnly
        />

        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
            <ItemCount
              currentPage={currentPageSafe}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
            />
            <div className="flex items-center gap-[12px]">
              <button
                onClick={handleDownloadAll}
                className="flex-shrink-0 inline-flex items-center justify-center gap-[8px] h-[40px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 hover:border-[#5570f6] hover:text-[#5570f6] bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-semibold text-[#565d6d] dark:text-gray-400 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{t('compliance.bulkDownload')}</span>
              </button>
            </div>
          </div>
          {loading ? (
            <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
              {t('common.loading')}
            </div>
          ) : paginatedCards.length > 0 ? (
            <div className="flex flex-col gap-[28px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
                {paginatedCards.map((card, idx) => (
                  <ToolCard key={`${card.id}-${idx}`} tool={card} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
              <Pagination
                currentPage={currentPageSafe}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                hideItemCount={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full">
              <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                {t('dashboard.noTools')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('');
                }}
                className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
              >
                {t('dashboard.clearFilter')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
