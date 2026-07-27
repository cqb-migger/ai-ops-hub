import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';
import { Step } from '../types/steps';

function mapApiStep(s: any): Step {
  return {
    id: String(s.id),
    order: s.order,
    icon: s.icon || '📋',
    title: s.title,
    description: s.description,
    category_id: s.category_id,
  };
}

export function useSteps(options: { enabled?: boolean; categoryId?: number } = {}) {
  const { enabled = true, categoryId } = options;
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    try {
      const qs = categoryId ? `?category_id=${categoryId}` : '';
      const data = await apiFetch<any[]>(`/steps/${qs}`);
      setSteps((data || []).map(mapApiStep));
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (enabled) {
      fetchSteps();
    } else {
      setSteps([]);
      setLoading(false);
    }
  }, [fetchSteps, enabled, categoryId]);

  /** Bulk-save all steps after drag-drop reorder */
  const saveSteps = async (newSteps: Step[]) => {
    setLoading(true);
    try {
      const body = newSteps.map((s, i) => ({
        id: Number(s.id),
        order: i + 1,
        icon: s.icon,
        title: s.title,
        description: s.description,
      }));
      const qs = categoryId ? `?category_id=${categoryId}` : '';
      const data = await apiFetch<any[]>(`/steps/${qs}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const mapped = (data || []).map(mapApiStep);
      setSteps(mapped);
      setError(null);
      return mapped;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStep = async (step: Omit<Step, 'id'>) => {
    const body = {
      order: step.order,
      icon: step.icon,
      title: step.title,
      description: step.description,
      category_id: categoryId,
    };
    
    const qs = categoryId ? `?category_id=${categoryId}` : '';
    const data = await apiFetch<any>(`/steps/single${qs}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const mapped = mapApiStep(data);
    setSteps((prev) => [...prev, mapped].sort((a, b) => a.order - b.order));
    return mapped;
  };

  const updateStep = async (id: string, updatedFields: Partial<Step>) => {
    const data = await apiFetch<any>(`/steps/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        icon: updatedFields.icon,
        title: updatedFields.title,
        description: updatedFields.description,
        order: updatedFields.order,
      }),
    });
    const mapped = mapApiStep(data);
    setSteps((prev) => prev.map((s) => (s.id === id ? mapped : s)));
    return mapped;
  };

  const deleteStep = async (id: string) => {
    await apiFetch(`/steps/${id}`, {
      method: 'DELETE',
    });
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  return { steps, loading, error, refetch: fetchSteps, saveSteps, createStep, updateStep, deleteStep };
}
