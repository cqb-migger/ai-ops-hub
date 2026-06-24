import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import AdminHeader from '../../modules/manage-tools/components/organisms/AdminHeader';
import CreateToolForm from '../../modules/manage-tools/components/organisms/CreateToolForm';

function CreateToolPage() {
  return (
    <PageTemplate
      header={<AdminHeader />}
      footer={<DashboardFooter />}
      hideSidebar={true}
    >
      <CreateToolForm />
    </PageTemplate>
  );
}

export default CreateToolPage;
