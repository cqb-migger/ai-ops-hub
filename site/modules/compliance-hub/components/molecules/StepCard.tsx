import React from 'react';
import { Step } from '../../constants/steps';
import { API_BASE } from '../../../../base/utils/api';
import { useTranslation } from 'next-i18next';

interface StepCardProps {
  step: Step;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function StepCard({ step, onEdit, onDelete, canDelete }: StepCardProps) {
  const { t } = useTranslation('common');
  return (
    <div className="group relative flex flex-col items-center text-center max-w-[200px] w-full select-none">
      
      {/* Circle Icon and Buttons container */}
      <div className="relative">
        {/* Circle Icon */}
        <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full border-4 border-white dark:border-midnight-950 bg-[#f1f4fe] dark:bg-midnight-900 shadow-sm z-10 transition-all duration-200 group-hover:scale-105 overflow-hidden">
          {step.icon && (step.icon.startsWith('data:image/') || step.icon.startsWith('http') || step.icon.startsWith('/')) ? (
            <img src={step.icon.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${step.icon}` : step.icon} alt={step.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[28px]" role="img" aria-label={step.title}>
              {step.icon}
            </span>
          )}
        </div>

        {/* Floating Action Buttons (Visible on Hover) */}
        <div className="absolute -top-[8px] -right-[36px] flex flex-col gap-[4px] opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[4px] group-hover:translate-x-0 z-20">
          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title={t('common.edit') as string}
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
              title={t('common.delete') as string}
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
              title={t('compliance.lastStepDeleteError', '最後のステップは削除できません') as string}
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
      <div className="relative w-full mt-[8px]">
        <p 
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-all',
          }}
          className="text-[12px] leading-[17px] text-[#565d6d] dark:text-gray-400 font-normal pr-[12px]"
        >
          {step.description}
        </p>

        {/* Custom Ellipsis Trigger for Tooltip */}
        {step.description.length > 25 && (
          <div className="absolute bottom-0 right-0 bg-[#fafafb] dark:bg-[#151c2c] pl-[4px] flex items-center group/dots cursor-pointer select-none z-20">
            {/* The Ellipsis span */}
            <span className="text-[12px] font-bold text-[#565d6d] dark:text-gray-400 group-hover/dots:text-[#5570f6] dark:group-hover/dots:text-[#7c91eb] transition-colors leading-[17px]">
              ...
            </span>

            {/* Tooltip popping up relative to the ellipsis */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[8px] hidden group-hover/dots:block w-[240px] p-[12px] bg-[#171a1f] dark:bg-[#1c2230] text-white dark:text-light text-[12px] leading-[18px] rounded-[8px] shadow-xl z-30 text-left font-normal border border-[#dee1e6] dark:border-midnight-800 break-all pointer-events-none">
              {step.description}
              {/* Tooltip arrow pointing to the ellipsis */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-[#171a1f] dark:border-t-[#1c2230]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
