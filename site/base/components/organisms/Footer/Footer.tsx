import Logo from '@base/components/molecules/Logo';
import routes from '@base/configs/routers';
import Link from 'next/link';
import FooterSocialList from './FooterSocialList';

function Footer() {
  return (
    <footer className="footer bg-light dark:bg-dark pt-12 pb-12">
      <div className="container">
        <div className="footer__top grid grid-cols-[75%_25%] lg:items-center">
          <nav className="footer__navbar lg:grid lg:grid-cols-[33%_67%]">
            <figure className="footer__logo mb-4">
              <Logo />
            </figure>
            <ul className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:items-center justify-start lg:justify-center">
              <li>
                <Link href={routes.path.home}>Home</Link>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="https://docs.zikjob.com">Whitepaper</a>
              </li>
            </ul>
          </nav>
          <FooterSocialList />
        </div>
        <div className="mt-8 lg:mt-4 text-[#767676] text-xs text-center">
          <p>©2022 ZIKJOB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
