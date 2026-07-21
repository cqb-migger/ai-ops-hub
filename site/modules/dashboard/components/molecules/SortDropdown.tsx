import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

export interface SortDropdownProps {
  /** Current sort value (e.g. 'name_asc' | 'favorite') */
  selectedSort: string;
  onSortChange: (val: string) => void;
  /** Fixed trigger width, default 200px */
  width?: number;
}

export const SORT_OPTIONS: { value: string; key: string }[] = [
  { value: 'name_asc', key: 'filter.sortOptions.nameAsc' },
  { value: 'favorite', key: 'filter.sortOptions.favorite' },
];

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
      <path d="M11 5h10" /><path d="M11 9h7" /><path d="M11 13h4" />
      <path d="m3 17 3 3 3-3" /><path d="M6 18V4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Sort dropdown — luôn có giá trị (mặc định name_asc).
 * Options: Tên A→Z, Yêu thích.
 */
export default function SortDropdown({ selectedSort, onSortChange, width = 200 }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

  const selectedOption = SORT_OPTIONS.find((o) => o.value === selectedSort) || SORT_OPTIONS[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(value: string) {
    onSortChange(value);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full sm:w-[var(--dd-w)] sm:flex-none" style={{ '--dd-w': `${width}px` } as React.CSSProperties}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%' }}
        className="flex items-center gap-[8px] h-[40px] pl-[12px] pr-[8px] rounded-[6px] border text-[14px] font-medium transition-all select-none overflow-hidden bg-white dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] dark:hover:border-midnight-700"
      >
        <span className="flex-shrink-0 text-[#9095a0] dark:text-gray-500">
          <SortIcon />
        </span>
        <span className="flex-1 min-w-0 truncate text-left">
          {t(selectedOption.key)}
        </span>
        <span className="flex-shrink-0 ml-[6px] text-[#9095a0] dark:text-gray-500">
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] shadow-[0_4px_16px_rgba(23,26,31,0.12)] py-[4px]">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`group/item relative w-full flex items-center justify-between gap-[8px] px-[12px] py-[8px] text-[14px] text-left transition-colors ${
                selectedSort === opt.value
                  ? 'bg-[#eef0fd] dark:bg-[#2a3060] text-[#5570f6] dark:text-[#7c91eb] font-semibold'
                  : 'text-[#171a1f] dark:text-light hover:bg-[#fafafb] dark:hover:bg-midnight-800'
              }`}
            >
              <span className="truncate flex-1 min-w-0">{t(opt.key)}</span>
              {selectedSort === opt.value && (
                <span className="flex-shrink-0 text-[#5570f6] dark:text-[#7c91eb]">
                  <CheckIcon />
                </span>
              )}
              {/* Custom Tooltip */}
              {t(opt.key).length > 15 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[8px] hidden group-hover/item:block w-max max-w-[240px] p-[10px] bg-[#171a1f] dark:bg-[#1c2230] text-white dark:text-light text-[12px] leading-[18px] rounded-[8px] shadow-xl z-[60] text-left font-normal border border-[#dee1e6] dark:border-midnight-800 break-all pointer-events-none whitespace-normal">
                  {t(opt.key)}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-[#171a1f] dark:border-t-[#1c2230]" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
