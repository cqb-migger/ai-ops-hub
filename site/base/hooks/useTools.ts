import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Tool } from '../../modules/dashboard/constants/tools';

interface UseToolsOptions {
  hub?: string;
  category?: string;
  search?: string;
}

export function useTools(options: UseToolsOptions = {}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { hub, category, search } = options;

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const selectedFilter = category || hub;
      if (selectedFilter && selectedFilter !== 'すべてのカテゴリ' && selectedFilter !== 'すべてのハブ') {
        params.append('category', selectedFilter);
      }
      if (search) params.append('search', search);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<Tool[]>(`/tools${queryString}`);
      setTools(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, [hub, category, search]);

  const createTool = async (newTool: Omit<Tool, 'id'>) => {
    const data = await apiFetch<Tool>('/tools', {
      method: 'POST',
      body: JSON.stringify(newTool),
    });
    setTools((prev) => [...prev, data]);
    return data;
  };

  const updateTool = async (id: string, updatedFields: Partial<Tool>) => {
    const data = await apiFetch<Tool>(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    });
    setTools((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const deleteTool = async (id: string) => {
    await apiFetch(`/tools/${id}`, {
      method: 'DELETE',
    });
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  return { tools, loading, error, refetch: fetchTools, createTool, updateTool, deleteTool };
}
