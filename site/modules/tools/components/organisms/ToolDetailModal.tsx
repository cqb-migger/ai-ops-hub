import React, { useState, useEffect } from 'react';
import { Tool } from '../../../dashboard/constants/tools';
import ToolDetailView from './ToolDetailView';

interface ToolDetailModalProps {
  toolId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolDetailModal({ toolId, isOpen, onClose }: ToolDetailModalProps) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle fetching mock data
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const timer = setTimeout(() => {
      const mockTool: Tool = {
        id: String(toolId || '2'),
        name: '商談データ分析アシスタント',
        category: ['クリエイティブ', 'コンプライアンス', 'データ'],
        description: '入力された商談メモやCRMデータから、顧客の課題、ネクストアクション、受注確度を自動で分析・抽出するツールです。',
        url: 'https://internal.app/tools/sales-analyzer',
        icon: '📊',
        status: 'active',
        role: 'sales', // 営業
        visibility: 'public',
        loginIds: [
          'sales-analyzer-user01@company.local',
          'sales-analyzer-user02@company.local',
          'sales-analyzer-admin@company.local'
        ],

        guideContent: `# 商談データ分析アシスタント 活用ガイド
  
このツールは、商談中の会話メモや議事録、CRMに登録されている履歴データから、**「顧客の潜在課題」「次に取るべき具体的なアクション」「見込まれる受注確度 (A/B/C/D)」**を自動的に分析し、レポートを作成します。

## 主な機能とメリット
- **自動サマリー**: 長文の商談テキストから重要な要素だけを約300文字に要約します。
- **課題の可視化**: 顧客の発言の裏にある本質的なニーズ（コスト、スケジュール、決裁権など）を抽出。
- **ネクストアクションの提案**: 次回アプローチ時期や推奨する提案内容を自動提示。

## 活用ステップ
1. 打ち合わせや商談が終わった後、メモ帳などに記録した会話内容をコピーします。
2. ツール起動後、下部にある「推奨プロンプト」をコピーしてチャット欄に貼り付けます。
3. \`[※ここにデータをペーストしてください]\` の部分に、コピーした会話内容を上書きして送信します。
4. 数十秒で分析レポートが生成されるので、それをCRMや社内日報にコピー＆ペーストして共有してください。
`,
        guideMaterials: ['sales_analyzer_guide_v2.pdf'],
        adminMemo: '2026/06: プロンプトV2に更新しました。営業部からのフィードバック（受注確度判定の精度向上）を反映し、BANTCフレームワークでの抽出ロジックを追加しています。',
        details: {
          inputs: [
            '商談時のミーティング書き起こしテキスト',
            '顧客の会社概要（業界、規模など）',
            '既存システム等の課題ヒアリングシート'
          ],
          outputDescription: '顧客の課題リスト、次のアクション提案、受注確度分析レポート（Markdown形式で出力されます）。',
          prompts: [
            {
              title: '基本商談分析プロンプト',
              isRecommended: true,
              description: '標準的な商談メモからBANTCを分析するプロンプトです。',
              content: `あなたは優秀な営業支援AIアシスタントです。
以下の【商談メモ】を読み込み、次のフォーマットに従って分析レポートを出力してください。

### 1. 顧客の現状と本質的課題
- 顧客が現在抱えている課題と、その根本原因と思われる背景。

### 2. BANTC分析
- Budget（予算）:
- Authority（決裁権）:
- Needs（必要性）:
- Timeframe（導入時期）:
- Competitor（競合状況）:

### 3. 次回アクション案
- 営業担当者が次に取るべき行動（期日と内容の目安）を3点提案してください。

### 4. 受注確度判定
- S/A/B/C/D の5段階で判定し、その理由を簡潔に述べてください。

【商談メモ】:
[※ここにデータをペーストしてください]`
            },
            {
              title: 'アプローチメール文案作成',
              description: '商談の分析結果をもとに、顧客への次回フォローメールをドラフトします。',
              content: `以下の【商談分析結果】に基づいて、次回フォローのためのビジネスメールの文案を作成してください。
丁寧かつフランクになりすぎないよう、最適なトーンでお願いします。

【商談分析結果】:
[※ここにデータをペーストしてください]`
            }
          ]
        }
      };
      setTool(mockTool);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, toolId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[16px] md:p-[40px] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-midnight-950 w-full max-w-[1100px] h-[95vh] md:h-auto md:max-h-[95vh] rounded-[16px] shadow-2xl relative flex flex-col overflow-hidden p-[4px] md:p-[6px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[16px] md:top-[16px] md:right-[20px] p-[8px] bg-white/90 dark:bg-midnight-900/90 backdrop-blur-sm rounded-full hover:bg-gray-100 dark:hover:bg-midnight-800 transition-colors z-20 border border-[#dee1e6] dark:border-midnight-700 shadow-sm"
          title="閉じる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px] text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fixed Header */}
        {!loading && tool && (
          <div className="flex-shrink-0 flex items-start gap-[16px] pt-[12px] px-[16px] md:pt-[16px] md:px-[24px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 z-10 relative">
            {/* Avatar */}
            <div className="relative flex-shrink-0 w-[48px] h-[48px] rounded-full overflow-hidden bg-[#f3f6fd] dark:bg-midnight-900 shadow-sm border border-[#dbe2f9] dark:border-midnight-800 flex items-center justify-center text-[24px] select-none">
              {tool.icon && (tool.icon.startsWith('data:image/') || tool.icon.startsWith('http') || tool.icon.startsWith('/')) ? (
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{tool.icon || '🔧'}</span>
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-[4px] min-w-0 pr-[40px]">
              <div className="flex items-center gap-[12px] flex-wrap">
                <h2 className="text-[24px] font-bold leading-[30px] text-[#171a1f] dark:text-light tracking-[-0.5px] font-base truncate">
                  {tool.name}
                </h2>
              </div>
              <p className="text-[15px] font-normal leading-[24px] text-[#565d6d] dark:text-gray-400 font-base line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="w-full h-full overflow-y-auto rounded-[12px]">
          <div className="p-[16px] md:p-[24px] pt-[16px] md:pt-[20px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-[48px] text-center w-full min-h-[400px]">
              <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                読み込み中...
              </p>
            </div>
          ) : tool ? (
            <ToolDetailView tool={tool} hideHeader={true} hideLaunchButton={true} />
          ) : (
            <div className="flex flex-col items-center justify-center p-[48px] text-center w-full min-h-[400px]">
              <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                ツールが見つかりませんでした。
              </p>
            </div>
          )}
        </div>
        </div>

        {/* Fixed Footer */}
        {!loading && tool && (
          <div className="flex-shrink-0 flex items-center justify-end gap-[12px] px-[16px] py-[12px] md:px-[24px] border-t border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 rounded-b-[12px] z-10 relative">
            <button
              onClick={onClose}
              className="px-[20px] py-[10px] text-[#565d6d] dark:text-gray-300 font-semibold text-[14px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-700 rounded-[8px] hover:bg-gray-50 dark:hover:bg-midnight-800 transition-colors shadow-sm"
            >
              閉じる
            </button>
            
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[6px] px-[20px] py-[10px] bg-[#5570f6] text-white text-[14px] font-semibold rounded-[8px] hover:bg-[#435bce] transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-[16px] h-[16px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                ツールを開く
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
