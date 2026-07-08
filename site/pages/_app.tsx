import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import '../styles/index.scss';

function ZikJobApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(ZikJobApp);
