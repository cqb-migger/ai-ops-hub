import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardHeader from '@base/components/organisms/DashboardHeader';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CreativeHubView from '../modules/creative-hub/components/organisms/CreativeHubView';

function CreativeHubPage() {
  return (
    <PageTemplate header={<DashboardHeader />} footer={<DashboardFooter />}>
      <CreativeHubView />
    </PageTemplate>
  );
}

export default CreativeHubPage;
