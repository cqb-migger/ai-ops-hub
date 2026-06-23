import Image, { StaticImageData } from 'next/image';

interface Props {
  wave: {
    name: string;
    text: string;
    href: string;
    img: StaticImageData;
    symbol: StaticImageData;
  };
}

function WaveItem({ wave }: Props) {
  return (
    <>
      <li className="wave__item">
        <a href={wave.href}>
          <Image src={wave.img} alt={`${wave.name}-platform`} />
          <strong>{wave.text}</strong>
        </a>
      </li>
      <li className="wave__item wave__item--symbol">
        <figure>
          <Image src={wave.symbol} alt="polygon-symbol" />
        </figure>
      </li>
    </>
  );
}

export default WaveItem;
