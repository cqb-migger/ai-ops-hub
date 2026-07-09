import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { useTranslation } from 'next-i18next';
import { API_BASE } from '../../../../base/utils/api';
import useAuthStore from '../../../../base/stores/useAuthStore';

export default function DataHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { tools, loading, toggleFavorite } = useTools({ category: 'data', visibility: 'public' });
  const token = useAuthStore((state) => state.token);
  const { t } = useTranslation('common');

  const handleDownloadAll = () => {
    const params = new URLSearchParams();
    params.append('hub', 'data');
    if (searchQuery) params.append('search', searchQuery);
    if (selectedRole) params.append('role', selectedRole);
    if (token) params.append('token', token);

    const downloadUrl = `${API_BASE}/tools/download-guides?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  };

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRole === '' || tool.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [tools, searchQuery, selectedRole]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const currentPageSafe = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedTools = useMemo(() => {
    const startIdx = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredTools, currentPageSafe]);

  return (
    <div className="flex flex-col gap-[28px] w-full text-[#171a1f] dark:text-light font-base">
      {/* Page Header */}
      <div className="flex flex-col gap-[12px]">
        {/* Title */}
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[30px] leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light">
          {t('nav.dataHub')}
        </h1>

        {/* Description */}
        <p className="font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400 max-w-[767px]">
          {t('data.desc', '各種外部アナリティクスツールへ一元的にアクセスできるポータルです。日々の重要指標（KPI）を効率的に確認し、データドリブンな意思決定をサポートします。')}
        </p>
      </div>

      <div className="flex flex-col gap-[12px] w-full">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          showRoleFilterOnly
        />

        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
            <ItemCount
              currentPage={currentPageSafe}
              totalItems={filteredTools.length}
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
          ) : filteredTools.length > 0 ? (
            <div className="flex flex-col gap-[28px]">
              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
                {paginatedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
              <Pagination
                currentPage={currentPageSafe}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTools.length}
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
