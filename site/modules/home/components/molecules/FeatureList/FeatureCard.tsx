import { FeatureItem } from '../../../types';

interface Props {
  feature: FeatureItem;
  toggleFeature: (item: FeatureItem) => void;
}

function FeatureCard({ feature, toggleFeature }: Props) {
  return (
    <li
      className={`feature__item cursor-pointer ${
        feature.active ? 'active' : ''
      }`}
      slide-for={feature.name}
      onClick={() => toggleFeature(feature)}
    >
      <div className="feature__link">
        <figure>
          <feature.img />
        </figure>
        <h3>{feature.label}</h3>
      </div>
    </li>
  );
}

export default FeatureCard;
