import React from 'react';
import CategoryDropdown from './CategoryDropdown';
import RoleDropdown from './RoleDropdown';
import StepDropdown from './StepDropdown';
import SortDropdown from './SortDropdown';
import { Step } from '../../../../base/types/steps';
import { useTranslation } from 'next-i18next';
import useAuthStore from '@base/stores/useAuthStore';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (val: string) => void;
  selectedRole?: string;
  onRoleChange?: (val: string) => void;
  selectedStep?: string;
  onStepChange?: (val: string) => void;
  selectedSort?: string;
  onSortChange?: (val: string) => void;
  /** Show the sort dropdown */
  showSort?: boolean;
  categories?: string[];
  roles?: string[];
  steps?: Step[];
  showFilters?: boolean;
  /** Show only the role dropdown (used in user management page) */
  showRoleFilterOnly?: boolean;
  /** Show both category and role dropdowns simultaneously */
  showBothFilters?: boolean;
  /** Show step filter (used in compliance hub) */
  showStepFilter?: boolean;
  placeholder?: string;
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#565d6d] dark:text-gray-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory = '',
  onCategoryChange = () => { },
  selectedRole = '',
  onRoleChange = () => { },
  selectedStep = '',
  onStepChange = () => { },
  selectedSort = 'name_asc',
  onSortChange = () => { },
  showSort = false,
  categories,
  steps = [],
  showFilters = true,
  showRoleFilterOnly = false,
  showBothFilters = false,
  showStepFilter = false,
  placeholder = 'ツール名、キーワードで検索...',
}: FilterBarProps) {
  const { t } = useTranslation('common');
  const actualPlaceholder = (placeholder === 'ツール名、キーワードで検索...' ? t('dashboard.searchPlaceholder', 'ツール名、キーワードで検索...') : placeholder) as string;
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <div className="w-full sm:h-[74px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)] p-[16px] sm:py-0 flex flex-col sm:flex-row sm:items-center gap-[12px]">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1 h-[40px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] px-[12px] flex items-center gap-[8px]">
        <SearchIcon />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={actualPlaceholder}
          className="w-full bg-transparent border-none outline-none text-[14px] leading-[22px] text-[#171a1f] dark:text-light placeholder-[#565d6d] dark:placeholder-gray-500 font-base"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="flex items-center justify-center text-[#9095a0] hover:text-[#171a1f] dark:text-gray-500 dark:hover:text-white transition-colors flex-shrink-0"
            title="Clear search"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>

      {/* Both category + role dropdowns */}
      {showBothFilters && (
        <>
          <CategoryDropdown
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            categories={categories}
            width={200}
            placeholder={t('filter.allCategories') as string}
          />
          {isAdmin && (
            <RoleDropdown
              selectedRole={selectedRole}
              onRoleChange={onRoleChange}
              width={200}
              placeholder={t('filter.allRoles') as string}
            />
          )}
          {showSort && (
            <SortDropdown selectedSort={selectedSort} onSortChange={onSortChange} width={180} />
          )}
        </>
      )}

      {/* Category only */}
      {showFilters && !showRoleFilterOnly && !showBothFilters && !showStepFilter && (
        <CategoryDropdown
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          categories={categories}
          width={250}
          placeholder={t('filter.allCategories') as string}
        />
      )}

      {/* Role only */}
      {showFilters && showRoleFilterOnly && !showStepFilter && (
        <>
          {isAdmin && (
            <RoleDropdown
              selectedRole={selectedRole}
              onRoleChange={onRoleChange}
              width={250}
              placeholder={t('filter.allRoles') as string}
            />
          )}
          {showSort && (
            <SortDropdown selectedSort={selectedSort} onSortChange={onSortChange} width={180} />
          )}
        </>
      )}

      {/* Step + Role (for Compliance Hub) */}
      {showStepFilter && (
        <>
          <StepDropdown
            selectedStep={selectedStep}
            onStepChange={onStepChange}
            steps={steps}
            width={180}
            placeholder={t('filter.allSteps') as string}
          />
          {isAdmin && (
            <RoleDropdown
              selectedRole={selectedRole}
              onRoleChange={onRoleChange}
              width={180}
              placeholder={t('filter.allRoles') as string}
            />
          )}
          {showSort && (
            <SortDropdown selectedSort={selectedSort} onSortChange={onSortChange} width={180} />
          )}
        </>
      )}
    </div>
  );
}
