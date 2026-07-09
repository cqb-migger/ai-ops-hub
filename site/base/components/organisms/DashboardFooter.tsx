import React from 'react';
import { useTranslation } from 'next-i18next';

export default function DashboardFooter() {
  const { t } = useTranslation('common');
  return (
    <footer className="flex items-center justify-center h-[69px] bg-white dark:bg-midnight-900 border-t border-[#dee1e6] dark:border-midnight-800">
      <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
        {t('footer.copyright', '© 2026 AI Navigator. All rights reserved.')}
      </p>
    </footer>
  );
}
