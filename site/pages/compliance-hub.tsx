import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ComplianceHubView from '../modules/compliance-hub/components/organisms/ComplianceHubView';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function ComplianceHubPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ComplianceHubView />
    </PageTemplate>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ja', ['common'])),
    },
  };
}

export default ComplianceHubPage;
