import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CreateToolForm from '../../modules/manage-tools/components/organisms/CreateToolForm';

function CreateToolPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <CreateToolForm />
    </PageTemplate>
  );
}

export default CreateToolPage;

