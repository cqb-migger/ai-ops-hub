import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolDetailView from '../../modules/tools/components/organisms/ToolDetailView';
import { Tool } from '../../modules/dashboard/constants/tools';
import { apiFetch } from '../../base/utils/api';

function ToolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    setLoading(true);
    // apiFetch<Tool>(`/tools/${id}`)
    //   .then((data) => {
    //     setTool(data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setLoading(false);
    //   });

    // Simulating API loading with rich mock data corresponding to /manage-tools/new schema
    const timer = setTimeout(() => {
      const mockTool: Tool = {
        id: String(id || '2'),
        name: '商談データ分析アシスタント',
        category: ['クリエイティブハブ', 'コンプライアンスハブ', 'データハブ'],
        description: '入力された商談メモやCRMデータから、顧客の課題、ネクストアクション、受注確度を自動で分析・抽出するツールです。',
        url: 'https://internal.app/tools/sales-analyzer',
        icon: '📊',
        status: 'active',
        role: 'sales', // 営業
        visibility: 'public',

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
          outputDescription: '顧客의課題リスト、次のアクション提案、受注確度分析レポート（Markdown形式で出力されます）。',
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
  }, [router.isReady, id]);

  return (
    <PageTemplate footer={<DashboardFooter />}>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            読み込み中...
          </p>
        </div>
      ) : tool ? (
        <ToolDetailView tool={tool} />
      ) : (
        <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            ツールが見つかりませんでした。
          </p>
        </div>
      )}
    </PageTemplate>
  );
}

export default ToolDetailPage;
