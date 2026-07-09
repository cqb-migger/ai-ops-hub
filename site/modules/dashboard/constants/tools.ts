// API-connected types for tools (matching backend response)

export interface ToolCategory {
  id: number;
  name: string;
  order?: number;
}

export interface ToolPrompt {
  id?: number;
  tool_id?: number;
  title: string;
  description?: string;
  content: string;
  is_recommended?: boolean;
  order?: number;
  roles?: string[];
  categories?: ToolCategory[];
  // Legacy FE fields
  isRecommended?: boolean;
}

export interface ToolDetails {
  inputs?: string[];
  outputDescription?: string;
  prompts?: ToolPrompt[];
}

export interface GuideFile {
  id: number;
  tool_id: number;
  original_name: string;
  stored_name: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  order: number;
  created_at: string;
}

export interface Tool {
  // API fields (numeric id from backend)
  id: number | string;
  name: string;
  description: string;
  url?: string;
  icon?: string;
  status?: string;
  visibility?: 'public' | 'draft';
  login_ids?: string[];
  guide_content?: string;
  admin_memo?: string;
  details?: ToolDetails;
  step_id?: number | null;
  step_ids?: number[];
  is_favorite?: boolean;

  // Relational data
  categories?: ToolCategory[];
  roles?: string[];
  guide_files?: GuideFile[];
  prompts?: ToolPrompt[];

  created_at?: string;
  updated_at?: string;

  // Legacy FE flat fields (mapped from API for backwards compat)
  category: string[];
  role?: string;
  loginIds?: string[];
  guideContent?: string;
  guideMaterials?: string[];
  adminMemo?: string;
}

export const CATEGORIES = [
  'すべてのカテゴリ',
  'クリエイティブ',
  'コンプライアンス',
  'データ',
];
