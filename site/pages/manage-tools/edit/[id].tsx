import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import EditToolForm from '../../../modules/manage-tools/components/organisms/EditToolForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function EditToolPage() {
  return (
    <>
      <EditToolForm />
    </>
  );
}

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'ja', ['common'])),
    },
  };
}

export default EditToolPage;
