import { FeatureItem } from '../../../types';
import FeatureCard from './FeatureCard';

interface Props {
  features: FeatureItem[];
  toggleFeature: (item: FeatureItem) => void;
}

function FeatureList({ features, toggleFeature }: Props) {
  return (
    <div className="hidden lg:block feature__right lg:w-[65%] lg:pr-32">
      <ul className="feature__list">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            feature={feature}
            toggleFeature={toggleFeature}
          />
        ))}
      </ul>
    </div>
  );
}

export default FeatureList;
