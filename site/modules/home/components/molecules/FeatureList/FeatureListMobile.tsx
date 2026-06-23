import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FeatureItem } from '../../../types';
import FeatureCardMobile from './FeatureCardMobile';

interface Props {
  features: FeatureItem[];
}

function FeatureListMobile({ features }: Props) {
  return (
    <Swiper
      spaceBetween={40}
      pagination={{
        bulletClass: 'swiper-pagination-bullet dark:bg-midnight-300',
        bulletActiveClass: 'swiper-pagination-bullet-active dark:!bg-light',
      }}
      modules={[Pagination]}
      className="block lg:hidden w-full h-full"
    >
      {features.map((feature, index) => (
        <SwiperSlide key={index}>
          <FeatureCardMobile feature={feature} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default FeatureListMobile;
