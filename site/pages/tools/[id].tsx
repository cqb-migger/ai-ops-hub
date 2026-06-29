import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolDetailView from '../../modules/tools/components/organisms/ToolDetailView';
import { Tool } from '../../modules/dashboard/constants/tools';
import { apiFetch } from '../../base/utils/api';

function ToolDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;
    
    setLoading(true);
    apiFetch<Tool>(`/tools/${id}`)
      .then((data) => {
        setTool(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router.isReady, id]);

  return (
    <PageTemplate footer={<DashboardFooter />}>
      {loading ? (
        <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            読み込み中...
          </p>
        </div>
      ) : tool ? (
        <ToolDetailView tool={tool} />
      ) : (
        <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            ツールが見つかりませんでした。
          </p>
        </div>
      )}
    </PageTemplate>
  );
}

export default ToolDetailPage;
