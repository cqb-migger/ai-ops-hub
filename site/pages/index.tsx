import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolGrid from '../modules/dashboard/components/organisms/ToolGrid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function DashboardPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ToolGrid />
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

export default DashboardPage;
