import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import UserManagementTable from '../modules/users/components/organisms/UserManagementTable';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function UsersPage() {
  return (
    <>
      <UserManagementTable />
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ja', ['common'])),
    },
  };
}

export default UsersPage;
