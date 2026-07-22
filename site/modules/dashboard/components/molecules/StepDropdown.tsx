import React, { useState, useRef, useEffect } from 'react';
import { Step } from '../../../compliance-hub/constants/steps';
import { useTranslation } from 'next-i18next';

export interface StepDropdownProps {
  selectedStep?: string;
  onStepChange: (val: string) => void;
  steps: Step[];
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

export default function StepDropdown({
  selectedStep = '',
  onStepChange,
  steps,
  width = 200,
  placeholder,
}: StepDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

  const hasStep = selectedStep !== '';
  const selectedLabel = steps.find((s) => s.id === selectedStep)?.title ?? null;

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

  function handleSelect(value: string) {
    onStepChange(value);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onStepChange('');
  }

  return (
    <div ref={ref} className="relative w-full sm:w-[var(--dd-w)] sm:flex-none" style={{ '--dd-w': `${width}px` } as React.CSSProperties}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%' }}
        className={`flex items-center h-[40px] pl-[12px] pr-[8px] rounded-[6px] border text-[14px] font-medium transition-all select-none overflow-hidden ${
          hasStep
            ? 'bg-[#eef0fd] dark:bg-[#2a3060] border-[#5570f6] dark:border-[#5570f6]/60 text-[#5570f6] dark:text-[#7c91eb]'
            : 'bg-white dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 text-[#565d6d] dark:text-gray-400 hover:border-[#9095a0] dark:hover:border-midnight-700'
        }`}
      >
        {/* Label — truncate khi dài */}
        <span
          className={`flex-1 min-w-0 truncate text-left ${
            hasStep ? 'text-[#5570f6] dark:text-[#7c91eb] font-semibold' : ''
          }`}
        >
          {selectedLabel ?? (placeholder || t('filter.allSteps'))}
        </span>

        {/* Clear × khi đã chọn step, chevron ▾ khi mặc định */}
        {hasStep ? (
          <span
            role="button"
            onClick={handleClear}
            title={t('common.clear', 'クリア') as string}
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
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] shadow-[0_4px_16px_rgba(23,26,31,0.12)] py-[4px]">
          {steps.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`group/item relative w-full flex items-center justify-between gap-[8px] px-[12px] py-[8px] text-[14px] text-left transition-colors ${
                selectedStep === opt.id
                  ? 'bg-[#eef0fd] dark:bg-[#2a3060] text-[#5570f6] dark:text-[#7c91eb] font-semibold'
                  : 'text-[#171a1f] dark:text-light hover:bg-[#fafafb] dark:hover:bg-midnight-800'
              }`}
            >
              <span className="truncate flex-1 min-w-0">{opt.title}</span>
              {selectedStep === opt.id && (
                <span className="flex-shrink-0 text-[#5570f6] dark:text-[#7c91eb]">
                  <CheckIcon />
                </span>
              )}
              {/* Custom Tooltip */}
              {opt.title.length > 15 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[8px] hidden group-hover/item:block w-max max-w-[240px] p-[10px] bg-[#171a1f] dark:bg-[#1c2230] text-white dark:text-light text-[12px] leading-[18px] rounded-[8px] shadow-xl z-[60] text-left font-normal border border-[#dee1e6] dark:border-midnight-800 break-all pointer-events-none whitespace-normal">
                  {opt.title}
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
