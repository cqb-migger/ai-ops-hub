import React, { useState, useMemo } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';

export default function CreativeHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const { tools, loading } = useTools({ category: 'creative' });

  const filteredCards = useMemo(() => {
    return tools.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });
  }, [tools, searchQuery]);

  return (
    <div className="flex flex-col gap-[28px] w-full text-[#171a1f] dark:text-light font-base">
      {/* Page Header */}
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[30px] leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light">
          クリエイティブハブ
        </h1>
        <p className="font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400">
          クリエイティブ制作に関する業務ガイド・テンプレート・ナレッジを集約
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={false}
      />

      {/* Tool Cards Grid */}
      {loading ? (
        <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base">
          読み込み中...
        </div>
      ) : filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
          {filteredCards.map((card, idx) => (
            <ToolCard key={`${card.id}-${idx}`} tool={card} />
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
