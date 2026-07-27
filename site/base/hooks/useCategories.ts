import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export interface Category {
  id: number;
  order: number;
  name_ja?: string | null;
  name_en?: string | null;
  menu_name_ja?: string | null;
  menu_name_en?: string | null;
  slug?: string | null;
  icon?: string | null;
  has_step_flow?: boolean;
}

/** Localized category display name, falling back across languages then slug. */
export function categoryDisplayName(cat: Category, locale?: string): string {
  const isEn = (locale || 'ja').startsWith('en');
  const primary = isEn ? cat.name_en : cat.name_ja;
  return primary || cat.name_ja || cat.name_en || cat.slug || '';
}

/** Localized sidebar menu label, falling back to the localized name. */
export function categoryMenuLabel(cat: Category, locale?: string): string {
  const isEn = (locale || 'ja').startsWith('en');
  return (isEn ? cat.menu_name_en : cat.menu_name_ja) || categoryDisplayName(cat, locale);
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Category[]>('/categories/');
      setCategories(data || []);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
