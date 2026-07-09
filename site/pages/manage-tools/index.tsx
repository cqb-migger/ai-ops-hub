import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import ToolManagementTable from '../../modules/manage-tools/components/organisms/ToolManagementTable';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function ManageToolsPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <ToolManagementTable />
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

export default ManageToolsPage;
