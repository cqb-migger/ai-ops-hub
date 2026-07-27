export interface Step {
  id: string;
  order: number;
  icon: string;
  title: string;
  description: string;
  category_id?: number;
}

export const STEP_ICON_OPTIONS = [
  '✏️',
  '🔍',
  '⚖️',
  '✅',
  '📝',
  '🛡️',
  '📋',
  '🤖',
  '💬',
  '🎨',
  '📊',
  '💻',
  '✨',
  '🚀',
  '💡',
  '🔔'
];
