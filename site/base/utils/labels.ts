import { TFunction } from 'i18next';

/** Normalize a raw category name (possibly with Japanese suffix) to its slug. */
export function categorySlug(name: string): 'creative' | 'compliance' | 'data' | null {
  if (/クリエイティブ|creative/i.test(name)) return 'creative';
  if (/コンプライアンス|compliance/i.test(name)) return 'compliance';
  if (/データ|data/i.test(name)) return 'data';
  return null;
}

/** Translate a category name for display. Falls back to the raw name when unknown. */
export function translateCategory(name: string, t: TFunction): string {
  const slug = categorySlug(name);
  return slug ? (t(`filter.categoryOptions.${slug}`, name) as string) : name;
}

/** Translate a role value for display. Falls back to the raw value when unknown. */
export function translateRole(value: string, t: TFunction): string {
  return t(`filter.roleOptions.${value}`, value) as string;
}
