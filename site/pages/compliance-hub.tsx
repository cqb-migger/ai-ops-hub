import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardHeader from '@base/components/organisms/DashboardHeader';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ComplianceHubView from '../modules/compliance-hub/components/organisms/ComplianceHubView';

function ComplianceHubPage() {
  return (
    <PageTemplate header={<DashboardHeader />} footer={<DashboardFooter />}>
      <ComplianceHubView />
    </PageTemplate>
  );
}

export default ComplianceHubPage;
