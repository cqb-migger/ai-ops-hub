import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CreativeHubView from '../modules/creative-hub/components/organisms/CreativeHubView';

function CreativeHubPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <CreativeHubView />
    </PageTemplate>
  );
}

export default CreativeHubPage;
