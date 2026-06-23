import { FeatureItem } from '../../../types';

interface Props {
  feature: FeatureItem;
}

function FeatureCardMobile({ feature }: Props) {
  return (
    <>
      <figure>
        <feature.img />
      </figure>
      <h3>{feature.label}</h3>
      <p>{feature.description}</p>
    </>
  );
}

export default FeatureCardMobile;
