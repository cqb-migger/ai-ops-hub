import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Step } from '../../modules/compliance-hub/constants/steps';

const MOCK_STEPS: Step[] = [
  {
    id: 'step-1',
    order: 1,
    icon: '🛡️',
    title: 'セキュリティポリシー確認',
    description: '社内の安全基準およびセキュリティポリシーへの適合性を自動でスキャンします。',
  },
  {
    id: 'step-2',
    order: 2,
    icon: '🔍',
    title: '機密データ検出',
    description: '個人情報（PII）や保護すべき重要な機密情報の有無を厳格にチェックします。',
  },
  {
    id: 'step-3',
    order: 3,
    icon: '⚖️',
    title: '知的財産・ライセンス審査',
    description: '商用利用可能なモデルであるか、またオープンソースライセンスに違反していないか確認します。',
  },
  {
    id: 'step-4',
    order: 4,
    icon: '📋',
    title: '承認ワークフロー',
    description: '担当管理者へ報告書を送信し、安全性の評価結果に対する最終確認と承認を行います。',
  },
];

export function useSteps() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSteps = async () => {
    setLoading(true);
    try {
      // --- COMMENTED OUT DB FETCH ---
      /*
      const data = await apiFetch<Step[]>('/steps');
      setSteps(data);
      */

      // --- MOCK DATA FOR UI DEV ---
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSteps(MOCK_STEPS);
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
      // --- COMMENTED OUT DB POST ---
      /*
      const data = await apiFetch<Step[]>('/steps', {
        method: 'POST',
        body: JSON.stringify(newSteps),
      });
      setSteps(data);
      */

      // --- MOCK DATA FOR UI DEV ---
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSteps(newSteps);
      setError(null);
      return newSteps;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { steps, loading, error, refetch: fetchSteps, saveSteps };
}

