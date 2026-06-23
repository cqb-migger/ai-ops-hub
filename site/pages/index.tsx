// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import { Toaster } from 'react-hot-toast';

import Footer from '@base/components/organisms/Footer';
import Header from '@base/components/organisms/Header';
import PageTemplate from '@base/components/templates/PageTemplate';
import EarthSection from '../modules/home/components/organisms/EarthSection';
import FeatureSection from '../modules/home/components/organisms/FeatureSection';
import Hero from '../modules/home/components/organisms/Hero';
import WhatIsZikJobSection from '../modules/home/components/organisms/WhatIsZikJobSection';
import EcosystemSection from '../modules/home/components/organisms/EcosystemSection';
import RoadmapSection from '../modules/home/components/organisms/RoadmapSection';
import InvestorSection from '../modules/home/components/organisms/InvestorSection';
import PartnerSection from '../modules/home/components/organisms/PartnerSection';
import CommunitySection from '../modules/home/components/organisms/CommunitySection';
import SubscriptionSection from '../modules/home/components/organisms/SubscriptionSection';

function HomePage() {
  return (
    <PageTemplate header={<Header />} footer={<Footer />}>
      <main>
        <Hero />
        <EarthSection />
        <WhatIsZikJobSection />
        <FeatureSection />
        <EcosystemSection />
        <RoadmapSection />
        <InvestorSection />
        <PartnerSection />
        <CommunitySection />
        <SubscriptionSection />
        <Toaster />
      </main>
    </PageTemplate>
  );
}

export default HomePage;
