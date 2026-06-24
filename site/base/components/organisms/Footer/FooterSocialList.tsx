import FooterSocialItem from './FooterSocialItem';

function FooterSocialList() {
  const socials = [
    {
      name: 'Telegram',
      link: 'https://t.me/zikjob_global_chat',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/zikjob',
    },
    {
      name: 'Discord',
      link: 'https://discord.gg/QqcT2Y4XST',
    },
    {
      name: 'Facebook',
      link: 'https://facebook.com/zikjob',
    },
    {
      name: 'Medium',
      link: 'https://medium.com/@zikjobglobal',
    },
  ];

  return (
    <ul className="footer__social flex flex-col lg:flex-row gap-3 lg:gap-4 items-end lg:items-center justify-start lg:justify-end text-sm text-gray-500 dark:text-gray-400">
      {socials.map((social, index) => (
        <FooterSocialItem key={index} social={social} />
      ))}
    </ul>
  );
}

export default FooterSocialList;
