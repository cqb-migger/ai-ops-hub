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

interface RoleLike {
  code: string;
  name: string;
  name_ja?: string | null;
  name_en?: string | null;
}

/** Translate a role value for display. Prefers the localized dynamic role name. */
export function translateRole(value: string, t: TFunction, roles?: RoleLike[], locale?: string): string {
  const dynamicRole = roles?.find((r) => r.code === value);
  if (dynamicRole) {
    const isEn = (locale || 'ja').startsWith('en');
    const primary = isEn ? dynamicRole.name_en : dynamicRole.name_ja;
    return primary || dynamicRole.name_ja || dynamicRole.name_en || dynamicRole.name;
  }
  return t(`filter.roleOptions.${value}`, value) as string;
}
