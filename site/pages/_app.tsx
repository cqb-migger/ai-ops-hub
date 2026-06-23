import { AppProps } from 'next/app';
import '../styles/index.scss';

function ZikJobApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default ZikJobApp;
