import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ComplianceHubView from '../modules/compliance-hub/components/organisms/ComplianceHubView';

function ComplianceHubPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ComplianceHubView />
    </PageTemplate>
  );
}

export default ComplianceHubPage;
