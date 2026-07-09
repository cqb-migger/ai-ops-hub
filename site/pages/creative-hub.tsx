import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CreativeHubView from '../modules/creative-hub/components/organisms/CreativeHubView';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function CreativeHubPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <CreativeHubView />
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

export default CreativeHubPage;
