import useThemeStore from '@base/stores/useThemeStore';
import { isDark } from '@base/utils';
import {
  CoinGeckoDarkPartner,
  CoinGeckoLightPartner,
  CoinMarketCapDarkPartner,
  CoinMarketCapLightPartner,
} from '@public/assets/svg';

function PartnerSection() {
  const theme = useThemeStore((state) => state.theme);
  const partners = [
    {
      name: 'coinmarketcap',
      href: 'https://coinmarketcap.com/currencies/zikjob',
      img: isDark(theme) ? CoinMarketCapLightPartner : CoinMarketCapDarkPartner,
    },
    {
      name: 'coingecko',
      href: '#',
      img: isDark(theme) ? CoinGeckoLightPartner : CoinGeckoDarkPartner,
    },
  ];
  return (
    <section className="section partner">
      <div className="container">
        <h2 className="section__title mb-5 lg:mb-[50px]">Our Partners</h2>
        <ul className="partner__list">
          {partners.map((partner, index) => (
            <li key={index} className="partner__item">
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer"
                className="partner__item-inner"
              >
                <partner.img />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PartnerSection;
