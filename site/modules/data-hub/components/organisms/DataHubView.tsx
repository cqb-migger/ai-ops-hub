import React from 'react';
import toast from 'react-hot-toast';

// -------------------------------------------------------
// Icon Components
// -------------------------------------------------------

function ActivityIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[16px] h-[16px] text-[#5570f6]"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

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

interface TagProps {
  label: string;
  variant?: 'primary' | 'gray';
}

interface AnalyticsToolCardProps {
  title: string;
  description: string;
  primaryTag: string;
  secondaryTags: string[];
  url?: string;
}

// -------------------------------------------------------
// Sub-components
// -------------------------------------------------------

function Tag({ label, variant = 'gray' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center h-[20px] px-[9px] rounded-[10px] text-[12px] font-[600] leading-[16px] whitespace-nowrap ${
        variant === 'primary'
          ? 'border border-[#dee1e6] text-[#565d6d]'
          : 'bg-[#f3f4f6] text-[#1e2128]'
      }`}
    >
      {label}
    </span>
  );
}

function AnalyticsToolCard({
  title,
  description,
  primaryTag,
  secondaryTags,
  url,
}: AnalyticsToolCardProps) {
  const handleLaunch = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.success(`${title}を起動しています...`, { duration: 2000 });
    }
  };

  return (
    <article className="flex flex-col bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-700 rounded-[16px] shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07),0px_0px_2px_0px_rgba(23,26,31,0.08)] overflow-hidden w-[254px] h-[276px] flex-shrink-0">
      {/* Card header: title + tags */}
      <div className="flex flex-col px-[20px] pt-[10px] gap-[8px]">
        {/* Title */}
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-semibold text-[18px] leading-[28px] tracking-[-0.45px] text-[#171a1f] dark:text-light whitespace-nowrap">
          {title}
        </h3>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-[6px]">
          <Tag label={primaryTag} variant="primary" />
          {secondaryTags.map((tag) => (
            <Tag key={tag} label={tag} variant="gray" />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 px-[20px] pt-[12px] overflow-hidden">
        <p className="font-normal text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 line-clamp-5">
          {description}
        </p>
      </div>

      {/* Divider + CTA */}
      <div className="px-[20px] pb-[20px]">
        <div className="border-t border-[#dee1e6] dark:border-midnight-700 mb-[16px]" />
        <button
          onClick={handleLaunch}
          className="flex items-center justify-center gap-[8px] w-full h-[36px] bg-[#5570f6] hover:bg-[#4460e5] active:bg-[#3350d5] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] text-white text-[14px] font-[500] leading-[22px] transition-colors duration-200"
        >
          ツールを起動
          <ArrowRightIcon />
        </button>
      </div>
    </article>
  );
}

// -------------------------------------------------------
// Analytics tool data
// -------------------------------------------------------

const analyticsTools: AnalyticsToolCardProps[] = [
  {
    title: 'Google Analytics',
    description:
      'ウェブサイトのトラフィック、ユーザー行動、コンバージョン率を詳細に分析し、サイト改善のヒントを得ます。',
    primaryTag: 'データハブ',
    secondaryTags: ['Web', 'Traffic', 'SEO'],
    url: 'https://analytics.google.com',
  },
  {
    title: 'Meta Ads Manager',
    description:
      'FacebookおよびInstagram全体での広告キャンペーンのパフォーマンスを追跡、管理、最適化します。',
    primaryTag: 'データハブ',
    secondaryTags: ['Ads', 'Social', 'ROI'],
    url: 'https://adsmanager.facebook.com',
  },
  {
    title: 'TikTok Ads',
    description:
      '若年層を中心とした動画広告の効果測定。エンゲージメント率や動画視聴完了率を詳細に確認できます。',
    primaryTag: 'データハブ',
    secondaryTags: ['Ads', 'Video', 'GenZ'],
    url: 'https://ads.tiktok.com',
  },
  {
    title: 'Shopify Analytics',
    description:
      'ECサイトの売上動向、顧客単価、カゴ落ち率、在庫状況を一元管理し、販売戦略を立てます。',
    primaryTag: 'データハブ',
    secondaryTags: ['EC', 'Sales', 'Inventory'],
    url: 'https://shopify.com',
  },
];

// -------------------------------------------------------
// Main component
// -------------------------------------------------------

export default function DataHubView() {
  return (
    <section className="flex flex-col gap-[40px] px-[48px] py-[40px]">
      {/* Page Header */}
      <div className="flex flex-col gap-[12px] pb-[40px] border-b border-[#dee1e6] dark:border-midnight-700">
        {/* Badge */}
        <div className="inline-flex items-center gap-[8px] h-[28px] px-[12px] bg-[rgba(85,112,246,0.1)] rounded-[14px] w-fit">
          <ActivityIcon />
          <span className="font-[500] text-[14px] leading-[20px] text-[#5570f6]">
            分析・レポーティング拠点
          </span>
        </div>

        {/* Title */}
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-extrabold text-[48px] leading-[48px] tracking-[-1.2px] text-[#171a1f] dark:text-light">
          データハブ
        </h1>

        {/* Description */}
        <p className="font-normal text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 max-w-[767px]">
          各種外部アナリティクスツールへ一元的にアクセスできるポータルです。
          日々の重要指標（KPI）を効率的に確認し、データドリブンな意思決定をサポートします。
        </p>
      </div>

      {/* Tool Cards Grid — Row 1 */}
      <div className="flex flex-wrap gap-[24px]">
        {analyticsTools.map((tool) => (
          <AnalyticsToolCard key={`row1-${tool.title}`} {...tool} />
        ))}
      </div>

      {/* Tool Cards Grid — Row 2 */}
      <div className="flex flex-wrap gap-[24px]">
        {analyticsTools.map((tool) => (
          <AnalyticsToolCard key={`row2-${tool.title}`} {...tool} />
        ))}
      </div>
    </section>
  );
}
