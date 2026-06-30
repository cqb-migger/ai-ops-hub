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
        { id: 1, name: '山田 太郎', email: 'taro.yamada@example.com', role: 'Admin', lastLogin: '2026-06-25' },
        { id: 2, name: '佐藤 花子', email: 'hanako.sato@example.com', role: 'Member', lastLogin: '2026-06-26' },
        { id: 3, name: '鈴木 健二', email: 'kenji.suzuki@example.com', role: 'Member', lastLogin: 'Never' },
        { id: 4, name: '高橋 由美', email: 'yumi.takahashi@example.com', role: 'Member', lastLogin: '2026-06-29' },
        { id: 5, name: '伊藤 博', email: 'hiroshi.ito@example.com', role: 'Admin', lastLogin: '2026-06-30' },
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

  const toggleUserRole = async (id: number, currentRole: 'Admin' | 'Member') => {
    try {
      const newRole = currentRole === 'Admin' ? 'Member' : 'Admin';
      
      // --- COMMENTED OUT DB PUT ---
      /*
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
      */
      
      // --- MOCK MIGRATION ---
      const targetUser = users.find(u => u.id === id);
      if (!targetUser) throw new Error("User not found");
      const updated: SSOUser = { ...targetUser, role: newRole };
      
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  return { users, loading, error, refetch: fetchUsers, toggleUserRole };
}
