import {
  ELearningSVG,
  JobSVG,
  MetaverseSVG,
  NftSVG,
  ProfileSVG,
} from '@public/assets/svg';
import { useState } from 'react';
import { FeatureItem } from '../../types';
import {
  FeatureDetails,
  FeatureList,
  FeatureListMobile,
} from '../molecules/FeatureList';

function FeatureSection() {
  const initFeatures = [
    {
      name: 'profile',
      label: 'ZIK Profile',
      title: 'Career development via ZIK profile',
      description: `ZIK is a profile that replaces the traditional CV when it includes
      comprehensive and complete information from candidates' CV with
      portfolio and implemented projects verified by ZIK team's members,
      therefore boosting the transparency and reliability.`,
      img: ProfileSVG,
      active: true,
    },
    {
      name: 'metaverse',
      label: 'Metaverse Networking',
      title: 'Share and to be shared in Metaverse',
      description: `Users may seek advice or guidance from other ZIKJOB members via
      Meeting in the Metaverse. Members' competencies are published in
      their ZIK profile, which enables users to readily reach the right
      mentors with the relevant experience.`,
      img: MetaverseSVG,
      active: false,
    },
    {
      name: 'job',
      label: 'Job Opportunities',
      title: 'Seeking job opportunities',
      description: `Users can access a variety of jobs on a single platform rather than
      different websites; the material on the page is also pre-filtered to
      avoid duplication, and of course, users can always find a job for
      free.`,
      img: JobSVG,
      active: false,
    },
    {
      name: 'e-learning',
      label: 'Enriched Resource',
      title: 'Enrich your professionalism',
      description: `ZIKJOB offers online courses as well as specialized materials
      from the community to provide users with additional learning
      tools and opportunities to enhance their professional skills.`,
      img: ELearningSVG,
      active: false,
    },
    {
      name: 'nft',
      label: 'NFT Marketplace',
      title: 'Enrich your professionalism',
      description: `ZIKJOB offers online courses as well as specialized materials from
      the community to provide users with additional learning tools and
      opportunities to enhance their professional skills.`,
      img: NftSVG,
      active: false,
    },
  ] as FeatureItem[];
  const [features, setFeatures] = useState(initFeatures);
  const toggleFeature = (feature: FeatureItem) => {
    const newFeatures = [...features].map((item) => {
      if (item.active) {
        item.active = false;
      }

      if (item.name == feature.name) {
        item.active = true;
      }

      return item;
    }) as FeatureItem[];

    setFeatures(newFeatures);
  };

  return (
    <section className="section">
      <div className="container xl:max-w-none mb-5 lg:mb-[50px]">
        <h2 className="section__title">
          What can you do on <strong className="text-primary">ZIKJOB?</strong>
        </h2>
      </div>
      <div className="container flex flex-col lg:flex-row feature">
        <FeatureList features={features} toggleFeature={toggleFeature} />
        <FeatureDetails features={features} />
        <FeatureListMobile features={features} />
      </div>
    </section>
  );
}

export default FeatureSection;
