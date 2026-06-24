import React from 'react';
import { useRouter } from 'next/router';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardHeader from '@base/components/organisms/DashboardHeader';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolDetailView from '../../modules/tools/components/organisms/ToolDetailView';
import { TOOLS } from '../../modules/dashboard/constants/tools';

function ToolDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Find tool by ID
  const tool = TOOLS.find((t) => t.id === id);

  return (
    <PageTemplate header={<DashboardHeader />} footer={<DashboardFooter />}>
      {router.isReady && tool ? (
        <ToolDetailView tool={tool} />
      ) : (
        <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
          <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
            ツールが見つからないか、読み込み中です...
          </p>
        </div>
      )}
    </PageTemplate>
  );
}

export default ToolDetailPage;
