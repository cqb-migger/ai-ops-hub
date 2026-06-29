// Static types and categories for tools

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
  category: string[];
  description: string;
  hubs: string[];
  url?: string;
  icon?: string;
  status?: string;
  details?: ToolDetails;
}



export const CATEGORIES = [
  'すべてのカテゴリ',
  'テキスト生成・推論',
  'テキスト処理',
  '画像生成',
  'データ分析',
  'コーディング',
  'コンプライアンス',
];

export const HUBS = [
  'すべてのハブ',
  'creative',
  'compliance',
  'data',
];

