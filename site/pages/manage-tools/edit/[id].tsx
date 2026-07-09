import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import EditToolForm from '../../../modules/manage-tools/components/organisms/EditToolForm';

function EditToolPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <EditToolForm />
    </PageTemplate>
  );
}

export default EditToolPage;
