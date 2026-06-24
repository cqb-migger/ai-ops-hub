import routes from '@base/configs/routers';
import useMenuStore from '@base/stores/useMenuStore';
import Link from 'next/link';
import MobileMenuButton from '../molecules/Button/MobileMenuButton';
import ThemeButton from '../molecules/Button/ThemeButton';
import Logo from '../molecules/Logo';
import Menu from '../molecules/Menu';

function Header() {
  const [isMobileMenuActive, setIsMobileMenuActive] = useMenuStore((state) => [
    state.isMobileMenuActive,
    state.setIsMobileMenuActive,
  ]);

  return (
    <header className="header bg-light dark:bg-dark sticky z-[1010] top-0 px-4 py-3 lg:px-8 lg:py-4">
      <div className="flex items-center">
        <h1 className="inline-flex items-start">
          <Logo />
          <span className="bg-red-500 text-xs text-white px-2 py-1 rounded-2xl">
            Testnet
          </span>
        </h1>
        <nav
          className={`header__nav ${
            isMobileMenuActive ? 'flex flex-col justify-between' : 'hidden'
          } lg:flex lg:flex-auto lg:justify-end items-center`}
        >
          <Menu />
          <div className="header__buttons flex">
            <Link
              className="btn btn-primary"
              href="#"
              onClick={() => setIsMobileMenuActive(false)}
            >
              ZIK Profile
            </Link>
            <Link
              className="btn btn-outline lg:ml-4"
              href={routes.path.home}
              onClick={() => setIsMobileMenuActive(false)}
            >
              For Employers
            </Link>
            <ThemeButton />
          </div>
        </nav>
        <MobileMenuButton />
      </div>
    </header>
  );
}

export default Header;
