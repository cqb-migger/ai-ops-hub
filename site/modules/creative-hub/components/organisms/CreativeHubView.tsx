import React from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

// -------------------------------------------------------
// Icon Components
// -------------------------------------------------------

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[16px] h-[16px]"
    >
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// -------------------------------------------------------
// Types
// -------------------------------------------------------

interface Tag {
  label: string;
  variant: 'bordered' | 'gray';
}

interface ToolCardData {
  id: string;
  title: string;
  tags: Tag[];
  description: string;
  href?: string;
}

// -------------------------------------------------------
// Mock data — 3 rows × 4 cards
// -------------------------------------------------------

const toolCards: ToolCardData[] = [
  // Row 1
  {
    id: 'chatpro-1',
    title: 'ChatPro Enterprise',
    tags: [
      { label: 'テキスト処理', variant: 'bordered' },
      { label: '全般', variant: 'gray' },
      { label: '画像生成', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '社内データに基づいた高精度な文章生成、要約、翻訳を安全に行えるエンタープライズ向け対話型AI。',
  },
  {
    id: 'designgenius-1',
    title: 'DesignGenius AI',
    tags: [
      { label: '画像生成', variant: 'bordered' },
      { label: 'マーケティング', variant: 'gray' },
      { label: 'デザイン', variant: 'gray' },
    ],
    description:
      'プロンプトから高品質なマーケティング用バナーやSNS向け画像を数秒で生成するクリエイティブツール。',
  },
  {
    id: 'datainsight-1',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  {
    id: 'datainsight-2',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  // Row 2
  {
    id: 'chatpro-2',
    title: 'ChatPro Enterprise',
    tags: [
      { label: 'テキスト処理', variant: 'bordered' },
      { label: '全般', variant: 'gray' },
      { label: '画像生成', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '社内データに基づいた高精度な文章生成、要約、翻訳を安全に行えるエンタープライズ向け対話型AI。',
  },
  {
    id: 'designgenius-2',
    title: 'DesignGenius AI',
    tags: [
      { label: '画像生成', variant: 'bordered' },
      { label: 'マーケティング', variant: 'gray' },
      { label: 'デザイン', variant: 'gray' },
    ],
    description:
      'プロンプトから高品質なマーケティング用バナーやSNS向け画像を数秒で生成するクリエイティブツール。',
  },
  {
    id: 'datainsight-3',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  {
    id: 'datainsight-4',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  // Row 3
  {
    id: 'chatpro-3',
    title: 'ChatPro Enterprise',
    tags: [
      { label: 'テキスト処理', variant: 'bordered' },
      { label: '全般', variant: 'gray' },
      { label: '画像生成', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '社内データに基づいた高精度な文章生成、要約、翻訳を安全に行えるエンタープライズ向け対話型AI。',
  },
  {
    id: 'designgenius-3',
    title: 'DesignGenius AI',
    tags: [
      { label: '画像生成', variant: 'bordered' },
      { label: 'マーケティング', variant: 'gray' },
      { label: 'デザイン', variant: 'gray' },
    ],
    description:
      'プロンプトから高品質なマーケティング用バナーやSNS向け画像を数秒で生成するクリエイティブツール。',
  },
  {
    id: 'datainsight-5',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  {
    id: 'datainsight-6',
    title: 'DataInsight Predictor',
    tags: [
      { label: 'データ分析', variant: 'bordered' },
      { label: 'データサイエンス', variant: 'gray' },
      { label: '経営企画', variant: 'gray' },
      { label: '+1', variant: 'gray' },
    ],
    description:
      '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
];

// -------------------------------------------------------
// Sub-components
// -------------------------------------------------------

function TagBadge({ label, variant }: Tag) {
  if (variant === 'bordered') {
    return (
      <span className="inline-flex items-center h-[19px] px-[10px] rounded-[10px] border border-[#dee1e6] text-[10px] font-[600] leading-[13px] text-[#565d6d] whitespace-nowrap">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center h-[19px] px-[6px] rounded-[6px] bg-[#f3f4f6] text-[10px] font-[500] leading-[15px] text-[#565d6d] whitespace-nowrap">
      {label}
    </span>
  );
}

function ToolCard({ card }: { card: ToolCardData }) {
  const handleLaunch = () => {
    if (card.href) {
      window.open(card.href, '_blank', 'noopener,noreferrer');
    } else {
      toast.success(`${card.title}を起動しています...`, { duration: 2000 });
    }
  };

  return (
    <article className="flex flex-col bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-700 rounded-[16px] shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07),0px_0px_2px_0px_rgba(23,26,31,0.08)] overflow-hidden w-[254px] flex-shrink-0">
      {/* Card header */}
      <div className="px-[20px] pt-[10px]">
        {/* Title */}
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] leading-[28px] tracking-[-0.45px] text-[#171a1f] dark:text-light whitespace-nowrap mb-[8px]">
          {card.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-[4px]">
          {card.tags.map((tag, i) => (
            <TagBadge key={i} {...tag} />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 px-[20px] pt-[12px] pb-[0px]">
        <p className="font-normal text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 line-clamp-4">
          {card.description}
        </p>
      </div>

      {/* Divider + CTA */}
      <div className="px-[20px] pb-[20px] pt-[16px]">
        <div className="border-t border-[#dee1e6] dark:border-midnight-700 mb-[17px]" />
        <button
          onClick={handleLaunch}
          className="flex items-center justify-center gap-[8px] w-full h-[36px] bg-[#5570f6] hover:bg-[#4460e5] active:bg-[#3350d5] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] text-white text-[14px] font-[500] leading-[22px] transition-colors duration-200 cursor-pointer"
        >
          ツールを起動
          <ArrowRightIcon />
        </button>
      </div>
    </article>
  );
}

// -------------------------------------------------------
// Main view
// -------------------------------------------------------

export default function CreativeHubView() {
  return (
    <section className="px-[32px] py-[24px]">
      {/* Page Header */}
      <div className="mb-[28px]">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[30px] leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light mb-[8px]">
          クリエイティブハブ
        </h1>
        <p className="font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400">
          クリエイティブ制作に関する業務ガイド・テンプレート・ナレッジを集約
        </p>
      </div>

      {/* Tool Cards Grid */}
      <div className="flex flex-wrap gap-[24px]">
        {toolCards.map((card) => (
          <ToolCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
