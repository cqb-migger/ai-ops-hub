import routes from '@base/configs/routers';
import Link from 'next/link';

function Logo() {
  return (
    <Link href={routes.path.home}>
      <span className="text-xl font-bold text-primary dark:text-light cursor-pointer">Logo</span>
    </Link>
  );
}

export default Logo;
