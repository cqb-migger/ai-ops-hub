import React from 'react';

interface StepConnectorProps {
  onClick: () => void;
  disabled: boolean;
}

export default function StepConnector({ onClick, disabled }: StepConnectorProps) {
  if (disabled) {
    return (
      <div className="relative flex-1 md:h-[64px] h-[48px] w-full md:w-auto flex items-center justify-center select-none pointer-events-none">
        {/* Vertical Line on Mobile only, still visible when disabled */}
        <div className="block md:hidden absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#dee1e6] dark:bg-midnight-800 -translate-x-1/2 -z-10" />
        
        {/* Horizontal Line on Desktop only when disabled */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-[#dee1e6] dark:bg-midnight-800 -translate-y-1/2 -z-10" />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="relative flex-1 md:h-[64px] h-[48px] w-full md:w-auto flex items-center justify-center group cursor-pointer select-none"
    >
      {/* Vertical Line on Mobile only */}
      <div className="block md:hidden absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#dee1e6] dark:bg-midnight-800 -translate-x-1/2 -z-10 group-hover:bg-[#5570f6] transition-colors" />

      {/* Horizontal Line on Desktop only */}
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-[#dee1e6] dark:bg-midnight-800 -translate-y-1/2 -z-10 group-hover:bg-[#5570f6] transition-colors" />

      {/* Plus Button (centered in the gap container) */}
      <div className="w-[24px] h-[24px] rounded-full bg-[#5570f6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
    </div>
  );
}
