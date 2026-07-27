import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { translateRole } from '../../../../base/utils/labels';
import { useRoles } from '../../../../base/hooks/useRoles';

export interface RoleDropdownProps {
  selectedRole?: string;
  onRoleChange: (val: string) => void;
  /** Fixed trigger width, default 200px */
  width?: number;
  placeholder?: string;
}

function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 14, height: 14, flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 13, height: 13, flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function RoleDropdown({
  selectedRole = '',
  onRoleChange,
  width = 200,
  placeholder,
}: RoleDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation('common');
  const { roles } = useRoles();
  const hasRole = selectedRole !== '';
  const selectedOption = roles.find((r) => r.code === selectedRole);
  const selectedLabel = selectedOption ? translateRole(selectedOption.code, t, roles) : null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (val: string) => {
    onRoleChange(val);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRoleChange('');
  };

  const actualPlaceholder = placeholder || t('filter.allRoles', 'すべての役割');

  return (
    <div className="relative" ref={ref} style={{ width }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between h-[36px] px-[16px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-gray-50 dark:hover:bg-midnight-800 transition-colors"
      >
        <div className="flex items-center min-w-0 flex-1">
          {hasRole ? (
            <span className="text-[14px] font-medium text-[#171a1f] dark:text-light truncate font-base leading-none">
              {selectedLabel}
            </span>
          ) : (
            <span className="text-[14px] font-medium text-[#565d6d] dark:text-gray-400 font-base leading-none truncate">
              {actualPlaceholder}
            </span>
          )}
        </div>
        <div className="flex-shrink-0 flex items-center gap-[6px] ml-[8px]">
          {hasRole && (
            <div
              onClick={handleClear}
              className="text-[#9095a0] dark:text-gray-400 hover:text-[#171a1f] dark:hover:text-light transition-colors"
              title={t('filter.clearRole', 'クリア') as string}
            >
              <XIcon />
            </div>
          )}
          <div className="text-[#9095a0] dark:text-gray-400">
            <ChevronIcon />
          </div>
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-[4px] w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-lg z-50 py-[8px]">
          <div className="max-h-[280px] overflow-y-auto overflow-x-hidden">
            {roles.map((opt) => {
              const isSelected = selectedRole === opt.code;
              const roleName = translateRole(opt.code, t, roles);
              return (
                <button
                  key={opt.code}
                  onClick={() => handleSelect(opt.code)}
                  className="w-full flex items-center justify-between px-[16px] py-[8px] hover:bg-[#f3f6fd] dark:hover:bg-midnight-800 transition-colors group relative"
                  title={roleName.length > 15 ? roleName : undefined}
                >
                  <span className="text-[14px] text-[#171a1f] dark:text-light font-base text-left truncate flex-1 min-w-0">
                    {roleName}
                  </span>
                  {isSelected && (
                    <span className="flex-shrink-0 ml-[12px] text-[#395ce0] dark:text-[#5c77e6]">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
