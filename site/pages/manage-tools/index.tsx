import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolManagementTable from '../../modules/manage-tools/components/organisms/ToolManagementTable';

function ManageToolsPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ToolManagementTable />
    </PageTemplate>
  );
}

export default ManageToolsPage;
