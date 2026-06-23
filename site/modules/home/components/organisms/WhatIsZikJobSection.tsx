import whatIsZikjobImg from '@public/assets/images/what-is-zikjob.png';
import Image from 'next/image';
import WaveList from '../molecules/WaveList';

function WhatIsZikJobSection() {
  return (
    <section className="section mt-16 lg:mt-0">
      <div className="container grid lg:mb-20 lg:grid-cols-2 gap-[30px] lg:gap-[137px] items-center">
        <div>
          <h2 className="text-xl lg:text-5xl font-semibold mb-4 lg:mb-6">
            What is <strong className="text-primary">ZIKJOB?</strong>
          </h2>
          <p className="leading-[1.75] mb-[20px]">
            ZIKJOB is a recruiting and career development platform that enables
            digital citizens to network and share trustworthy and transparent
            information via quality profiles.
          </p>
          <p className="leading-[1.75]">
            Based on users&#39; achievements stored in the ZIKJOB platform, ZIK
            Profile not only helps people seize their dream jobs, but also
            expands their network for sharing and learning new knowledge, skills
            in the Metaverse world.
          </p>
        </div>
        <figure>
          <Image src={whatIsZikjobImg} alt="what-is-zikjob" />
        </figure>
      </div>
      <div
        className="wave hidden lg:block bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url('assets/images/wavy-bg.png')` }}
      >
        <div className="container">
          <WaveList />
        </div>
      </div>
    </section>
  );
}

export default WhatIsZikJobSection;
