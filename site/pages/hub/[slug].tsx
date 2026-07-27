import React from 'react';
import { useRouter } from 'next/router';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import CategoryHubView from '../../modules/hub/components/organisms/CategoryHubView';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function CategoryHubPage() {
  const router = useRouter();
  const { slug } = router.query;
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  return (
    <>
      {slugStr ? <CategoryHubView slug={slugStr} /> : null}
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

export default CategoryHubPage;
