import earthImgWebP from '@public/assets/images/earth.webp';
import Image from 'next/image';

function EarthSection() {
  return (
    <section className="section hidden lg:block mt-5 !mb-24">
      <figure>
        <Image src={earthImgWebP} className="w-full" alt="hr-earth" />
      </figure>
    </section>
  );
}

export default EarthSection;
