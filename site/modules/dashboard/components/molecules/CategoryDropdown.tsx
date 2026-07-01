import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '../../constants/tools';

export interface CategoryDropdownProps {
  selectedCategory?: string;
  onCategoryChange: (val: string) => void;
  /** Custom category list. Defaults to CATEGORIES (without the "all" item). */
  categories?: string[];
  /** Fixed trigger width, default 200px */
  width?: number;
  placeholder?: string;
}

// Real categories without the "すべてのカテゴリ" string
const REAL_CATEGORIES = CATEGORIES.filter((c) => c !== 'すべてのカテゴリ');

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

/**
 * Custom category dropdown.
 * - Dropdown list chỉ gồm các category thực (không có option "all").
 * - Khi chưa chọn (value = ''), hiển thị placeholder và chevron ▾.
 * - Khi đã chọn, hiển thị label (truncated nếu dài) và nút clear ×.
 * - Width cố định (default 200px).
 */
export default function CategoryDropdown({
  selectedCategory = '',
  onCategoryChange,
  categories,
  width = 200,
  placeholder = 'すべてのカテゴリ',
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const list = categories ?? REAL_CATEGORIES;
  const hasCategory = selectedCategory !== '';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(value: string) {
    onCategoryChange(value);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onCategoryChange('');
  }

  return (
    <div ref={ref} className="relative" style={{ flex: `0 0 ${width}px`, width }}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%' }}
        className={`flex items-center h-[40px] pl-[12px] pr-[8px] rounded-[6px] border text-[14px] font-medium transition-all select-none overflow-hidden ${
          hasCategory
            ? 'bg-[#eef0fd] dark:bg-[#2a3060] border-[#5570f6] dark:border-[#5570f6]/60 text-[#5570f6] dark:text-[#7c91eb]'
            : 'bg-white dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] dark:hover:border-midnight-700'
        }`}
      >
        {/* Label — truncate khi dài */}
        <span
          className={`flex-1 min-w-0 truncate text-left ${
            hasCategory ? 'text-[#5570f6] dark:text-[#7c91eb] font-semibold' : ''
          }`}
        >
          {hasCategory ? selectedCategory : placeholder}
        </span>

        {/* Clear × khi đã chọn, chevron ▾ khi mặc định */}
        {hasCategory ? (
          <span
            role="button"
            onClick={handleClear}
            title="クリア"
            className="flex-shrink-0 ml-[6px] flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#5570f6]/15 hover:bg-[#5570f6]/30 text-[#5570f6] dark:text-[#7c91eb] transition-colors"
          >
            <XIcon size={11} />
          </span>
        ) : (
          <span className="flex-shrink-0 ml-[6px] text-[#9095a0] dark:text-gray-500">
            <ChevronIcon />
          </span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] shadow-[0_4px_16px_rgba(23,26,31,0.12)] py-[4px] overflow-hidden">
          {list.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelect(cat)}
              className={`w-full flex items-center justify-between gap-[8px] px-[12px] py-[8px] text-[14px] text-left transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#eef0fd] dark:bg-[#2a3060] text-[#5570f6] dark:text-[#7c91eb] font-semibold'
                  : 'text-[#171a1f] dark:text-light hover:bg-[#fafafb] dark:hover:bg-midnight-800'
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <span className="text-[#5570f6] dark:text-[#7c91eb]">
                  <CheckIcon />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
