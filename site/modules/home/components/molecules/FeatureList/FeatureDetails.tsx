import { FeatureItem } from '../../../types';

interface Props {
  features: FeatureItem[];
}

function FeatureDetails({ features }: Props) {
  return (
    <div className="hidden lg:block feature__detail lg:w-[35%] mb-[20px] lg:mb-0">
      <div className="feature__detail__list relative">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`feature__detail__item ${feature.name} slide ${
              feature.active ? 'opacity-100 translate-x-0' : 'opacity-0'
            }`}
          >
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureDetails;
