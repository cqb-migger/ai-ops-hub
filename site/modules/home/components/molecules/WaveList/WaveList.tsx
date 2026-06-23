import icon1Img from '@public/assets/images/icon-1.png';
import icon2Img from '@public/assets/images/icon-2.png';
import icon3Img from '@public/assets/images/icon-3.png';
import symbol1Img from '@public/assets/images/symbol-1.png';
import symbol2Img from '@public/assets/images/symbol-2.png';
import symbol3Img from '@public/assets/images/symbol-3.png';
import WaveItem from './WaveItem';

function WaveList() {
  const waves = [
    {
      name: 'polygon',
      text: 'Polygon',
      href: 'https://polygon.technology',
      img: icon1Img,
      symbol: symbol1Img,
    },
    {
      name: 'bsc',
      text: 'BSC',
      href: 'https://polygon.technology',
      img: icon2Img,
      symbol: symbol2Img,
    },
    {
      name: 'solana',
      text: 'Solana',
      href: 'https://polygon.technology',
      img: icon3Img,
      symbol: symbol3Img,
    },
  ];
  return (
    <ul className="wave__list">
      {waves.map((wave, index) => (
        <WaveItem key={index} wave={wave} />
      ))}
    </ul>
  );
}

export default WaveList;
