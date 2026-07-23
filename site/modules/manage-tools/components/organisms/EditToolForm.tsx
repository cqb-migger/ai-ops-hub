import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { API_BASE, apiFetch } from '../../../../base/utils/api';
import { useTranslation } from 'next-i18next';
import { categoryDisplayName } from '../../../../base/hooks/useCategories';
import { useTools, useTool } from '../../../../base/hooks/useTools';
import { useCategories } from '../../../../base/hooks/useCategories';
import { useSteps } from '../../../../base/hooks/useSteps';
import { useRoles } from '../../../../base/hooks/useRoles';
import { translateCategory, translateRole } from '../../../../base/utils/labels';
import { withDuplicateLoginIdErrors } from '../../constants/loginIds';

// SVG Icons
function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MessageSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-gray-300 dark:text-gray-600">
      <circle cx="9" cy="5" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="15" cy="5" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[#5570f6] dark:text-[#7c91eb]">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[24px] h-[24px] text-gray-400 dark:text-gray-500">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function ImageUploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-gray-400 dark:text-gray-500">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function DocumentUploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-gray-400 dark:text-gray-500">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" x2="12" y1="18" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

interface PromptItem {
  id: string;
  name: string;
  content: string;
  isPublic?: boolean;
  categories?: number[];
}

interface RoleSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function RoleSelect({ value, onChange, options, placeholder }: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { roles: apiRoles } = useRoles();
  const { t } = useTranslation('common');
  const router = useRouter();
  const actualPlaceholder = (placeholder || t('common.select', '選択してください')) as string;

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

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full z-20">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] flex items-center justify-between cursor-pointer select-none"
      >
        <span className={selectedOption ? "text-[#171a1f] dark:text-light font-semibold" : "text-[#565d6d] dark:text-gray-400"}>
          {selectedOption ? (translateRole(selectedOption.value, t, apiRoles, router.locale) as string) : actualPlaceholder}
        </span>
        <ChevronDownIcon />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-[4px] w-full bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-lg z-50 py-[8px] flex flex-col">
          {/* Search Input */}
          <div className="px-[12px] pb-[8px] mb-[4px] border-b border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb] dark:bg-midnight-900">
            <input
              type="text"
              placeholder={t('common.search', t('common.search')) as string}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-[32px] px-[8px] bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-850 rounded-[4px] text-[13px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light"
            />
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto flex flex-col">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-[12px] py-[8px] hover:bg-[#fafafb] dark:hover:bg-midnight-800 cursor-pointer text-[14px] select-none transition-colors ${opt.value === value
                    ? 'bg-[#eff6ff] text-[#5570f6] font-semibold dark:bg-[#5570f6]/20 dark:text-primary-400'
                    : 'text-[#171a1f] dark:text-light'
                    }`}
                >
                  <span>{translateRole(opt.value, t, apiRoles, router.locale)}</span>
                  {opt.value === value && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#5570f6] dark:text-primary-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-[12px] py-[8px] text-[13px] text-gray-400 dark:text-gray-500 text-center">
                {t('common.noResults', t('common.noResults'))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export default function EditToolForm() {
  const router = useRouter();
  const { id } = router.query;
  const { tool, loading: toolLoading } = useTool(id ? String(id) : undefined);
  // enabled: false — this screen only needs updateTool; it never renders the tool list.
  const { updateTool } = useTools({ enabled: false });
  const { categories: apiCategories, loading: categoriesLoading } = useCategories();
  const { roles: apiRoles } = useRoles();
  const { t } = useTranslation('common');

  // Alert banner state
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Form states
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [categories, setCategories] = useState<number[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [stepIds, setStepIds] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStepOpen, setIsStepOpen] = useState(false);
  const [loginIds, setLoginIds] = useState<string[]>(['']);
  const [visibility, setVisibility] = useState<'public' | 'draft'>('public');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [iconUrlInput, setIconUrlInput] = useState('');
  const [fetchingFavicon, setFetchingFavicon] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // MCP connection state
  const [mcpConfig, setMcpConfig] = useState('');




  const stepFlowCategory = apiCategories.find(
    (c) => c.has_step_flow && categories.includes(c.id)
  );
  const isComplianceSelected = !!stepFlowCategory;
  const { steps: apiSteps, loading: stepsLoading } = useSteps({ 
    enabled: isComplianceSelected, 
    categoryId: stepFlowCategory?.id 
  });

  useEffect(() => {
    if (!isComplianceSelected) {
      setStepIds([]);
    }
  }, [isComplianceSelected]);

  // Prompt settings
  const [prompts, setPrompts] = useState<PromptItem[]>([
    {
      id: 'p1',
      name: '',
      content: '',
      isPublic: true,
      categories: [],
    }
  ]);

  // Guide settings
  const [guideContent, setGuideContent] = useState('');
  const [isGuidePreview, setIsGuidePreview] = useState(false);

  // Guide and Reference Files states
  const [guideFiles, setGuideFiles] = useState<any[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<any[]>([]);
  const [uploadingGuide, setUploadingGuide] = useState(false);
  const [uploadingReference, setUploadingReference] = useState(false);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleGuideFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.pdf'].includes(ext)) {
      toast.error(t('validation.jpgPngPdfOnly'));
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error(t('validation.fileSize20MB'));
      return;
    }

    setUploadingGuide(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch<any>('/upload/file', {
        method: 'POST',
        body: formData
      });

      setGuideFiles(prev => [...prev, {
        original_name: res.original_name,
        stored_name: res.stored_name,
        file_path: res.file_path,
        file_url: res.file_url,
        mime_type: res.mime_type,
        file_size: res.file_size,
        order: prev.length
      }]);
      toast.success(t('toast.fileUploaded'));
    } catch (err: any) {
      toast.error(err.message || t('toast.uploadFailed'));
    } finally {
      setUploadingGuide(false);
      if (guideFileInputRef.current) guideFileInputRef.current.value = '';
    }
  };

  const handleReferenceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 20 * 1024 * 1024) {
      toast.error(t('validation.fileSize20MB'));
      return;
    }

    setUploadingReference(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch<any>('/upload/file', {
        method: 'POST',
        body: formData
      });

      setReferenceFiles(prev => [...prev, {
        original_name: res.original_name,
        stored_name: res.stored_name,
        file_path: res.file_path,
        file_url: res.file_url,
        mime_type: res.mime_type,
        file_size: res.file_size,
        order: prev.length
      }]);
      toast.success(t('toast.fileUploaded'));
    } catch (err: any) {
      toast.error(err.message || t('toast.uploadFailed'));
    } finally {
      setUploadingReference(false);
      if (referenceFileInputRef.current) referenceFileInputRef.current.value = '';
    }
  };

  // Supplementary states
  const [adminMemo, setAdminMemo] = useState('');

  // Refs
  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const referenceFileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const stepDropdownRef = useRef<HTMLDivElement>(null);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (tool && !hasInitialized) {
      if (tool.name) setToolName(tool.name);
      if (tool.description) setDescription(tool.description);
      if (tool.url) setRedirectUrl(tool.url);
      if (tool.categories) {
        setCategories(tool.categories.map((c: any) => c.id));
      }
      if (tool.roles) {
        setRoles(tool.roles);
      }
      if (tool.step_ids) {
        setStepIds(tool.step_ids.map(String));
      } else if (tool.step_id) {
        setStepIds([String(tool.step_id)]);
      } else {
        setStepIds([]);
      }
      if (tool.login_ids && tool.login_ids.length > 0) {
        setLoginIds(tool.login_ids);
      } else {
        setLoginIds(['']);
      }
      if (tool.visibility) {
        setVisibility(tool.visibility);
      }
      if (tool.icon) {
        setThumbnailUrl(tool.icon);
        setIconUrlInput(tool.icon);
      }
      if (tool.guide_content) {
        setGuideContent(tool.guide_content);
      }
      if (tool.admin_memo) {
        setAdminMemo(tool.admin_memo);
      }
      if (tool.prompts && tool.prompts.length > 0) {
        setPrompts(
          tool.prompts.map((p: any, idx: number) => ({
            id: p.id ? String(p.id) : `p-${idx}`,
            name: p.title || '',
            content: p.content || '',
            isPublic: p.is_recommended ?? p.isRecommended ?? true,
            categories: (p.categories || []).map((c: any) => c.id),
          }))
        );
      } else {
        setPrompts([
          {
            id: 'p1',
            name: '',
            content: '',
            isPublic: true,
            categories: [],
          }
        ]);
      }
      if (tool.guide_files) {
        const refs = tool.guide_files.filter((gf: any) => gf.mime_type?.startsWith('reference/')).map((gf: any) => ({
          ...gf,
          mime_type: gf.mime_type.replace('reference/', '')
        }));
        const guides = tool.guide_files.filter((gf: any) => !gf.mime_type?.startsWith('reference/')).map((gf: any) => ({
          ...gf,
          mime_type: gf.mime_type?.startsWith('guide/') ? gf.mime_type.replace('guide/', '') : gf.mime_type
        }));
        setReferenceFiles(refs);
        setGuideFiles(guides);
      }

      // Initialize MCP setting
      if (tool.mcp_config) {
        setMcpConfig(tool.mcp_config);
      } else {
        setMcpConfig('');
      }

      setHasInitialized(true);
    }
  }, [tool, hasInitialized]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryOpen, isRoleOpen]);

  useEffect(() => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      let hasChanges = false;

      // Clear existing loginId errors
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('loginId_')) {
          delete newErrors[key];
          hasChanges = true;
        }
      });

      const seen = new Set<string>();
      loginIds.forEach((id, index) => {
        const trimmedId = id.trim();
        if (trimmedId) {
          if (seen.has(trimmedId)) {
            newErrors[`loginId_${index}`] = t('validation.duplicateLoginId');
            hasChanges = true;
          } else {
            seen.add(trimmedId);
          }
        }
      });

      return hasChanges ? newErrors : prev;
    });
  }, [loginIds, t]);

  if (toolLoading || (id && !tool)) {
    return (
      <div className="flex flex-col items-center justify-center p-[48px] text-center w-full">
        <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">{t('common.loading')}</p>
      </div>
    );
  }

  const handleFetchFavicon = async () => {
    if (!iconUrlInput.trim()) {
      toast.error(t('toast.enterUrl'));
      return;
    }
    setFetchingFavicon(true);
    try {
      const res = await apiFetch<{ url: string }>('/upload/icon-from-url', {
        method: 'POST',
        body: JSON.stringify({ url: iconUrlInput.trim() }),
      });
      if (res && res.url) {
        setThumbnailUrl(res.url);
        toast.success(t('toast.faviconSuccess'));
      } else {
        toast.error(t('toast.faviconFailed'));
      }
    } catch (err: any) {
      toast.error(err.message || t('toast.faviconFailed'));
    } finally {
      setFetchingFavicon(false);
    }
  };

  const handleTriggerGuideUpload = () => guideFileInputRef.current?.click();
  const handleTriggerReferenceUpload = () => referenceFileInputRef.current?.click();

  const handleAddPrompt = () => {
    setPrompts([...prompts, { id: `p${Date.now()}`, name: '', content: '', isPublic: true, categories: [] }]);
  };

  const handleUpdatePrompt = (id: string, field: keyof PromptItem, value: any) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  const handleToggleCategory = (cat: number) => {
    let nextCategories;
    if (categories.includes(cat)) {
      nextCategories = categories.filter((c) => c !== cat);
    } else {
      nextCategories = [...categories, cat];
    }
    setCategories(nextCategories);
    if (errors.categories && nextCategories.length > 0) {
      setErrors((prev) => ({ ...prev, categories: '' }));
    }
  };

  const handleToggleStep = (id: string) => {
    if (stepIds.includes(id)) {
      setStepIds(stepIds.filter((s) => s !== id));
    } else {
      setStepIds([...stepIds, id]);
    }
  };

  const handleToggleRole = (roleVal: string) => {
    let nextRoles;
    if (roles.includes(roleVal)) {
      nextRoles = roles.filter((r) => r !== roleVal);
    } else {
      nextRoles = [...roles, roleVal];
    }
    setRoles(nextRoles);
    if (errors.roles && nextRoles.length > 0) {
      setErrors((prev) => ({ ...prev, roles: '' }));
    }
  };

  /** Applies the new list and re-validates duplicates against it in one go. */
  const applyLoginIds = (updated: string[]) => {
    setLoginIds(updated);
    setErrors((prev) => withDuplicateLoginIdErrors(prev, updated, t('validation.duplicateLoginId')));
  };

  const handleAddLoginId = () => {
    applyLoginIds([...loginIds, '']);
  };

  const handleUpdateLoginId = (index: number, val: string) => {
    const updated = [...loginIds];
    updated[index] = val;
    applyLoginIds(updated);
  };

  const handleRemoveLoginId = (index: number) => {
    applyLoginIds(loginIds.filter((_, idx) => idx !== index));
  };


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let firstErrorKey = '';

    const setErrorKey = (key: string) => {
      if (!firstErrorKey) {
        firstErrorKey = key;
      }
    };

    if (!toolName.trim()) {
      newErrors.toolName = t('validation.toolNameRequired');
      setErrorKey('toolName');
    }
    if (!description.trim()) {
      newErrors.description = t('validation.descRequired');
      setErrorKey('description');
    }
    if (categories.length === 0) {
      newErrors.categories = t('validation.categoryRequired');
      setErrorKey('categories');
    }
    if (roles.length === 0) {
      newErrors.roles = t('validation.roleRequired');
      setErrorKey('roles');
    }

    const seenLoginIds = new Set<string>();
    loginIds.forEach((id, index) => {
      const trimmedId = id.trim();
      if (trimmedId) {
        if (seenLoginIds.has(trimmedId)) {
          const key = `loginId_${index}`;
          newErrors[key] = t('validation.duplicateLoginId');
          setErrorKey(key);
        } else {
          seenLoginIds.add(trimmedId);
        }
      }
    });

    prompts.forEach((p) => {
      if (!p.name.trim()) {
        const key = `prompt_name_${p.id}`;
        newErrors[key] = t('validation.promptNameRequired');
        setErrorKey(key);
      }
      if (!p.content.trim()) {
        const key = `prompt_content_${p.id}`;
        newErrors[key] = t('validation.promptContentRequired');
        setErrorKey(key);
      }
      // Public prompts must have at least one category (from Basic Information selection)
      if (p.isPublic !== false) {
        const selected = (p.categories || []).filter((c) => categories.includes(c));
        if (selected.length === 0) {
          const key = `prompt_category_${p.id}`;
          newErrors[key] = t('validation.promptCategoryRequired');
          setErrorKey(key);
        }
      }
    });

    // Validate redirectUrl (URL)
    const trimmedUrl = redirectUrl.trim();
    if (!trimmedUrl) {
      newErrors.redirectUrl = t('validation.urlRequired', '遷移先URLは必須です');
      setErrorKey('redirectUrl');
    } else {
      if (trimmedUrl.length < 10 || !isValidUrl(trimmedUrl)) {
        newErrors.redirectUrl = t('validation.invalidUrl');
        setErrorKey('redirectUrl');
      } else if (trimmedUrl.length > 500) {
        newErrors.redirectUrl = t('validation.urlTooLong');
        setErrorKey('redirectUrl');
      }
    }

    // Validate MCP settings


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(t('validation.checkInputs'));

      // Focus on the first error item
      setTimeout(() => {
        if (firstErrorKey === 'toolName') {
          const el = document.getElementById('tool-name-input');
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey === 'description') {
          const el = document.getElementById('description-input');
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey === 'categories') {
          const el = document.getElementById('categories-container');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey === 'roles') {
          const el = document.getElementById('roles-container');
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey.startsWith('loginId_')) {
          const idx = firstErrorKey.replace('loginId_', '');
          const el = document.getElementById(`login-id-${idx}`);
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey.startsWith('prompt_name_')) {
          const promptId = firstErrorKey.replace('prompt_name_', '');
          const el = document.getElementById(`prompt-name-${promptId}`);
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey.startsWith('prompt_content_')) {
          const promptId = firstErrorKey.replace('prompt_content_', '');
          const el = document.getElementById(`prompt-content-${promptId}`);
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey.startsWith('prompt_category_')) {
          const promptId = firstErrorKey.replace('prompt_category_', '');
          const el = document.getElementById(`prompt-category-${promptId}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (firstErrorKey === 'redirectUrl') {
          const el = document.getElementById('redirect-url-input');
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);

      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    try {
      // Selected categories are stored as ids; build the {id, name} objects the API expects.
      const selectedCategories = apiCategories
        .filter((c) => categories.includes(c.id))
        .map((c) => ({ id: c.id, name: categoryDisplayName(c, router.locale) }));

      const toolPayload: Record<string, any> = {
        name: toolName.trim(),
        description: description.trim(),
        url: redirectUrl.trim() || null,
        icon: thumbnailUrl || null,
        visibility,
        categories: selectedCategories,
        category_ids: selectedCategories.map((c) => c.id),
        roles,
        login_ids: loginIds.filter(Boolean),
        guide_content: guideContent.trim() || null,
        admin_memo: adminMemo.trim() || null,
        step_ids: stepIds.map(Number),
        details: tool?.details || null,
        mcp_config: mcpConfig.trim() || null,
        prompts: prompts
          .filter((p) => p.name.trim() || p.content.trim())
          .map((p, i) => {
            const promptCategories = apiCategories
              .filter((c) => (p.categories || []).includes(c.id))
              .map((c) => ({ id: c.id, name: categoryDisplayName(c, router.locale) }));
            return {
              title: p.name.trim(),
              description: '',
              content: p.content.trim(),
              is_recommended: p.isPublic ?? true,
              order: i,
              roles: [],
              categories: promptCategories,
            };
          }),
        guide_files: [
          ...referenceFiles.map((f, i) => ({ ...f, order: i, mime_type: 'reference/' + (f.mime_type || '') })),
          ...guideFiles.map((f, i) => ({ ...f, order: referenceFiles.length + i, mime_type: 'guide/' + (f.mime_type || '') }))
        ],
      };

      await updateTool(id as string, toolPayload as any);
      toast.success(t('manageTools.saveSuccess'));
      setShowSuccessAlert(true);
      router.push('/manage-tools');
    } catch (err: any) {
      toast.error(err.message || t('manageTools.saveFailed'));
    }
  };

  const handleCancel = () => {
    router.push('/manage-tools');
  };

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[24px] w-full text-[#171a1f] dark:text-light font-base">

      {/* Header */}
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] sm:text-[30px] font-bold leading-[30px] sm:leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
          {t('manageTools.edit')}
        </h2>
        <p className="hidden md:block text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400">
          {t('manageTools.editDesc', '登録済みのAIツール情報を編集します。プロンプトテンプレートなどを修正することができます。')}
        </p>
      </div>

      {/* Success Alert Banner */}
      {showSuccessAlert && (
        <div className="flex items-start justify-between bg-[#f0fdf4] dark:bg-midnight-900 border border-[#bbf7d0] dark:border-green-800 rounded-[6px] p-[16px] gap-[12px]">
          <div className="flex items-start gap-[12px]">
            <div className="mt-[2px]">
              <CircleCheckIcon />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px] font-medium text-[#166534] dark:text-green-300">{t('toast.toolUpdated')}</span>
              <span className="text-[14px] font-normal text-[#15803d] dark:text-green-400">
                設定が正常に更新されました。
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessAlert(false)}
            className="text-[#15803d] dark:text-green-400 hover:opacity-80 p-[4px] text-[16px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Box 1: 基本情報 (Basic Information) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[16px] sm:p-[24px] gap-[16px] sm:gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <SettingsIcon />
          <h3 className="font-semibold text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#171a1f] dark:text-light font-base">{t('form.basicInfo')}</h3>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-[20px]">

          {/* Tool Name */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.toolName')}<span className="text-[#f25a5a]">*</span>
            </label>
            <input
              id="tool-name-input"
              type="text"
              value={toolName}
              onChange={(e) => {
                setToolName(e.target.value);
                if (errors.toolName) {
                  setErrors((prev) => ({ ...prev, toolName: '' }));
                }
              }}
              className={`w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light ${errors.toolName ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                }`}
            />
            {errors.toolName && (
              <p className="text-[12px] text-red-500 font-semibold">{errors.toolName}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.description')}<span className="text-[#f25a5a]">*</span>
            </label>
            <textarea
              id="description-input"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              rows={3}
              className={`w-full p-[12px] bg-white dark:bg-midnight-900 border rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6] text-[#171a1f] dark:text-light ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                }`}
            />
            {errors.description && (
              <p className="text-[12px] text-red-500 font-semibold">{errors.description}</p>
            )}
          </div>

          {/* URL Row */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.redirectUrl')}<span className="text-[#f25a5a]">*</span></label>
            <input
              id="redirect-url-input"
              type="text"
              value={redirectUrl}
              onChange={(e) => {
                setRedirectUrl(e.target.value);
                if (!e.target.value.trim() || isValidUrl(e.target.value.trim())) {
                  setErrors((prev) => ({ ...prev, redirectUrl: '' }));
                }
              }}
              className={`w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light ${errors.redirectUrl ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                }`}
            />
            {errors.redirectUrl && (
              <p className="text-[12px] text-red-500 font-semibold">{errors.redirectUrl}</p>
            )}
          </div>

          {/* Category Row (Takes 1 full row) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.category')}<span className="text-[#f25a5a]">*</span>
            </label>
            <div id="categories-container" className="flex flex-wrap gap-[20px] py-[6px]">
              {categoriesLoading ? (
                <div className="text-[13px] text-gray-400 dark:text-gray-500">{t('common.loading')}</div>
              ) : (
                apiCategories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-[8px] cursor-pointer text-[14px] text-[#171a1f] dark:text-light select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(cat.id)}
                      onChange={() => handleToggleCategory(cat.id)}
                      className="w-[18px] h-[18px] accent-[#5570f6] rounded border-[#dee1e6] dark:border-midnight-800 cursor-pointer"
                    />
                    <span className="group-hover:text-[#5570f6] dark:group-hover:text-primary-400 transition-colors font-medium">
                      {categoryDisplayName(cat, router.locale)}
                    </span>
                  </label>
                ))
              )}
            </div>
            {errors.categories && (
              <p className="text-[12px] text-red-500 font-semibold">{errors.categories}</p>
            )}
          </div>

          {/* Step Row (Takes 1 full row) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.step')}</label>
            <div className="flex flex-wrap gap-[20px] py-[6px]">
              {!isComplianceSelected ? (
                <span className="text-[13px] text-gray-400 dark:text-gray-500 italic">{t('form.stepComplianceHelp')}</span>
              ) : stepsLoading ? (
                <div className="text-[13px] text-gray-400 dark:text-gray-500">{t('common.loading')}</div>
              ) : (
                apiSteps.map((step) => (
                  <label
                    key={step.id}
                    className="flex items-center gap-[8px] cursor-pointer text-[14px] text-[#171a1f] dark:text-light select-none group"
                  >
                    <input
                      type="checkbox"
                      checked={stepIds.includes(step.id)}
                      onChange={() => handleToggleStep(step.id)}
                      className="w-[18px] h-[18px] accent-[#5570f6] rounded border-[#dee1e6] dark:border-midnight-800 cursor-pointer"
                    />
                    <span className="group-hover:text-[#5570f6] dark:group-hover:text-primary-400 transition-colors font-medium">
                      STEP {step.order} — {step.title}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Role Row (Takes 1 full row) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.allRoles')}<span className="text-[#f25a5a]">*</span>
            </label>
            <div id="roles-container" className="flex flex-wrap gap-[20px] py-[6px]">
              {apiRoles.map((opt) => (
                <label
                  key={opt.code}
                  className="flex items-center gap-[8px] cursor-pointer text-[14px] text-[#171a1f] dark:text-light select-none group"
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(opt.code)}
                    onChange={() => handleToggleRole(opt.code)}
                    className="w-[18px] h-[18px] accent-[#5570f6] rounded border-[#dee1e6] dark:border-midnight-800 cursor-pointer"
                  />
                  <span className="group-hover:text-[#5570f6] dark:group-hover:text-primary-400 transition-colors font-medium">
                    {translateRole(opt.code, t, apiRoles, router.locale)}
                  </span>
                </label>
              ))}
            </div>
            {errors.roles && (
              <p className="text-[12px] text-red-500 font-semibold">{errors.roles}</p>
            )}
          </div>

          {/* Login ID Row */}
          <div className="flex flex-col gap-[8px] mt-[4px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                Login ID
              </label>
              <button
                type="button"
                onClick={handleAddLoginId}
                className="h-[28px] px-[12px] bg-[#f1f4fe] dark:bg-midnight-800 hover:bg-[#e4ebfc] dark:hover:bg-midnight-700 text-[#5570f6] dark:text-[#7c91eb] rounded-[6px] text-[12px] font-semibold flex items-center gap-[4px] transition-colors"
              >
                <PlusIcon />
                <span>{t('common.add')}</span>
              </button>
            </div>

            <div className="flex flex-col gap-[8px]">
              {loginIds.map((id, index) => (
                <div key={index} className="flex flex-col gap-[4px]">
                  <div className="flex items-center gap-[8px] sm:gap-[12px]">
                    <input
                      id={`login-id-${index}`}
                      type="text"
                      value={id}
                      onChange={(e) => {
                        handleUpdateLoginId(index, e.target.value);
                      }}
                      placeholder={t('form.loginIdPlaceholder') as string}
                      className={`w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border ${errors[`loginId_${index}`] ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                        } rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light`}
                    />
                    {loginIds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLoginId(index)}
                        className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] flex items-center justify-center rounded-[6px] hover:bg-red-50 dark:hover:bg-red-950/30 text-[#f25a5a] transition-colors duration-200 shrink-0"
                        title={t('common.delete') as string}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  {errors[`loginId_${index}`] && (
                    <p className="text-[12px] text-red-500 font-semibold">{errors[`loginId_${index}`]}</p>
                  )}
                </div>
              ))}
              {loginIds.length === 0 && (
                <p className="text-[13px] text-gray-400 dark:text-gray-500 italic">{t('form.noLoginIds')}</p>
              )}
            </div>
          </div>

          {/* Icon and Visibility Settings Row */}
          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] mt-[4px]">
            {/* Thumbnail Image */}
            <div className="flex flex-col gap-[6px] flex-[2]">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.icon')}</span>
              <div className="flex flex-row items-center gap-[8px] sm:gap-[12px] w-full">
                {/* Image Preview Box */}
                <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[56px] sm:h-[56px] rounded-[6px] border border-dashed border-[#dee1e6] dark:border-midnight-850 bg-[#fafafb] dark:bg-midnight-900 overflow-hidden shrink-0">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Favicon Preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageUploadIcon />
                  )}
                </div>
                {/* URL Input */}
                <input
                  type="text"
                  onChange={(e) => setIconUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 min-w-0 h-[40px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light"
                />
                {/* Fetch Favicon Button */}
                <button
                  type="button"
                  onClick={handleFetchFavicon}
                  disabled={fetchingFavicon}
                  title={t('form.getFavicon') as string}
                  className="h-[40px] px-[10px] sm:px-[16px] bg-[#5570f6] text-white hover:bg-[#395ce0] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-[6px] text-[14px] font-semibold transition-colors shrink-0 whitespace-nowrap inline-flex items-center gap-[6px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] shrink-0">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" x2="16.65" y1="21" y2="16.65" />
                  </svg>
                  <span className="hidden sm:inline">{fetchingFavicon ? t('common.fetching') : t('form.getFavicon')}</span>
                </button>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="flex flex-col gap-[6px] flex-1">
              <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">{t('form.visibility')}</span>
              <div className="flex items-center gap-[24px] h-[56px]">
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span className={visibility === 'public' ? 'text-[#171a1f] font-medium' : 'text-[#565d6d]'}>{t('manageTools.public')}</span>
                </label>
                <label className="flex items-center gap-[8px] cursor-pointer text-[14px]">
                  <input
                    type="radio"
                    checked={visibility === 'draft'}
                    onChange={() => setVisibility('draft')}
                    className="w-[16px] h-[16px] accent-[#5570f6] cursor-pointer"
                  />
                  <span className={visibility === 'draft' ? 'text-[#171a1f] font-medium' : 'text-[#565d6d]'}>{t('manageTools.draft')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Reference Materials ({t('form.reference')}) */}
          <div className="flex flex-col gap-[6px] mt-[16px]">
            <span className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              {t('form.reference')}
            </span>
            <div
              className="flex flex-col items-center justify-center w-full py-[32px] px-[20px] mt-[4px] border-2 border-dashed border-[#dee1e6] dark:border-midnight-800 rounded-[8px] bg-[#fafafb] hover:bg-[#f3f4f6] dark:bg-midnight-900 dark:hover:bg-midnight-850 cursor-pointer transition-colors group"
              onClick={handleTriggerReferenceUpload}
            >
              <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 mb-[12px] group-hover:scale-105 transition-transform shadow-sm">
                <DocumentUploadIcon />
              </div>
              <div className="flex flex-col items-center gap-[4px] text-center">
                <p className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  {uploadingReference ? (t('form.uploading') as string) : (t('form.clickToUpload') as string)}
                  <span className="font-normal text-[#565d6d] dark:text-gray-400">{t('form.orDragDrop')}</span>
                </p>
                <p className="text-[12px] text-[#9095a1] dark:text-gray-500 mt-[2px]">
                  {t('form.allFormats20MB')}
                </p>
              </div>
              <input
                type="file"
                ref={referenceFileInputRef}
                onChange={handleReferenceFileChange}
                className="hidden"
              />
            </div>
            {referenceFiles.length > 0 && (
              <div className="flex flex-col gap-[8px] mt-[12px]">
                {referenceFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-[12px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px]">
                    <div className="flex items-center gap-[8px] overflow-hidden">
                      <FileTextIcon />
                      <span className="text-[14px] font-medium truncate max-w-[200px] text-[#171a1f] dark:text-light" title={file.original_name}>
                        {file.original_name}
                      </span>
                      <span className="text-[12px] text-[#9095a1]">
                        ({formatBytes(file.file_size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReferenceFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-[#9095a1] hover:text-red-500 transition-colors p-[4px]"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Custom MCP Connection Settings Section */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[16px] sm:p-[24px] gap-[16px] sm:gap-[20px]">
        {/* Section Title */}
        {/* Section Title */}
        <div className="flex items-center justify-between gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div className="flex items-center gap-[8px] min-w-0">
            <ServerIcon />
            <h3 className="font-semibold text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#171a1f] dark:text-light font-base">
              {t('mcp.title')}
            </h3>
          </div>
        </div>

        {/* MCP Config Textarea */}
        <div className="flex flex-col gap-[6px]">
          <textarea
            value={mcpConfig}
            onChange={(e) => setMcpConfig(e.target.value)}
            placeholder={`MCP Connection Settings`}
            className="w-full h-[200px] p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] font-mono outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light resize-y"
          />
        </div>
      </section>

      {/* Box 2: プロンプト設定 (Prompt Settings) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[16px] sm:p-[24px] gap-[16px] sm:gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div className="flex items-center gap-[8px]">
            <MessageSquareIcon />
            <h3 className="font-semibold text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#171a1f] dark:text-light font-base">
              {t('prompt.title')}
            </h3>
          </div>
        </div>

        {/* List of Prompts */}
        <div className="flex flex-col gap-[20px] font-base">
          {prompts.map((prompt, index) => (
            <div
              key={prompt.id}
              className="flex flex-col gap-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[8px] p-[20px] bg-[#fafafb] dark:bg-midnight-900/40 shadow-sm"
            >
              {/* Card Header Row */}
              <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800/80">
                <span className="text-[14px] font-bold text-[#5570f6] dark:text-[#7c91eb]">
                  {t('prompt.template')} #{index + 1}
                </span>
                {prompts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] border border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-[#f25a5a] transition-colors shadow-sm"
                    title={t('prompt.deleteTemplate') as string}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-[12px]">
                {/* Prompt Name */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                    {t('prompt.name')}<span className="text-[#f25a5a]">*</span>
                  </label>
                  <input
                    id={`prompt-name-${prompt.id}`}
                    type="text"
                    value={prompt.name}
                    onChange={(e) => {
                      handleUpdatePrompt(prompt.id, 'name', e.target.value);
                      if (errors[`prompt_name_${prompt.id}`]) {
                        setErrors((prev) => ({ ...prev, [`prompt_name_${prompt.id}`]: '' }));
                      }
                    }}
                    placeholder={t('prompt.namePlaceholder') as string}
                    className={`w-full h-[40px] px-[12px] bg-white dark:bg-midnight-900 border rounded-[4px] text-[14px] outline-none focus:border-[#5570f6] text-[#171a1f] dark:text-light ${errors[`prompt_name_${prompt.id}`] ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                      }`}
                  />
                  {errors[`prompt_name_${prompt.id}`] && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors[`prompt_name_${prompt.id}`]}</p>
                  )}
                </div>

                {/* Prompt Content */}
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">{t('prompt.content')}<span className="text-[#f25a5a]">*</span>
                  </label>
                  <textarea
                    id={`prompt-content-${prompt.id}`}
                    value={prompt.content}
                    onChange={(e) => {
                      handleUpdatePrompt(prompt.id, 'content', e.target.value);
                      if (errors[`prompt_content_${prompt.id}`]) {
                        setErrors((prev) => ({ ...prev, [`prompt_content_${prompt.id}`]: '' }));
                      }
                    }}
                    placeholder={t('prompt.contentPlaceholder') as string}
                    rows={3}
                    className={`w-full p-[12px] bg-white dark:bg-midnight-900 border rounded-[4px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6] text-[#171a1f] dark:text-light ${errors[`prompt_content_${prompt.id}`] ? 'border-red-500 focus:border-red-500' : 'border-[#dee1e6] dark:border-midnight-800'
                      }`}
                  />
                  {errors[`prompt_content_${prompt.id}`] && (
                    <p className="text-[11px] text-red-500 font-semibold">{errors[`prompt_content_${prompt.id}`]}</p>
                  )}
                </div>

                {/* Prompt Options Row: Visibility & Categories */}
                <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] mt-[4px]">
                  {/* Visibility Radios */}
                  <div className="flex flex-col gap-[6px] flex-1">
                    <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">{t('form.visibility')}<span className="text-[#f25a5a]">*</span>
                    </label>
                    <div className="flex items-center gap-[16px] h-[40px]">
                      <label className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                        <input
                          type="radio"
                          name={`prompt-visibility-${prompt.id}`}
                          checked={prompt.isPublic !== false}
                          onChange={() => handleUpdatePrompt(prompt.id, 'isPublic', true)}
                          className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer"
                        />
                        <span className={prompt.isPublic !== false ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>{t('manageTools.public')}</span>
                      </label>
                      <label className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                        <input
                          type="radio"
                          name={`prompt-visibility-${prompt.id}`}
                          checked={prompt.isPublic === false}
                          onChange={() => handleUpdatePrompt(prompt.id, 'isPublic', false)}
                          className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer"
                        />
                        <span className={prompt.isPublic === false ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>{t('manageTools.draft')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Categories Checkboxes — only categories chosen in Basic Information */}
                  <div id={`prompt-category-${prompt.id}`} className="flex flex-col gap-[6px] flex-[2]">
                    <label className="text-[12px] font-semibold text-[#565d6d] dark:text-gray-400">
                      {t('form.category')}
                      {prompt.isPublic !== false && <span className="text-[#f25a5a]">*</span>}
                    </label>
                    <div className="flex flex-wrap items-center gap-[16px] min-h-[40px]">
                      {categoriesLoading ? (
                        <span className="text-[12px] text-gray-400 dark:text-gray-500">{t('common.loading')}</span>
                      ) : categories.length === 0 ? (
                        <span className="text-[12px] text-gray-400 dark:text-gray-500 italic">
                          {t('prompt.selectBasicCategoryFirst', 'まず基本情報でカテゴリを選択してください')}
                        </span>
                      ) : (
                        apiCategories
                          .filter((cat) => categories.includes(cat.id))
                          .map((cat) => {
                            const isChecked = (prompt.categories || []).includes(cat.id);
                            return (
                              <label key={cat.id} className="flex items-center gap-[8px] cursor-pointer text-[13px]">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    const currentSelected = prompt.categories || [];
                                    const nextSelected = isChecked
                                      ? currentSelected.filter((c) => c !== cat.id)
                                      : [...currentSelected, cat.id];
                                    handleUpdatePrompt(prompt.id, 'categories', nextSelected);
                                    if (errors[`prompt_category_${prompt.id}`] && nextSelected.length > 0) {
                                      setErrors((prev) => ({ ...prev, [`prompt_category_${prompt.id}`]: '' }));
                                    }
                                  }}
                                  className="w-[14px] h-[14px] accent-[#5570f6] cursor-pointer rounded-[3px]"
                                />
                                <span className={isChecked ? 'text-[#171a1f] dark:text-light font-medium' : 'text-[#565d6d]'}>
                                  {categoryDisplayName(cat, router.locale)}
                                </span>
                              </label>
                            );
                          })
                      )}
                    </div>
                    {errors[`prompt_category_${prompt.id}`] && (
                      <p className="text-[11px] text-red-500 font-semibold">{errors[`prompt_category_${prompt.id}`]}</p>
                    )}
                  </div>
                </div>

                {/* Character Count Row */}
                <div className="flex justify-end mt-[4px]">
                  <span className="text-[11px] text-[#9095a1] dark:text-gray-500">
                    {t('form.charCount', { count: prompt.content.length })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-[4px]">
          <button
            type="button"
            onClick={handleAddPrompt}
            className="flex items-center gap-[6px] h-[36px] px-[16px] bg-[#f1f4fe] dark:bg-midnight-800 hover:bg-[#e4ebfc] dark:hover:bg-midnight-700 text-[#5570f6] dark:text-[#7c91eb] rounded-[6px] text-[14px] font-semibold transition-colors"
          >
            <PlusIcon />
            <span>{t('prompt.add')}</span>
          </button>
        </div>
      </section>

      {/* Box 3: {t('guide.title')} (Usage Guide Settings) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[16px] sm:p-[24px] gap-[16px] sm:gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center justify-between pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <div className="flex items-center gap-[8px]">
            <BookIcon />
            <h3 className="font-semibold text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#171a1f] dark:text-light font-base">
              {t('guide.title')}
            </h3>
          </div>
        </div>

        {/* Guide Content & Upload Materials */}
        <div className="flex flex-col gap-[20px] font-base">
          {/* Guide Content */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                {t('guide.usageGuide')}
              </label>
              <button
                type="button"
                onClick={() => setIsGuidePreview(!isGuidePreview)}
                className="h-[26px] px-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-700 hover:bg-[#fafafb] dark:hover:bg-midnight-800 text-[#171a1f] dark:text-light rounded-full text-[12px] font-semibold flex items-center justify-center select-none transition-colors"
              >
                {isGuidePreview ? (t('guide.backToEdit') as string) : (t('guide.markdownPreview') as string)}
              </button>
            </div>
            {isGuidePreview ? (
              <div className="w-full min-h-[106px] p-[12px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] overflow-y-auto text-[#171a1f] dark:text-light">
                {guideContent ? (
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-[20px] font-bold mt-4 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-[17px] font-bold mt-3 mb-2 pb-1 border-b border-[#dee1e6] dark:border-midnight-800" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-[15px] font-bold mt-3 mb-1" {...props} />,
                      p: ({ node, ...props }) => <p className="my-[6px] leading-[22px]" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-[20px] my-[6px] space-y-[2px]" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-[20px] my-[6px] space-y-[2px]" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-[22px]" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#5570f6] pl-[12px] italic text-[#565d6d] dark:text-gray-400 my-[8px]" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-[#f0f0f0] dark:bg-midnight-800 rounded px-[4px] py-[1px] text-[13px] font-mono" {...props} />,
                      pre: ({ node, ...props }) => <pre className="bg-[#f0f0f0] dark:bg-midnight-800 rounded-[4px] p-[12px] overflow-x-auto text-[13px] font-mono my-[8px]" {...props} />,
                      hr: ({ node, ...props }) => <hr className="border-[#dee1e6] dark:border-midnight-800 my-[12px]" {...props} />,
                    }}
                  >
                    {guideContent}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 italic">{t('guide.emptyContent')}</p>
                )}
              </div>
            ) : (
              <textarea
                value={guideContent}
                onChange={(e) => setGuideContent(e.target.value)}
                placeholder={t('guide.guidePlaceholder') as string}
                rows={4}
                className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
              />
            )}
            <div className="flex justify-end">
              <span className="text-[11px] text-[#9095a1] dark:text-gray-500">
                {t('form.charCount', { count: guideContent.length })}
              </span>
            </div>
          </div>

          {/* Guide Materials ({t('guide.guideMaterials')}) */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
              {t('guide.guideMaterials')}
            </label>
            <div
              className="flex flex-col items-center justify-center w-full py-[32px] px-[20px] mt-[4px] border-2 border-dashed border-[#dee1e6] dark:border-midnight-800 rounded-[8px] bg-[#fafafb] hover:bg-[#f3f4f6] dark:bg-midnight-900 dark:hover:bg-midnight-850 cursor-pointer transition-colors group"
              onClick={handleTriggerGuideUpload}
            >
              <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 mb-[12px] group-hover:scale-105 transition-transform shadow-sm">
                <DocumentUploadIcon />
              </div>
              <div className="flex flex-col items-center gap-[4px] text-center">
                <p className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
                  {uploadingGuide ? (t('form.uploading') as string) : (t('form.clickToUpload') as string)}
                  <span className="font-normal text-[#565d6d] dark:text-gray-400">{t('form.orDragDrop')}</span>
                </p>
                <p className="text-[12px] text-[#9095a1] dark:text-gray-500 mt-[2px]">
                  {t('form.jpgPngPdf20MB')}
                </p>
              </div>
              <input
                type="file"
                ref={guideFileInputRef}
                accept=".jpg,.png,.pdf"
                onChange={handleGuideFileChange}
                className="hidden"
              />
            </div>
            {guideFiles.length > 0 && (
              <div className="flex flex-col gap-[8px] mt-[12px]">
                {guideFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-[12px] bg-[#fafafb] dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px]">
                    <div className="flex items-center gap-[8px] overflow-hidden">
                      <FileTextIcon />
                      <span className="text-[14px] font-medium truncate max-w-[200px] text-[#171a1f] dark:text-light" title={file.original_name}>
                        {file.original_name}
                      </span>
                      <span className="text-[12px] text-[#9095a1]">
                        ({formatBytes(file.file_size)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuideFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-[#9095a1] hover:text-red-500 transition-colors p-[4px]"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Box 4: {t('form.supplementary')} (Supplementary Information) */}
      <section className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] shadow-[0px_1px_2.5px_rgba(23,26,31,0.07)] p-[16px] sm:p-[24px] gap-[16px] sm:gap-[20px]">
        {/* Section Title */}
        <div className="flex items-center gap-[8px] pb-[12px] border-b border-[#dee1e6] dark:border-midnight-800">
          <FileTextIcon />
          <h3 className="font-semibold text-[16px] sm:text-[18px] leading-[24px] sm:leading-[28px] text-[#171a1f] dark:text-light font-base">
            {t('form.supplementary')}
          </h3>
        </div>

        {/* Admin Memo */}
        <div className="flex flex-col gap-[6px] font-base">
          <label className="text-[14px] font-semibold text-[#171a1f] dark:text-light">
            {t('form.adminMemo')}
          </label>
          <textarea
            value={adminMemo}
            onChange={(e) => setAdminMemo(e.target.value)}
            rows={4}
            className="w-full p-[12px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] text-[14px] leading-[22px] outline-none resize-y focus:border-[#5570f6]"
            placeholder={t('form.adminMemoPlaceholder') as string}
          />
        </div>
      </section>

      {/* Footer Action Buttons */}
      <div className="flex items-center justify-center gap-[12px] sm:gap-[16px] pt-[8px] pb-[24px] sm:pb-[32px]">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 sm:flex-none h-[40px] px-[16px] sm:px-[32px] bg-white dark:bg-midnight-900 hover:bg-gray-50 border border-[#dee1e6] rounded-[6px] text-[14px] font-semibold text-[#171a1f] dark:text-light transition-colors"
        >{t('common.cancel')}</button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 sm:flex-none h-[40px] px-[16px] sm:px-[48px] bg-[#5570f6] hover:bg-[#395ce0] text-white rounded-[6px] text-[14px] font-semibold shadow-[0px_1px_2px_rgba(23,26,31,0.08)] transition-all duration-200"
        >{t('common.save')}</button>
      </div>
    </div>
  );
}
