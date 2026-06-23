import {
  FooterDiscord,
  FooterFacebook,
  FooterMedium,
  FooterTelegram,
  FooterTwitter,
} from '@public/assets/svg';
import FooterSocialItem from './FooterSocialItem';

function FooterSocialList() {
  const socials = [
    {
      name: 'telegram',
      link: 'https://t.me/zikjob_global_chat',
      src: FooterTelegram,
    },
    {
      name: 'twitter',
      link: 'https://twitter.com/zikjob',
      src: FooterTwitter,
    },
    {
      name: 'discord',
      link: 'https://discord.gg/QqcT2Y4XST',
      src: FooterDiscord,
    },
    {
      name: 'facebook',
      link: 'https://facebook.com/zikjob',
      src: FooterFacebook,
    },
    {
      name: 'medium',
      link: 'https://medium.com/@zikjobglobal',
      src: FooterMedium,
    },
  ];

  return (
    <ul className="footer__social flex flex-col lg:flex-row gap-3 lg:gap-0 items-end lg:items-center justify-start lg:justify-end">
      {socials.map((social, index) => (
        <FooterSocialItem key={index} social={social} />
      ))}
    </ul>
  );
}

export default FooterSocialList;
