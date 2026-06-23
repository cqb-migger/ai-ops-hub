import heroImg from '@public/assets/images/hero.png';
import Image from 'next/image';

function Hero() {
  return (
    <section
      className={`hero bg-no-repeat bg-bottom bg-cover`}
      style={{ backgroundImage: `url('assets/images/gradient-gray-bg.png')` }}
    >
      <div className="container flex flex-col lg:flex-row items-center">
        <figure className="mb-5 lg:mb-0 lg:w-[30%]">
          <Image src={heroImg} alt="hero-section" />
        </figure>
        <div className="lg:w-[70%] lg:pl-8">
          <h2 className="text-2xl lg:text-5xl font-semibold">
            Decentralized network for
            <br />
            <span className="text-primary">Career Opportunities</span>
          </h2>
          <p className="lg:text-2xl font-normal whitespace-pre-line mt-2 lg:mt-5">
            Leave your footprint on the Metaverse using new generation of
            digital profile
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
