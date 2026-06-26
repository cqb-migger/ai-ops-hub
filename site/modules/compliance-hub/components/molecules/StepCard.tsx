import React from 'react';
import { Step } from '../../constants/steps';

interface StepCardProps {
  step: Step;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function StepCard({ step, onEdit, onDelete, canDelete }: StepCardProps) {
  return (
    <div className="group relative flex flex-col items-center text-center max-w-[200px] w-full select-none">
      
      {/* Circle Icon and Buttons container */}
      <div className="relative">
        {/* Circle Icon */}
        <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10 transition-all duration-200 group-hover:scale-105">
          <span className="text-[28px]" role="img" aria-label={step.title}>
            {step.icon}
          </span>
        </div>

        {/* Floating Action Buttons (Visible on Hover) */}
        <div className="absolute -top-[8px] -right-[36px] flex flex-col gap-[4px] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[4px] group-hover:translate-x-0 z-20">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="編集"
            className="w-[28px] h-[28px] flex items-center justify-center bg-white dark:bg-[#1c2230] border border-[#dee1e6] dark:border-midnight-800 rounded-full text-[#5570f6] dark:text-[#7c91eb] hover:bg-[#5570f6] hover:text-white dark:hover:bg-[#5570f6] dark:hover:text-white transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>

          {/* Delete Button */}
          {canDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="削除"
              className="w-[28px] h-[28px] flex items-center justify-center bg-white dark:bg-[#1c2230] border border-[#dee1e6] dark:border-midnight-800 rounded-full text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          ) : (
            <button
              disabled
              title="最後のステップは削除できません"
              className="w-[28px] h-[28px] flex items-center justify-center bg-gray-100 dark:bg-midnight-950 border border-gray-200 dark:border-[#1f2937] rounded-full text-gray-300 dark:text-midnight-800 cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Step Number Label */}
      <span className="mt-[16px] text-[12px] font-bold tracking-[0.6px] uppercase text-[#565d6d] dark:text-gray-400">
        Step {step.order}
      </span>

      {/* Step Title */}
      <span className="mt-[4px] text-[14px] font-bold text-[#171a1f] dark:text-light min-h-[20px]">
        {step.title}
      </span>

      {/* Step Description */}
      <p className="mt-[8px] text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal">
        {step.description}
      </p>
    </div>
  );
}
