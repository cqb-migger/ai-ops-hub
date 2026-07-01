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
  url?: string;
  icon?: string;
  status?: string;
  details?: ToolDetails;
  role?: string;
  visibility?: 'public' | 'draft';

  guideContent?: string;
  guideMaterials?: string[];
  adminMemo?: string;
}



export const CATEGORIES = [
  'すべてのカテゴリ',
  'クリエイティブハブ',
  'コンプライアンスハブ',
  'データハブ',
];


