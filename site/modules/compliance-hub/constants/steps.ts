import stepsData from '@base/data/steps.json';

export interface Step {
  id: string;
  order: number;
  icon: string;
  title: string;
  description: string;
}

export const INITIAL_STEPS: Step[] = stepsData as unknown as Step[];

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
