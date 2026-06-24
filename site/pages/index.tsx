import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolGrid from '../modules/dashboard/components/organisms/ToolGrid';

function DashboardPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ToolGrid />
    </PageTemplate>
  );
}

export default DashboardPage;
