import React, { useState, useRef, useEffect } from 'react';

interface ComboboxProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  widthClass?: string;
}

export default function Combobox({
  value,
  onChange,
  options,
  placeholder = '選択してください',
  className = '',
  widthClass = 'w-[192px]',
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${widthClass} h-[40px] z-10 ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] text-[#171a1f] dark:text-light px-[12px] pr-[32px] flex items-center justify-between outline-none font-base cursor-pointer hover:bg-gray-50 dark:hover:bg-midnight-850 transition-colors"
      >
        <span className="truncate">{value || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400 pointer-events-none transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-[4px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] shadow-lg z-50 flex flex-col overflow-hidden">
          {/* Search Input inside Dropdown */}
          <div className="p-[8px] border-b border-[#dee1e6] dark:border-midnight-800 bg-gray-50 dark:bg-midnight-950">
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-[32px] px-[8px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[4px] text-[13px] outline-none focus:border-[#5570f6] dark:focus:border-primary-400 text-[#171a1f] dark:text-light transition-colors"
            />
          </div>
          {/* Options List */}
          <ul className="max-h-[190px] overflow-y-auto list-none m-0 px-0 py-[4px] scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`px-[12px] py-[8px] text-[14px] leading-[20px] text-[#171a1f] dark:text-light cursor-pointer transition-colors duration-150 font-base truncate ${
                    option === value
                      ? 'bg-[#eff6ff] text-[#5570f6] font-semibold dark:bg-[#5570f6]/20 dark:text-primary-400'
                      : 'hover:bg-gray-50 dark:hover:bg-midnight-800'
                  }`}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-[12px] py-[12px] text-[13px] text-gray-400 dark:text-gray-500 text-center font-base">
                一致する結果はありません
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
