import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import DataHubView from '../modules/data-hub/components/organisms/DataHubView';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function DataHubPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <DataHubView />
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

export default DataHubPage;
