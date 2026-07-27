import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { API_BASE } from '@base/utils/api';
import useAuthStore from '@base/stores/useAuthStore';
import { Tool } from '../../../modules/dashboard/constants/tools';

interface DownloadToolsDropdownProps {
  /** Tools currently shown on screen; only those with guide files are listed. */
  tools: Tool[];
}

function DownloadIcon({ className = 'w-[16px] h-[16px]' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-[14px] h-[14px] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function DownloadToolsDropdown({ tools }: DownloadToolsDropdownProps) {
  const { t } = useTranslation('common');
  const token = useAuthStore((state) => state.token);
  const [open, setOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // List every tool on screen; the backend decides which actually have files.
  const downloadable = tools;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleDownloadTool = async (tool: Tool) => {
    setDownloadingId(tool.id);
    try {
      // Download all of this tool's guide files as a single ZIP.
      const params = new URLSearchParams();
      params.append('tool_id', String(tool.id));
      if (token) params.append('token', token);

      const res = await fetch(`${API_BASE}/tools/download-guides?${params.toString()}`);
      if (!res.ok) {
        toast.error(t('common.noDocsToDownload', 'ダウンロードできる資料がありません。'));
        return;
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const safeName = (tool.name || 'tool').replace(/[/\\]/g, '_');
      a.download = `${safeName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      setOpen(false);
    } catch (_) {
      toast.error(t('common.noDocsToDownload', 'ダウンロードできる資料がありません。'));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center gap-[6px] sm:gap-[8px] h-[36px] sm:h-[40px] px-[12px] sm:px-[16px] border border-[#dee1e6] dark:border-midnight-800 hover:border-[#5570f6] hover:text-[#5570f6] bg-white dark:bg-midnight-900 rounded-[8px] text-[13px] sm:text-[14px] font-semibold text-[#565d6d] dark:text-gray-400 transition-colors duration-200"
      >
        <DownloadIcon />
        <span>{t('toolDetail.downloadDocuments', '資料ダウンロード')}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[280px] max-h-[360px] overflow-y-auto bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[10px] shadow-[0_8px_28px_rgba(23,26,31,0.16)] py-[6px]">
          {downloadable.length === 0 ? (
            <div className="px-[14px] py-[16px] text-center text-[13px] text-[#565d6d] dark:text-gray-400">
              {t('common.noDocsToDownload', 'ダウンロードできる資料がありません。')}
            </div>
          ) : (
            downloadable.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleDownloadTool(tool)}
                disabled={downloadingId === tool.id}
                className="w-full flex items-center justify-between gap-[10px] px-[14px] py-[10px] text-left hover:bg-[#f5f7fe] dark:hover:bg-midnight-800 transition-colors disabled:opacity-50"
              >
                <span className="text-[13px] text-[#171a1f] dark:text-light truncate">{tool.name}</span>
                <span className="flex-shrink-0 text-[#64748b] dark:text-gray-400">
                  <DownloadIcon className="w-[16px] h-[16px]" />
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
