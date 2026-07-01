import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { ROLE_OPTIONS } from '../../modules/manage-tools/constants/roles';

type RoleValue = typeof ROLE_OPTIONS[number]['value'];

export interface SSOUser {
  id: number;
  name: string;
  email: string;
  role: RoleValue;
  lastLogin: string;
}

export function useUsers() {
  const [users, setUsers] = useState<SSOUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // --- COMMENTED OUT DB FETCH ---
      /*
      const data = await apiFetch<any[]>('/users');
      const mapped = data.map((u) => ({
        id: u.id,
        name: u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
        email: u.email,
        role: u.role,
        lastLogin: u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never',
      }));
      setUsers(mapped);
      */

      // --- MOCK DATA FOR UI DEV ---
      const mockUsersData: SSOUser[] = [
        { id: 1, name: '山田 太郎', email: 'taro.yamada@example.com', role: 'sale', lastLogin: '2026-06-25' },
        { id: 2, name: '佐藤 花子', email: 'hanako.sato@example.com', role: 'marketing', lastLogin: '2026-06-26' },
        { id: 3, name: '鈴木 健二', email: 'kenji.suzuki@example.com', role: 'backoffice', lastLogin: '2026-06-29' },
        { id: 4, name: '高橋 由美', email: 'yumi.takahashi@example.com', role: 'accounting', lastLogin: '2026-06-29' },
        { id: 5, name: '伊藤 博', email: 'hiroshi.ito@example.com', role: 'sale', lastLogin: '2026-06-30' },
        { id: 6, name: '渡辺 真一', email: 'shinichi.watanabe@example.com', role: 'marketing', lastLogin: '2026-06-28' },
        { id: 7, name: '中村 美咲', email: 'misaki.nakamura@example.com', role: 'backoffice', lastLogin: '2026-06-27' },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(mockUsersData);
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

  const updateUserRole = async (id: number, newRole: RoleValue) => {
    try {
      // --- COMMENTED OUT DB PUT ---
      /*
      const response = await apiFetch<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      */

      const targetUser = users.find(u => u.id === id);
      if (!targetUser) throw new Error('User not found');
      const updated: SSOUser = { ...targetUser, role: newRole };

      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { users, loading, error, refetch: fetchUsers, updateUserRole };
}
