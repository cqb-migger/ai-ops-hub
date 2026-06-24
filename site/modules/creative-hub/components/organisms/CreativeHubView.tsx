import React, { useState, useMemo } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import toolsData from '@base/data/tools.json';
import { Tool } from '../../../dashboard/constants/tools';

const creativeTools = (toolsData as unknown as Tool[]).filter(t => t.hubs.includes("creative"));
const toolCards = [...creativeTools, ...creativeTools, ...creativeTools];

export default function CreativeHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリ');
  const [selectedRole, setSelectedRole] = useState('すべての役割');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    toolCards.forEach((c) => {
      if (c.category[0]) cats.add(c.category[0]);
    });
    return ['すべてのカテゴリ', ...Array.from(cats)];
  }, []);

  const roles = useMemo(() => {
    const rls = new Set<string>();
    toolCards.forEach((c) => {
      c.category.slice(1).forEach((r) => rls.add(r));
    });
    return ['すべての役割', ...Array.from(rls)];
  }, []);

  const filteredCards = useMemo(() => {
    return toolCards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'すべてのカテゴリ' || card.category[0] === selectedCategory;

      const matchesRole =
        selectedRole === 'すべての役割' || card.category.slice(1).includes(selectedRole);

      return matchesSearch && matchesCategory && matchesRole;
    });
  }, [searchQuery, selectedCategory, selectedRole]);

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
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        categories={categories}
        roles={roles}
      />

      {/* Tool Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[24px]">
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
              setSelectedCategory('すべてのカテゴリ');
              setSelectedRole('すべての役割');
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
