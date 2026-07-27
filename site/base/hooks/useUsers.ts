import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
type RoleValue = string;

export interface SSOUser {
  id: number;
  name: string;
  email: string;
  role: RoleValue;
  roles: string[];
  lastLogin: string;
  is_active?: boolean;
}

interface UsersResponse {
  items: any[];
  total: number;
  skip: number;
  limit: number;
}

interface UseUsersOptions {
  search?: string;
  role?: string;
  limit?: number;
  skip?: number;
}

function mapApiUser(u: any): SSOUser {
  return {
    id: u.id,
    name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
    email: u.email,
    role: u.role as RoleValue,
    roles: Array.isArray(u.roles) ? u.roles : (u.role ? [u.role] : []),
    lastLogin: u.last_login
      ? new Date(u.last_login).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '—',
    is_active: u.is_active,
  };
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<SSOUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { search, role, limit = 100, skip = 0 } = options;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      params.append('limit', String(limit));
      params.append('skip', String(skip));

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<UsersResponse>(`/users/${queryString}`);
      setUsers((data.items || []).map(mapApiUser));
      setTotal(data.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search, role, limit, skip]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRoles = async (id: number, newRoles: string[]) => {
    try {
      const response = await apiFetch<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ roles: newRoles }),
      });
      const updated = mapApiUser(response);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    await apiFetch(`/users/${id}`, {
      method: 'DELETE',
    });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return { users, total, loading, error, refetch: fetchUsers, updateUserRoles, deleteUser };
}
