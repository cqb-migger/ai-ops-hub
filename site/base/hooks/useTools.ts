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
      // --- COMMENTED OUT DB FETCH ---
      /*
      const params = new URLSearchParams();
      const selectedFilter = category || hub;
      if (selectedFilter && selectedFilter !== 'すべてのカテゴリ' && selectedFilter !== 'すべてのハブ') {
        params.append('category', selectedFilter);
      }
      if (search) params.append('search', search);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<Tool[]>(`/tools${queryString}`);
      setTools(data);
      */
      
      // --- MOCK DATA FOR UI DEV ---
      const baseMockTools: Tool[] = [
        {
          id: '1',
          name: 'ChatGPT',
          category: ['クリエイティブハブ'],
          description: 'コンテンツ作成や文章生成を支援する高度なAI言語モデル。',
          url: 'https://chat.openai.com',
          status: '稼働中',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg'
        },
        {
          id: '2',
          name: 'ポリシーチェッカー AI',
          category: ['コンプライアンスハブ'],
          description: '社内規定やコンプライアンス要件を自動で検証するツール。',
          url: 'https://example.com/policy',
          status: '稼働中',
        },
        {
          id: '3',
          name: 'データインサイト分析',
          category: ['データハブ'],
          description: '大規模データの包括的な分析とKPIのモニタリングを提供。',
          url: 'https://example.com/data',
          status: 'メンテナンス',
        },
        {
          id: '4',
          name: 'Midjourney',
          category: ['クリエイティブハブ'],
          description: 'クリエイティブ職向けの高品質なAI画像生成ツール。',
          url: 'https://midjourney.com',
          status: '稼働中',
        },
        {
          id: '5',
          name: 'セキュリティスキャナー',
          category: ['コンプライアンスハブ', 'データハブ'],
          description: '機密データの脆弱性および法令遵守に関するスキャナー。',
          url: 'https://example.com/security',
          status: '停止中',
        }
      ];
      
      // Generate extra mock tools for pagination testing (Total will be > 16)
      const extraTools: Tool[] = Array.from({ length: 25 }).map((_, i) => {
        const idNum = i + 6;
        const categories = [['クリエイティブハブ'], ['コンプライアンスハブ'], ['データハブ'], ['クリエイティブハブ', 'データハブ'], ['コンプライアンスハブ', 'データハブ']];
        const statuses = ['稼働中', '稼働中', '稼働中', 'メンテナンス', '停止中'];
        return {
          id: `mock-generated-${idNum}`,
          name: `AI サンプルツール ${idNum}`,
          category: categories[i % categories.length],
          description: `これは自動生成されたサンプルツール ${idNum} です。UIやページネーションのテストに使用します。`,
          url: `https://example.com/tool-${idNum}`,
          status: statuses[i % statuses.length],
        };
      });

      const mockToolsData: Tool[] = [...baseMockTools, ...extraTools];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredData = mockToolsData;
      const selectedFilter = category || hub;
      
      if (selectedFilter && selectedFilter !== 'すべてのカテゴリ' && selectedFilter !== 'すべてのハブ') {
        filteredData = filteredData.filter(t => t.category.includes(selectedFilter.toLowerCase()));
      }
      
      if (search) {
        filteredData = filteredData.filter(t => 
          t.name.toLowerCase().includes(search.toLowerCase()) || 
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.category.some(c => c.toLowerCase().includes(search.toLowerCase()))
        );
      }

      setTools(filteredData);
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
    // --- COMMENTED OUT DB POST ---
    /*
    const data = await apiFetch<Tool>('/tools', {
      method: 'POST',
      body: JSON.stringify(newTool),
    });
    setTools((prev) => [...prev, data]);
    return data;
    */
    
    // --- MOCK MIGRATION ---
    const data: Tool = { ...newTool, id: Math.random().toString(36).substr(2, 9) };
    setTools((prev) => [...prev, data]);
    return data;
  };

  const updateTool = async (id: string, updatedFields: Partial<Tool>) => {
    // --- COMMENTED OUT DB PUT ---
    /*
    const data = await apiFetch<Tool>(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    });
    setTools((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
    */

    // --- MOCK MIGRATION ---
    const currentTool = tools.find(t => t.id === id) || {} as Tool;
    const data: Tool = { ...currentTool, ...updatedFields };
    setTools((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const deleteTool = async (id: string) => {
    // --- COMMENTED OUT DB DELETE ---
    /*
    await apiFetch(`/tools/${id}`, {
      method: 'DELETE',
    });
    */
    
    // --- MOCK MIGRATION ---
    setTools((prev) => prev.filter((t) => t.id !== id));
  };

  return { tools, loading, error, refetch: fetchTools, createTool, updateTool, deleteTool };
}
