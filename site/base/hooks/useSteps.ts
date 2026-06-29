import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Step } from '../../modules/compliance-hub/constants/steps';

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSteps = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Step[]>('/steps');
      setSteps(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const saveSteps = async (newSteps: Step[]) => {
    setLoading(true);
    try {
      const data = await apiFetch<Step[]>('/steps', {
        method: 'POST',
        body: JSON.stringify(newSteps),
      });
      setSteps(data);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { steps, loading, error, refetch: fetchSteps, saveSteps };
}
