import React from 'react';
import { CATEGORIES, ROLES } from '../../constants/tools';
import Combobox from '@base/components/molecules/Combobox';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedRole: string;
  onRoleChange: (val: string) => void;
  categories?: string[];
  roles?: string[];
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#565d6d] dark:text-gray-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedRole,
  onRoleChange,
  categories,
  roles,
}: FilterBarProps) {
  const categoriesList = categories || CATEGORIES;
  const rolesList = roles || ROLES;

  return (
    <div className="w-full max-w-[1088px] h-[74px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)] px-[16px] flex items-center gap-[16px]">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-[638px] h-[40px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] px-[12px] flex items-center gap-[8px]">
        <SearchIcon />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ツール名、キーワードで検索..."
          className="w-full bg-transparent border-none outline-none text-[14px] leading-[22px] text-[#171a1f] dark:text-light placeholder-[#565d6d] dark:placeholder-gray-500 font-base"
        />
      </div>

      {/* Category Dropdown */}
      <Combobox
        value={selectedCategory}
        onChange={onCategoryChange}
        options={categoriesList}
      />

      {/* Role Dropdown */}
      <Combobox
        value={selectedRole}
        onChange={onRoleChange}
        options={rolesList}
      />
    </div>
  );
}
