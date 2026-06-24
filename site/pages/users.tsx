import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import UserManagementTable from '../modules/users/components/organisms/UserManagementTable';

function UsersPage() {
  return (
    <PageTemplate footer={<DashboardFooter />}>
      <UserManagementTable />
    </PageTemplate>
  );
}

export default UsersPage;
