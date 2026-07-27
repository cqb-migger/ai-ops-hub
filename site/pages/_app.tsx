import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '@base/stores/useAuthStore';
import useAppConfigStore from '@base/stores/useAppConfigStore';
import PageTemplate from '@base/components/templates/PageTemplate';
import DashboardFooter from '@base/components/organisms/DashboardFooter';
import '../styles/index.scss';

function ZikJobApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);

  const fetchConfig = useAppConfigStore((state) => state.fetchConfig);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load app branding (name/logo) once on startup — public endpoint, works pre-login.
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    if (!hydrated) return;

    const publicPages = ['/login'];
    const path = router.pathname;
    const isPublic = publicPages.includes(path);

    if (!token && !isPublic) {
      router.push('/login');
    } else if (token && isPublic) {
      router.push('/');
    } else if (token && !isPublic) {
      // Check Admin-only pages
      const adminPages = ['/manage-tools', '/users'];
      const isAdminPage = adminPages.some((p) => path.startsWith(p));
      if (isAdminPage && user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [hydrated, token, router, user]);

  const publicPages = ['/login'];
  const isPublic = publicPages.includes(router.pathname);

  // Prevent rendering protected content during hydration or when unauthorized
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-midnight-950 flex items-center justify-center text-gray-500 font-sans">
        Loading...
      </div>
    );
  }

  if (!token && !isPublic) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-midnight-950 flex items-center justify-center text-gray-500 font-sans">
        Redirecting to login...
      </div>
    );
  }

  const content = <Component {...pageProps} />;
  const layout = isPublic ? content : (
    <PageTemplate footer={<DashboardFooter />}>
      {content}
    </PageTemplate>
  );

  return (
    <>
      {layout}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default appWithTranslation(ZikJobApp);
