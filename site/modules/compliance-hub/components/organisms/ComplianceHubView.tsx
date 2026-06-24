import React, { useState, useMemo } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import toolsData from '@base/data/tools.json';
import { Tool } from '../../../dashboard/constants/tools';

// SVG Icons for the Step Diagram
function PenToolIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="m12 22 1-1c1.4-1.4 2.3-3.2 2.7-5.2l.3-1.8H12v-4h4.8l.3-1.8c.4-2 1.3-3.8 2.7-5.2l1-1" />
      <path d="m18 14-4-4" />
      <path d="M4 22h14" />
      <path d="M7 17a5 5 0 0 0 5-5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] text-[#5570f6] dark:text-[#7c91eb]">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] text-[#5570f6] dark:text-[#7c91eb]">
      <line x1="9" x2="15" y1="22" y2="22" />
      <line x1="12" x2="12" y1="2" y2="22" />
      <line x1="12" x2="3" y1="7" y2="12" />
      <line x1="12" x2="21" y1="7" y2="12" />
      <path d="M3 12c0 2.2 4 4 4 4s4-1.8 4-4" />
      <path d="M13 12c0 2.2 4 4 4 4s4-1.8 4-4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[28px] h-[28px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const complianceTools = (toolsData as unknown as Tool[]).filter(t => t.hubs.includes("compliance"));
const GRID_RESOURCES = [...complianceTools, ...complianceTools];

export default function ComplianceHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべてのカテゴリ');
  const [selectedRole, setSelectedRole] = useState('すべての役割');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    GRID_RESOURCES.forEach((r) => {
      if (r.category[0]) cats.add(r.category[0]);
    });
    return ['すべてのカテゴリ', ...Array.from(cats)];
  }, []);

  const roles = useMemo(() => {
    const rls = new Set<string>();
    GRID_RESOURCES.forEach((r) => {
      r.category.slice(1).forEach((role) => rls.add(role));
    });
    return ['すべての役割', ...Array.from(rls)];
  }, []);

  const filteredResources = useMemo(() => {
    return GRID_RESOURCES.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'すべてのカテゴリ' || resource.category[0] === selectedCategory;

      const matchesRole =
        selectedRole === 'すべての役割' || resource.category.slice(1).includes(selectedRole);

      return matchesSearch && matchesCategory && matchesRole;
    });
  }, [searchQuery, selectedCategory, selectedRole]);

  return (
    <div className="flex flex-col gap-[36px] w-full text-[#171a1f] dark:text-light font-base">
      
      {/* Category Pill Badge & Header title */}
      <div className="flex flex-col items-start gap-[12px]">
        {/* Title & description */}
        <h2 className="text-[36px] font-extrabold leading-[40px] text-[#171a1f] dark:text-light tracking-[-0.9px] font-base">
          法務・規制チェック プロセス
        </h2>
        <p className="text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal max-w-[893px]">
          薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した安全なコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツ is 以下のステップに従って確認を行ってください。
        </p>
      </div>

      {/* Section 1: Review Flow */}
      <section className="flex flex-col gap-[20px] mt-[12px]">
        <div>
          <h3 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
            標準レビューフロー
          </h3>
          <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
            コンテンツ作成から公開までの必須手順
          </p>
        </div>

        {/* 4-Step Diagram */}
        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-[32px] md:gap-[16px] w-full px-[16px] py-[24px] mt-[16px] isolate">
          {/* Connector line running behind circles */}
          <div className="hidden md:block absolute top-[56px] left-[12%] right-[12%] h-[2px] bg-[#dee1e6] dark:bg-midnight-800 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10">
              <PenToolIcon />
            </div>
            <span className="mt-[16px] text-[12px] font-bold tracking-[0.6px] uppercase text-[#565d6d] dark:text-gray-400">
              Step 1
            </span>
            <span className="mt-[4px] text-[14px] font-bold text-[#171a1f] dark:text-light">
              コンテンツの作成
            </span>
            <p className="mt-[8px] text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal">
              ブランドガイドラインに従い、初期原稿やクリエイティブを作成します。
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10">
              <SearchIcon />
            </div>
            <span className="mt-[16px] text-[12px] font-bold tracking-[0.6px] uppercase text-[#565d6d] dark:text-gray-400">
              Step 2
            </span>
            <span className="mt-[4px] text-[14px] font-bold text-[#171a1f] dark:text-light">
              AI事前チェック
            </span>
            <p className="mt-[8px] text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal">
              専用のNotebookLMを用いて、薬機法・景表法のリスクを自己点検します。
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10">
              <ScaleIcon />
            </div>
            <span className="mt-[16px] text-[12px] font-bold tracking-[0.6px] uppercase text-[#565d6d] dark:text-gray-400">
              Step 3
            </span>
            <span className="mt-[4px] text-[14px] font-bold text-[#171a1f] dark:text-light">
              法務部門レビュー
            </span>
            <p className="mt-[8px] text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal">
              AIチェック済みの原稿と判定結果を添えて、法務部門へ申請します。
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10">
              <CheckCircleIcon />
            </div>
            <span className="mt-[16px] text-[12px] font-bold tracking-[0.6px] uppercase text-[#565d6d] dark:text-gray-400">
              Step 4
            </span>
            <span className="mt-[4px] text-[14px] font-bold text-[#171a1f] dark:text-light">
              承認と公開
            </span>
            <p className="mt-[8px] text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal">
              法務の最終承認（証跡）を得た後、コンテンツを公開できます。
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Tools & References */}
      <section className="flex flex-col gap-[20px] mt-[12px]">
        <div>
          <h3 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
            ツール & リファレンス
          </h3>
          <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
            チェック業務に必要なシステムや文書へのリンク
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

        {/* Cards Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[12px]">
            {filteredResources.map((resource, index) => (
              <ToolCard key={`${resource.id}-${index}`} tool={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full mt-[12px]">
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
      </section>
    </div>
  );
}
