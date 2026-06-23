import { FunctionComponent, SVGProps } from 'react';

interface Props {
  social: {
    link: string;
    src: FunctionComponent<SVGProps<SVGSVGElement>>;
    name: string;
  };
}
function FooterSocialItem({ social }: Props) {
  return (
    <li>
      <a href={social.link}>
        <social.src className="w-6 h-6 lg:w-8 lg:h-8" />
      </a>
    </li>
  );
}

export default FooterSocialItem;
