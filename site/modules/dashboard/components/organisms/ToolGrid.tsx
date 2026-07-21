import React, { useState, useMemo, useEffect } from 'react';
import FilterBar from '../molecules/FilterBar';
import ToolCard from '../molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import { useCategories } from '../../../../base/hooks/useCategories';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { useTranslation } from 'next-i18next';

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6]">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    </svg>
  );
}

export default function ToolGrid() {
  const ITEMS_PER_PAGE = 16;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation('common');

  const { categories } = useCategories();

  // Category options (names) for the dropdown, from the full category list
  const uniqueCategories = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  // Map selected category name -> id for the API filter
  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined;
    return categories.find((c) => c.name === selectedCategory)?.id;
  }, [categories, selectedCategory]);

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedRole, selectedSort]);

  const { tools, total, loading, toggleFavorite } = useTools({
    visibility: 'public',
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryId,
    role: selectedRole || undefined,
    sort: selectedSort,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedTools = tools;

  const hasFilters = Boolean(debouncedSearch || selectedCategory || selectedRole);

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title block */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
          {t('dashboard.title', 'AIツールダッシュボード')}
        </h2>
        <p className="text-[18px] font-normal leading-[28px] text-[#565d6d] dark:text-gray-400 font-base">
          {t('dashboard.desc', '業務を効率化するための最適なAIツールを検索・発見できます。役割やカテゴリから絞り込みましょう。')}
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        showSort
        categories={uniqueCategories}
        showBothFilters
      />

      {/* Grid count header and tools list */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <SparklesIcon />
          <h3 className="text-[20px] font-semibold leading-[30px] text-[#171a1f] dark:text-light font-base">
            {t('dashboard.availableTools', '利用可能なツール')}
          </h3>
        </div>
        <div className="flex items-center justify-between w-full">
          <ItemCount
            currentPage={currentPageSafe}
            totalItems={total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
            {t('common.loading')}
          </div>
        ) : paginatedTools.length > 0 ? (
          <div className="flex flex-col gap-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
              {paginatedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onToggleFavorite={toggleFavorite} />
              ))}
            </div>

            <Pagination
              currentPage={currentPageSafe}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              hideItemCount={true}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full">
            <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
              {hasFilters ? t('dashboard.noTools') : t('dashboard.noToolsAccount')}
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedRole('');
                }}
                className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
              >
                {t('dashboard.clearFilter')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
