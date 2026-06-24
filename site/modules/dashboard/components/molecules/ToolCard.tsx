import React from 'react';
import Link from 'next/link';
import { Tool } from '../../constants/tools';

interface ToolCardProps {
  tool: Tool;
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="5" x2="19" y1="12" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="w-[254px] h-[250px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07)] p-[20px] flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      {/* Upper part */}
      <div className="flex flex-col gap-[8px]">
        {/* Tool Name */}
        <h3 className="text-[18px] font-semibold leading-[24px] text-[#171a1f] dark:text-light tracking-[-0.45px] font-base truncate">
          {tool.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-[6px] items-center overflow-hidden h-[19px]">
          {/* Category (Outlined) */}
          <span className="border border-[#dee1e6] dark:border-midnight-800 text-[10px] font-semibold text-[#565d6d] dark:text-gray-300 rounded-[10px] px-[8px] h-[19px] flex items-center justify-center whitespace-nowrap">
            {tool.category}
          </span>

          {/* Roles (Solid) */}
          {tool.roles.slice(0, 2).map((role) => (
            <span
              key={role}
              className="bg-[#f3f4f6] dark:bg-midnight-850 text-[10px] font-medium text-[#565d6d] dark:text-gray-300 rounded-[6px] px-[6px] h-[19px] flex items-center justify-center whitespace-nowrap"
            >
              {role}
            </span>
          ))}

          {/* Extra count badge */}
          {tool.extraTagCount && tool.extraTagCount > 0 && (
            <span className="bg-[#f3f4f6] dark:bg-midnight-850 text-[10px] font-medium text-[#565d6d] dark:text-gray-300 rounded-[6px] px-[6px] h-[19px] flex items-center justify-center whitespace-nowrap">
              +{tool.extraTagCount}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal font-base line-clamp-3 mt-[4px]">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action */}
      <div className="flex flex-col gap-[12px]">
        <div className="border-t border-[#dee1e6] dark:border-midnight-800 w-full" />
        <Link href={`/tools/${tool.id}`} className="w-full">
          <button className="flex items-center justify-center gap-[8px] w-full h-[36px] bg-[#5570f6] text-white hover:bg-primary-600 rounded-[6px] font-base font-medium text-[14px] shadow-sm transition-all duration-200">
            <span>ツールを起動</span>
            <ArrowRightIcon />
          </button>
        </Link>
      </div>
    </div>
  );
}
