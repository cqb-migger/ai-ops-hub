import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

export interface Role {
  id: number;
  code: string;
  name: string;
  name_ja?: string | null;
  name_en?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Localized role display name, falling back across languages then `name`. */
export function roleDisplayName(role: Role, locale?: string): string {
  const isEn = (locale || 'ja').startsWith('en');
  const primary = isEn ? role.name_en : role.name_ja;
  return primary || role.name_ja || role.name_en || role.name || role.code;
}

let cachedRoles: Role[] | null = null;

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(cachedRoles || []);
  const [loading, setLoading] = useState<boolean>(!cachedRoles);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Role[]>('/roles/');
      cachedRoles = data || [];
      setRoles(cachedRoles);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cachedRoles) {
      fetchRoles();
    }
  }, [fetchRoles]);

  return { roles, loading, error, refetch: fetchRoles };
}
