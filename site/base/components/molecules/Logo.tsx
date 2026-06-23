import routes from '@base/configs/routers';
import { LogoSVG } from '@public/assets/svg';
import Link from 'next/link';

function Logo() {
  return (
    <Link href={routes.path.home}>
      <LogoSVG className="w-[134px] lg:w-[197px] text-primary dark:text-light" />
    </Link>
  );
}

export default Logo;
