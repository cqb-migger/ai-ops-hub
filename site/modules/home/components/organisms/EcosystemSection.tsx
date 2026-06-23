import useThemeStore from '@base/stores/useThemeStore';
import { isDark } from '@base/utils';
import { EcosystemDark, EcosystemLight } from '@public/assets/svg';

function EcosystemSection() {
  const theme = useThemeStore((state) => state.theme);
  return (
    <section className="section">
      <div className="container">
        <h2 className="section__title">
          <strong className="text-primary">ZIKJOB</strong> ecosystem model
        </h2>
        <figure>
          {isDark(theme) ? <EcosystemDark /> : <EcosystemLight />}
        </figure>
      </div>
    </section>
  );
}

export default EcosystemSection;
