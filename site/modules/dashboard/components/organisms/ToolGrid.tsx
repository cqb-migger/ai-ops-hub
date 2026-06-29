import React, { useState, useMemo } from 'react';
import FilterBar from '../molecules/FilterBar';
import ToolCard from '../molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリ');

  const { tools, loading } = useTools();

  // Filter tools logic
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'すべてのカテゴリ' || tool.category.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title block */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
          AIツールダッシュボード
        </h2>
        <p className="text-[18px] font-normal leading-[28px] text-[#565d6d] dark:text-gray-400 font-base">
          業務を効率化するための最適なAIツールを検索・発見できます。役割やカテゴリから絞り込みましょう。
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Grid count header */}
      <div className="flex items-center gap-[8px] mt-[12px]">
        <SparklesIcon />
        <h3 className="text-[20px] font-semibold leading-[30px] text-[#171a1f] dark:text-light font-base">
          利用可能なツール ({filteredTools.length})
        </h3>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
          読み込み中...
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            条件に一致するツールが見つかりませんでした。
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('すべてのカテゴリ');
            }}
            className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
          >
            フィルターをクリア
          </button>
        </div>
      )}
    </div>
  );
}
