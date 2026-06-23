import {
  SocialDiscord,
  SocialFacebook,
  SocialGithub,
  SocialMedium,
  SocialTelegram,
  SocialTwitter,
} from '@public/assets/svg';

function CommunitySection() {
  const communities = [
    {
      name: 'telegram',
      href: 'https://t.me/zikjob_global_chat',
      img: SocialTelegram,
      title: 'Telegram',
      description: 'Come and chat',
    },
    {
      name: 'twitter',
      href: 'https://twitter.com/zikjob',
      img: SocialTwitter,
      title: 'Twitter',
      description: '@zikjob',
    },
    {
      name: 'discord',
      href: 'https://discord.gg/QqcT2Y4XST',
      img: SocialDiscord,
      title: 'Discord',
      description: 'Meet the community',
    },
    {
      name: 'facebook',
      href: 'https://facebook.com/zikjob',
      img: SocialFacebook,
      title: 'Facebook',
      description: 'Like and share',
    },
    {
      name: 'medium',
      href: 'https://medium.com/@zikjobglobal',
      img: SocialMedium,
      title: 'Medium',
      description: 'News updates',
    },
    {
      name: 'github',
      href: 'https://github.com/zikjob-labs',
      img: SocialGithub,
      title: 'Github',
      description: 'The code behind ZIKJOB',
    },
  ];
  return (
    <section className="section community">
      <div className="container">
        <h2 className="section__title mb-5 lg:mb-[50px]">Join the community</h2>
        <ul className="community__list">
          {communities.map((community, index) => (
            <li key={index} className="community__item">
              <a href={community.href} className="community__item-link">
                <figure>
                  <community.img />
                </figure>
                <h3>{community.title}</h3>
                <span>{community.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CommunitySection;
