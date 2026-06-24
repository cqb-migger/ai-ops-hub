import React from 'react';
import toast from 'react-hot-toast';

// SVG Icons
function ShieldAlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

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

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

interface ResourceCard {
  title: string;
  tags: { text: string; outline?: boolean }[];
  description: string;
}

const RESOURCES: ResourceCard[] = [
  {
    title: '薬機法チェッカー',
    tags: [
      { text: 'コンプライアンス', outline: true },
      { text: '法務' },
      { text: '経営企画' }
    ],
    description: 'NotebookLMを活用した一次スクリーニングツール。作成した原稿をペーストして判定。'
  },
  {
    title: '景表法ガイドライン2024',
    tags: [
      { text: 'コンプライアンス', outline: true },
      { text: 'マーケティング' }
    ],
    description: '最新の景品表示法に関する社内解釈と、優良誤認・有利誤認の基準をまとめた公式文書。'
  },
  {
    title: 'NG表現・言い換え辞典',
    tags: [
      { text: 'コンプライアンス', outline: true }
    ],
    description: '過去に指摘を受けたNG表現のデータベースと、推奨される安全な言い換え例のリスト。'
  },
  {
    title: '承認フロー申請システム',
    tags: [
      { text: 'コンプライアンス', outline: true }
    ],
    description: '法務部門への最終レビュー依頼と、証跡を残すための社内申請ワークフロー。'
  }
];

// Double the list to show 8 cards matching the Figma design (2 rows of 4 repeating cards)
const GRID_RESOURCES = [...RESOURCES, ...RESOURCES];

export default function ComplianceHubView() {
  const handleLaunch = (title: string) => {
    toast.success(`${title} を起動しました（シミュレーション）`);
  };

  return (
    <div className="flex flex-col gap-[36px] w-full max-w-[1088px] mx-auto text-[#171a1f] dark:text-light font-base">
      
      {/* Category Pill Badge & Header title */}
      <div className="flex flex-col items-start gap-[12px]">
        {/* Compliance pill */}
        <div className="flex items-center gap-[6px] h-[28px] px-[12px] bg-[#f1f4fe] dark:bg-midnight-800 rounded-full select-none">
          <ShieldAlertIcon />
          <span className="text-[14px] font-medium text-[#5570f6] dark:text-primary-300">
            コンプライアンス遵守
          </span>
        </div>

        {/* Title & description */}
        <h2 className="text-[36px] font-extrabold leading-[40px] text-[#171a1f] dark:text-light tracking-[-0.9px] font-base">
          法務・規制チェック プロセス
        </h2>
        <p className="text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal max-w-[893px]">
          薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した安全なコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツは以下のステップに従って確認を行ってください。
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[12px]">
          {GRID_RESOURCES.map((resource, index) => (
            <div
              key={index}
              className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] p-[20px] h-[234px] justify-between shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Top section */}
              <div className="flex flex-col gap-[10px]">
                <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[28px] text-[#171a1f] dark:text-light tracking-[-0.45px]">
                  {resource.title}
                </h4>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-[6px]">
                  {resource.tags.map((tag, tIdx) => (
                    tag.outline ? (
                      <div
                        key={tIdx}
                        className="border border-[#dee1e6] dark:border-midnight-800 px-[10px] py-[2px] rounded-full text-[10px] font-semibold text-[#565d6d] dark:text-gray-400 select-none"
                      >
                        {tag.text}
                      </div>
                    ) : (
                      <div
                        key={tIdx}
                        className="bg-[#f3f4f6] dark:bg-midnight-900 px-[8px] py-[2px] rounded-[6px] text-[10px] font-medium text-[#565d6d] dark:text-gray-400 select-none"
                      >
                        {tag.text}
                      </div>
                    )
                  ))}
                </div>

                <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal line-clamp-3">
                  {resource.description}
                </p>
              </div>

              {/* Card Bottom section */}
              <div className="flex flex-col gap-[12px]">
                <div className="border-t border-[#dee1e6] dark:border-midnight-800 w-full" />
                <button
                  type="button"
                  onClick={() => handleLaunch(resource.title)}
                  className="flex items-center justify-center gap-[8px] w-full h-[36px] bg-[#5570f6] hover:bg-[#395ce0] text-white rounded-[6px] text-[14px] font-medium shadow-sm transition-colors duration-200"
                >
                  <span>ツールを起動</span>
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
