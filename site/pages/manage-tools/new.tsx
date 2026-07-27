import React from 'react';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CreateToolForm from '../../modules/manage-tools/components/organisms/CreateToolForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function CreateToolPage() {
  return (
    <>
      <CreateToolForm />
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

export default CreateToolPage;

