import { PartnerSVG } from '@public/assets/svg';

function InvestorSection() {
  const investors = [
    {
      name: 'partner-coming-soon',
      href: '#',
      img: PartnerSVG,
    },
    {
      name: 'partner-coming-soon',
      href: '#',
      img: PartnerSVG,
    },
    {
      name: 'partner-coming-soon',
      href: '#',
      img: PartnerSVG,
    },
    {
      name: 'partner-coming-soon',
      href: '#',
      img: PartnerSVG,
    },
    {
      name: 'partner-coming-soon',
      href: '#',
      img: PartnerSVG,
    },
  ];
  return (
    <section className="section partner">
      <div className="container">
        <h2 className="section__title mb-5 lg:mb-[50px]">Our Investors</h2>
        <ul className="partner__list">
          {investors.map((investor, index) => (
            <li key={index} className="partner__item">
              <a href={investor.href} className="partner__item-inner">
                <investor.img />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default InvestorSection;
