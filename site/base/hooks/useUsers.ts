import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export interface SSOUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  lastLogin: string;
}

export function useUsers() {
  const [users, setUsers] = useState<SSOUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<any[]>('/users');
      const mapped = data.map((u) => ({
        id: u.id,
        name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        email: u.email,
        role: u.role,
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never',
      }));
      setUsers(mapped);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserRole = async (id: number, currentRole: 'Admin' | 'Member') => {
    try {
      const newRole = currentRole === 'Admin' ? 'Member' : 'Admin';
      const response = await apiFetch<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      const updated: SSOUser = {
        id: response.id,
        name: response.name || `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.email,
        email: response.email,
        role: response.role,
        lastLogin: response.last_login ? new Date(response.last_login).toLocaleDateString() : 'Never',
      };
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { users, loading, error, refetch: fetchUsers, toggleUserRole };
}
