export interface ToolPrompt {
  title: string;
  isRecommended?: boolean;
  description: string;
  content: string;
}

export interface ToolDetails {
  inputs: string[];
  outputDescription: string;
  prompts: ToolPrompt[];
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  roles: string[];
  description: string;
  url?: string;
  extraTagCount?: number;
  details?: ToolDetails;
}

export const TOOLS: Tool[] = [
  {
    id: 'chatgpt-gpt-4o',
    name: 'ChatGPT (GPT-4o)',
    category: 'テキスト生成・推論',
    roles: ['全般', 'マーケティング'],
    description: '新製品ランディングページ（LP）の構成案作成 のための最適なセットアップをガイドします。',
    details: {
      inputs: [
        'ターゲット顧客のペルソナ情報（PDF）',
        '新製品の主要機能リストとスペック表',
        '競合他社との差別化ポイント',
      ],
      outputDescription: 'セールスライティングの基本原則（PASONAの法則など）に基づいた、LP全体のセクション構成案と各セクションのキャッチコピー案（Markdown形式）。',
      prompts: [
        {
          title: 'LP構成案作成（PASONAの法則）',
          isRecommended: true,
          description: '基本となるセールスライティング의 型を用いた標準的なプロンプトです。',
          content: `以下の情報を基に、新製品のランディングページ（LP）の構成案を作成してください。

# 目的
見込み客の興味を引き、製品の無料トライアル申し込み（コンバージョン）を最大化すること。

# 前提条件
・ターゲット層の抱える課題に寄り添うトーン＆マナー
・PASONAの法則（Problem, Agitation, Solution, Narrowing down, Action）を意識した構成
・各セクションに見出し（H2）と概要文を箇条書きで含めること
・出力形式はMarkdownでお願いします。

# 入力データ
[※ここにペルソナ情報や製品特徴をペーストしてください]`,
        },
        {
          title: '【別案】LP構成案作成（ストーリーテリング型）',
          description: '顧客の感情に訴えかける物語形式のLPを構成する場合に使用します。',
          content: `以下の情報を基に、ストーリーテリングを重視した新製品のランディングページ（LP）の構成案を作成してください。

# 目的
顧客の共感を呼び、ブランドへの信頼感を高めて購入につなげること。

# 前提条件
・主人公（ターゲット層）が現状の課題に直面し、新製品によってそれを克服するストーリー展開
・感情を動かす見出しと、具体的な情景が浮かぶリード文を含めること
・出力形式はMarkdown

# 入力データ
[※ここにペルソナ情報や製品特徴をペーストしてください]`,
        },
      ],
    },
  },
  {
    id: 'chatpro-enterprise',
    name: 'ChatPro Enterprise',
    category: 'テキスト処理',
    roles: ['全般', 'マーケティング'],
    extraTagCount: 1,
    description: '社内データに基づいた高精度な文章生成、要約、翻訳を安全に行えるエンタープライズ向け対話型AI。',
    details: {
      inputs: [
        '社内データベースのテキストデータ',
        '翻訳・要約対象のドキュメントファイル',
      ],
      outputDescription: '社内規定・セキュリティ基準に準拠したセキュアな出力テキスト、または正確な多言語翻訳結果。',
      prompts: [
        {
          title: '社内文書の要約と校正',
          isRecommended: true,
          description: 'エンタープライズ環境で標準的な文書要約用プロンプトです。',
          content: `以下の社内ドキュメントを、指定のルールに従って要約・校正してください。

# ルール
- 重要な論点を3つの箇条書きにまとめること
- トーンはフォーマル（敬体）に統一
- セキュリティ上問題のある固有名詞は匿名化すること

# ドキュメント
[※ここにテキストをペーストしてください]`,
        },
      ],
    },
  },
  {
    id: 'designgenius-ai',
    name: 'DesignGenius AI',
    category: '画像生成',
    roles: ['マーケティング', 'デザイン'],
    description: 'プロンプトから高品質なマーケティング用バナーやSNS向け画像を数秒で生成するクリエイティブツール。',
    details: {
      inputs: [
        '作成したい画像のアスペクト比とスタイル指定',
        '画像に挿入したいコピーや要素のキーワード',
      ],
      outputDescription: 'マーケティング活動やSNS投稿に最適化された、高解像度の画像アセット。',
      prompts: [
        {
          title: 'マーケティングバナー用プロンプト生成',
          isRecommended: true,
          description: '高品質なプロンプトを作成するためのテンプレート。',
          content: `SNS向けバナー広告用の画像を生成するためのプロンプトを構築してください。

# 画像イメージ
- スタイル: ミニマリズム、モダン
- 配色: 青（#5570f6）をベースにしたハイコントラスト
- 被写体: デバイスを使用するオフィスワーカーのイラスト

# 出力形式
英語のプロンプトテキストのみを出力してください。`,
        },
      ],
    },
  },
  {
    id: 'datainsight-predictor',
    name: 'DataInsight Predictor',
    category: 'データ分析',
    roles: ['データサイエンス', '経営企画'],
    extraTagCount: 1,
    description: '膨大な売上データや顧客データから将来のトレンドを予測し、視覚的なレポートを自動生成します。',
  },
  {
    id: 'codeassistant-pro',
    name: 'CodeAssistant Pro',
    category: 'コーディング',
    roles: ['エンジニアリング'],
    description: '開発環境に統合され、リアルタイムでコード補完やバグ検出、リファクタリング提案を行う開発者向けAI。',
  },
  {
    id: 'legaldoc-analyzer',
    name: 'LegalDoc Analyzer',
    category: 'コンプライアンス',
    roles: ['法務', '経営企画'],
    description: '契約書や利用規約を瞬時にスキャンし、リスクのある条項や矛盾点を指摘する法務特化型AIツール。',
  },
  {
    id: 'videoforge-create',
    name: 'VideoForge Create',
    category: '画像生成',
    roles: ['マーケティング', '広報'],
    description: 'テキスト原稿からナレーション付きのプレゼン動画やプロモーションビデオを自動生成する service。',
  },
  {
    id: 'hr-talentmatcher',
    name: 'HR TalentMatcher',
    category: 'テキスト処理',
    roles: ['人事'],
    description: '応募者のレジュメと募集要項を自然言語処理で分析し、最適な候補者をスコアリングする採用支援。',
  },
  {
    id: 'salespitch-optimizer',
    name: 'SalesPitch Optimizer',
    category: 'テキスト処理',
    roles: ['営業'],
    description: '顧客の過去の対応履歴を分析し、パーソナライズされた最適な営業メールの文面を提案します。',
  },
  {
    id: 'yakuhou-checker',
    name: '薬機法チェッカー',
    category: 'コンプライアンス',
    roles: ['法務', '経営企画'],
    description: 'NotebookLMを活用した一次スクリーニングツール。作成した原稿をペーストして判定。',
  },
  {
    id: 'keihyohou-guidelines',
    name: '景表法ガイドライン',
    category: 'コンプライアンス',
    roles: ['マーケティング'],
    description: '最新の景品表示法に関する社内解釈と、優良誤認・有利誤認の基準をまとめた公式文書。',
  },
  {
    id: 'ng-expression-dictionary',
    name: 'NG表現・言い換え辞典',
    category: 'コンプライアンス',
    roles: [],
    description: '過去に指摘を受けたNG表現のデータベースと、推奨される安全な言い換え例のリスト。',
  },
  {
    id: 'approval-flow-system',
    name: '承認フロー申請システム',
    category: 'コンプライアンス',
    roles: [],
    description: '法務部門への最終レビュー依頼と、証跡を残すための社内申請ワークフロー。',
  },
];

export const CATEGORIES = [
  'すべてのカテゴリ',
  'テキスト生成・推論',
  'テキスト処理',
  '画像生成',
  'データ分析',
  'コーディング',
  'コンプライアンス',
];

export const ROLES = [
  'すべての役割',
  '全般',
  'マーケティング',
  'デザイン',
  'データサイエンス',
  '経営企画',
  'エンジニアリング',
  '法務',
  '広報',
  '人事',
  '営業',
];
