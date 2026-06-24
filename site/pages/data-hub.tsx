import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardHeader from '@base/components/organisms/DashboardHeader';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import DataHubView from '../modules/data-hub/components/organisms/DataHubView';

function DataHubPage() {
  return (
    <PageTemplate header={<DashboardHeader />} footer={<DashboardFooter />}>
      <DataHubView />
    </PageTemplate>
  );
}

export default DataHubPage;
