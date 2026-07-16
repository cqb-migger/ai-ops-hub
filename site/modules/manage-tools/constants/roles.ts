export interface RoleOption {
  value: string;
  label: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: 'sale', label: '営業' },
  { value: 'marketing', label: 'マーケティング' },
  { value: 'backoffice', label: 'バックオフィス' },
  { value: 'accounting', label: '経理' },
  { value: 'admin', label: '管理者' },
];

export const ROLE_BADGE_COLORS: Record<string, string> = {
  sale: 'bg-[#e0f2fe] dark:bg-[#0c4a6e]/40 border border-[#7dd3fc] dark:border-[#0369a1]/60 text-[#0369a1] dark:text-[#7dd3fc] rounded-full',
  marketing: 'bg-[#fce7f3] dark:bg-[#500724]/40 border border-[#f9a8d4] dark:border-[#9d174d]/60 text-[#9d174d] dark:text-[#f9a8d4] rounded-full',
  backoffice: 'bg-[#dcfce7] dark:bg-[#064e3b]/40 border border-[#86efac] dark:border-[#065f46]/60 text-[#15803d] dark:text-[#86efac] rounded-full',
  accounting: 'bg-[#fef3c7] dark:bg-[#451a03]/40 border border-[#fcd34d] dark:border-[#92400e]/60 text-[#b45309] dark:text-[#fcd34d] rounded-full',
  admin: 'bg-[#ede9fe] dark:bg-[#2e1065]/40 border border-[#c4b5fd] dark:border-[#6d28d9]/60 text-[#6d28d9] dark:text-[#c4b5fd] rounded-full',
  default: 'bg-[#f3f4f6] dark:bg-midnight-800/60 border border-[#dee1e6] dark:border-midnight-700 text-[#565d6d] dark:text-gray-300 rounded-full',
};
