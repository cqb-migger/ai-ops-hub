import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import { useCategories, categoryDisplayName } from '../../../../base/hooks/useCategories';
import { useSteps } from '../../../../base/hooks/useSteps';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import ReviewFlowSection from './ReviewFlowSection';
import DownloadToolsDropdown from '../../../../base/components/molecules/DownloadToolsDropdown';
import { useTranslation } from 'next-i18next';
import useAuthStore from '../../../../base/stores/useAuthStore';

const ITEMS_PER_PAGE = 16;

interface CategoryHubViewProps {
  slug: string;
}

export default function CategoryHubView({ slug }: CategoryHubViewProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const isAdmin = useAuthStore((state) => state.user?.role?.toLowerCase() === 'admin');
  const { categories, loading: categoriesLoading } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStep, setSelectedStep] = useState('');
  const [selectedSort, setSelectedSort] = useState('favorite');
  const [currentPage, setCurrentPage] = useState(1);

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug]
  );
  const categoryId = category?.id;
  const title = category ? categoryDisplayName(category, router.locale) : '';
  const hasStepFlow = !!category?.has_step_flow;

  // 5) Fetch steps if this category has the Review Flow enabled
  const { steps, saveSteps, loading: stepsLoading } = useSteps({
    enabled: Boolean(category?.has_step_flow),
    categoryId: category?.id,
  });

  const { tools, total, loading, toggleFavorite } = useTools({
    visibility: 'public',
    categoryId,
    search: debouncedSearch || undefined,
    role: selectedRole || undefined,
    stepId: (hasStepFlow && selectedStep) ? selectedStep : undefined,
    sort: selectedSort,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    enabled: categoryId != null,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedRole, selectedStep, selectedSort, slug]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const hasFilters = Boolean(debouncedSearch || selectedRole || selectedStep);

  // Category list is loaded but this slug does not resolve → not found.
  if (!categoriesLoading && !category) {
    return (
      <div className="flex flex-col items-center justify-center p-[48px] text-center w-full min-h-[300px]">
        <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
          {t('hub.notFound', 'カテゴリが見つかりませんでした。')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[28px] w-full text-[#171a1f] dark:text-light font-base">
      {/* Header */}
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-base font-bold text-[22px] sm:text-[30px] leading-[30px] sm:leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light">
          {title || t('common.loading', '読み込み中...')}
        </h1>
        {slug === 'creative' && (
          <p className="hidden md:block font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400">
            {t('creative.desc', 'クリエイティブ制作に関する業務ガイド・テンプレート・ナレッジを集約')}
          </p>
        )}
        {slug === 'compliance' && (
          <p className="hidden md:block text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal w-full">
            {t('compliance.flowDescHelp', '薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した safeコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツ は 以下のステップに従って確認を行ってください。')}
          </p>
        )}
        {slug === 'data' && (
          <p className="hidden md:block font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400 max-w-[767px]">
            {t('data.desc', '各種外部アナリティクスツールへ一元的にアクセスできるポータルです。日々の重要指標（KPI）を効率的に確認し、データドリブンな意思決定をサポートします。')}
          </p>
        )}
      </div>

      {/* Optional Review Flow Section (for categories with has_step_flow=true) */}
      {hasStepFlow && (
        <ReviewFlowSection
          steps={steps}
          saveSteps={saveSteps}
          stepsLoading={stepsLoading}
          isAdmin={isAdmin}
        />
      )}

      <div className="flex flex-col gap-[12px] w-full">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedStep={hasStepFlow ? selectedStep : undefined}
          onStepChange={hasStepFlow ? setSelectedStep : undefined}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          showSort
          showRoleFilterOnly={!hasStepFlow}
          steps={hasStepFlow ? steps : undefined}
          showStepFilter={hasStepFlow}
        />

        <div className="flex flex-col gap-[12px] w-full">
          <div className="flex flex-row items-center justify-between gap-[12px] w-full">
            <ItemCount
              currentPage={currentPageSafe}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
            />
            <DownloadToolsDropdown tools={tools} />
          </div>

          {loading || categoriesLoading ? (
            <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
              {t('common.loading')}
            </div>
          ) : tools.length > 0 ? (
            <div className="flex flex-col gap-[16px] sm:gap-[28px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} onToggleFavorite={toggleFavorite} />
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
                {hasFilters ? t('dashboard.noTools') : t('dashboard.noToolsAccount')}
              </p>
              {hasFilters && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('');
                    setSelectedStep('');
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
    </div>
  );
}
