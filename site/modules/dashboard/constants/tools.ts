import toolsData from '@base/data/tools.json';

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
  details?: ToolDetails;
}

// Cast JSON data to Tool[] interface
const rawTools = toolsData as unknown as Tool[];

// Filter tools that belong to the dashboard hub
export const TOOLS: Tool[] = rawTools;

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

