import useMenuStore from '@base/stores/useMenuStore';

function MobileMenuButton() {
  const [isMobileMenuActive, setIsMobileMenuActive] = useMenuStore((state) => [
    state.isMobileMenuActive,
    state.setIsMobileMenuActive,
  ]);
  const clickMobileMenu = () => {
    setIsMobileMenuActive(!isMobileMenuActive);
  };

  return (
    <button
      className={`items-center justify-center btn-menu lg:!hidden ml-auto text-3xl ${
        isMobileMenuActive ? 'active' : ''
      }`}
      onClick={clickMobileMenu}
    >
      <strong className="fs-nav-open text-primary dark:text-light">
        ☰
      </strong>
      <strong className="fs-nav-close text-gray-900 dark:text-light">
        ✕
      </strong>
    </button>
  );
}

export default MobileMenuButton;
