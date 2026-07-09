import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { Tool, ToolCategory } from '../../modules/dashboard/constants/tools';

interface UseToolsOptions {
  hub?: string;
  category?: string;
  search?: string;
  visibility?: 'public' | 'draft' | 'all';
  role?: string;
  limit?: number;
  skip?: number;
}

interface ToolsResponse {
  items: any[];
  total: number;
  skip: number;
  limit: number;
}

/** Maps an API tool object to the internal Tool shape used by the UI */
function mapApiTool(t: any): Tool {
  return {
    // Keep original numeric id but expose as string where legacy code expects string
    id: t.id,
    name: t.name,
    description: t.description,
    url: t.url,
    icon: t.icon,
    status: t.status,
    visibility: t.visibility,
    login_ids: t.login_ids || [],
    guide_content: t.guide_content,
    admin_memo: t.admin_memo,
    details: t.details,
    step_id: t.step_id || (t.step_ids && t.step_ids[0]) || null,
    step_ids: t.step_ids || [],
    is_favorite: !!t.is_favorite,
    categories: t.categories || [],
    roles: t.roles || [],
    guide_files: t.guide_files || [],
    prompts: (t.prompts || []).map((p: any) => ({
      ...p,
      isRecommended: p.is_recommended,
    })),
    created_at: t.created_at,
    updated_at: t.updated_at,
    // Legacy flat fields for existing UI components
    category: (t.categories || []).map((c: ToolCategory) => c.name),
    role: (t.roles || []).join(','),
    loginIds: t.login_ids || [],
    guideContent: t.guide_content,
    adminMemo: t.admin_memo,
  };
}

export function useTools(options: UseToolsOptions = {}) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { hub, category, search, visibility, role, limit = 20, skip = 0 } = options;

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (hub) params.append('hub', hub);
      if (category) params.append('hub', category);
      if (search) params.append('search', search);
      if (visibility) params.append('visibility', visibility);
      if (role) params.append('role', role);
      params.append('limit', String(limit));
      params.append('skip', String(skip));

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<ToolsResponse>(`/tools${queryString}`);
      setTools((data.items || []).map(mapApiTool));
      setTotal(data.total || 0);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hub, category, search, visibility, role, limit, skip]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const createTool = async (newTool: Partial<Tool>) => {
    const body = buildToolRequestBody(newTool);
    const data = await apiFetch<any>('/tools', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const mapped = mapApiTool(data);
    setTools((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateTool = async (id: string | number, updatedFields: Partial<Tool>) => {
    const body = buildToolRequestBody(updatedFields);
    const data = await apiFetch<any>(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const mapped = mapApiTool(data);
    setTools((prev) => prev.map((t) => (String(t.id) === String(id) ? mapped : t)));
    return mapped;
  };

  const deleteTool = async (id: string | number) => {
    await apiFetch(`/tools/${id}`, {
      method: 'DELETE',
    });
    setTools((prev) => prev.filter((t) => String(t.id) !== String(id)));
  };

  const toggleFavorite = async (id: string | number) => {
    const data = await apiFetch<{ is_favorite: boolean }>(`/tools/${id}/favorite`, {
      method: 'POST',
    });
    setTools((prev) => {
      const updated = prev.map((t) => {
        if (String(t.id) === String(id)) {
          return { ...t, is_favorite: data.is_favorite };
        }
        return t;
      });
      return [...updated].sort((a, b) => {
        const aFav = a.is_favorite ? 1 : 0;
        const bFav = b.is_favorite ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        return Number(b.id) - Number(a.id);
      });
    });
    return data;
  };

  return { tools, total, loading, error, refetch: fetchTools, createTool, updateTool, deleteTool, toggleFavorite };
}

export function useTool(id?: string | number) {
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTool = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiFetch<any>(`/tools/${id}`);
      setTool(mapApiTool(data));
      setError(null);
    } catch (err: any) {
      setError(err);
      setTool(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTool();
    } else {
      setTool(null);
      setLoading(false);
    }
  }, [id, fetchTool]);

  return { tool, loading, error, refetch: fetchTool };
}


/** Converts internal Tool shape to the API request body */
function buildToolRequestBody(tool: Partial<Tool>): Record<string, any> {
  const body: Record<string, any> = {};

  if (tool.name !== undefined) body.name = tool.name;
  if (tool.description !== undefined) body.description = tool.description;
  if (tool.url !== undefined) body.url = tool.url;
  if (tool.icon !== undefined) body.icon = tool.icon;
  if (tool.status !== undefined) body.status = tool.status;
  if (tool.visibility !== undefined) body.visibility = tool.visibility;
  if (tool.guide_content !== undefined) body.guide_content = tool.guide_content;
  if (tool.admin_memo !== undefined) body.admin_memo = tool.admin_memo;
  if (tool.step_ids !== undefined) body.step_ids = tool.step_ids;
  else if ((tool as any).step_ids !== undefined) body.step_ids = (tool as any).step_ids;
  if (tool.details !== undefined) body.details = tool.details;

  // Handle categories: accept either API format (categories[]) or legacy format (category[])
  if (tool.categories !== undefined) {
    body.category_ids = tool.categories.map((c) => c.id);
  } else if ((tool as any).category_ids !== undefined) {
    body.category_ids = (tool as any).category_ids;
  }

  // Handle roles: accept either API format (roles[]) or legacy format (role string)
  if (tool.roles !== undefined) {
    body.roles = tool.roles;
  }

  // Handle login IDs
  if (tool.login_ids !== undefined) {
    body.login_ids = tool.login_ids;
  } else if (tool.loginIds !== undefined) {
    body.login_ids = tool.loginIds;
  }

  // Handle prompts
  if (tool.prompts !== undefined) {
    body.prompts = tool.prompts.map((p) => ({
      title: p.title,
      description: p.description || '',
      content: p.content,
      is_recommended: p.is_recommended ?? p.isRecommended ?? false,
      order: p.order ?? 0,
      roles: p.roles || [],
      category_ids: (p.categories || []).map((c) => c.id),
    }));
  }

  // Handle guide_files
  if (tool.guide_files !== undefined) {
    body.guide_files = tool.guide_files.map((gf) => ({
      original_name: gf.original_name,
      stored_name: gf.stored_name,
      file_path: gf.file_path,
      file_url: gf.file_url,
      mime_type: gf.mime_type || null,
      file_size: gf.file_size || null,
      order: gf.order || 0,
    }));
  } else if ((tool as any).guideFiles !== undefined) {
    body.guide_files = (tool as any).guideFiles;
  }

  return body;
}
