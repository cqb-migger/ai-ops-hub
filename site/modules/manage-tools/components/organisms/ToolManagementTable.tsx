import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useTools } from '../../../../base/hooks/useTools';
import { useCategories } from '../../../../base/hooks/useCategories';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import { API_BASE } from '../../../../base/utils/api';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { ROLE_OPTIONS, ROLE_BADGE_COLORS } from '../../constants/roles';
import { useTranslation } from 'next-i18next';

interface ManagedTool {
  id: string;
  name: string;
  description: string;
  category: string[];
  role: string;
  roles: string[];
  status: 'public' | 'draft';
  imageUrl: string;
}

// Icons
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function CircleCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[12px] h-[12px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const ITEMS_PER_PAGE = 10;

export default function ToolManagementTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [deletingTool, setDeletingTool] = useState<{ id: string; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation('common');

  const { categories } = useCategories();

  // Map selected category name -> id for the API filter
  const selectedCategoryId = useMemo(() => {
    if (!selectedCategory) return undefined;
    return categories.find((c) => c.name === selectedCategory)?.id;
  }, [categories, selectedCategory]);

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedRole]);

  const { tools, total, loading, updateTool, deleteTool } = useTools({
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryId,
    role: selectedRole || undefined,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const managedTools = useMemo<ManagedTool[]>(() => {
    return tools.map((t) => ({
      id: String(t.id),
      name: t.name,
      description: t.description,
      category: t.category,
      role: t.role || '',
      roles: t.roles || [],
      status: (t.visibility === 'draft' ? 'draft' : 'public') as 'public' | 'draft',
      imageUrl: t.icon || '',
    }));
  }, [tools]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedTools = managedTools;

  const handleAddNew = () => {
    router.push('/manage-tools/new');
  };

  const handleEdit = (id: string | number) => {
    router.push(`/manage-tools/edit/${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingTool({ id, name });
  };

  const confirmDelete = async () => {
    if (!deletingTool) return;
    const { id, name } = deletingTool;
    try {
      await deleteTool(id);
      toast.success(t('manageTools.deleteSuccess', '{{name}} を削除しました', { name }));
    } catch (err: any) {
      toast.error(err.message || t('manageTools.deleteFailed', 'ツールの削除に失敗しました。'));
    } finally {
      setDeletingTool(null);
    }
  };

  const handleToggleStatus = async (id: string, name: string, currentStatus: 'public' | 'draft') => {
    const nextStatus = currentStatus === 'public' ? 'draft' : 'public';
    try {
      await updateTool(id, { visibility: nextStatus });
      toast.success(t('manageTools.statusChangeSuccess', '「{{name}}」のステータスを{{status}}に変更しました。', { name, status: nextStatus === 'public' ? t('manageTools.public') : t('manageTools.draft') }));
    } catch (err: any) {
      toast.error(err.message || t('manageTools.statusChangeFailed', 'ステータスの更新に失敗しました。'));
    }
  };

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title section with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
            {t('nav.manageTools')}
          </h2>
          <p className="text-[14px] font-normal leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
            {t('manageTools.desc', 'AIツールのディレクトリを管理します。新しいツールの登録、既存ツールの編集、削除が可能です。')}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-[8px] h-[40px] px-[16px] bg-[#5570f6] text-white hover:bg-primary-600 rounded-[6px] shadow-sm font-base font-medium text-[14px] transition-all duration-200"
        >
          <PlusIcon />
          <span>{t('manageTools.add')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        categories={categories.map((c) => c.name)}
        showBothFilters
      />

      <div className="flex flex-col gap-[12px] w-full">
        <ItemCount
          currentPage={currentPageSafe}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        {/* Table Container */}
        <div className="w-full bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] overflow-hidden shadow-[0px_1px_1.25px_rgba(23,26,31,0.07)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              {/* Table Header */}
              <thead>
                <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[10px]">
                    No.
                  </th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[320px]">
                    {t('manageTools.name')}
                  </th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[180px]">
                    {t('filter.category')}
                  </th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[180px]">
                    {t('filter.role')}
                  </th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-center w-[120px]">
                    {t('common.status')}
                  </th>
                  <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[120px]">
                    {t('common.action')}
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : paginatedTools.length > 0 ? (
                  paginatedTools.map((tool, index) => (
                    <tr
                      key={tool.id}
                      className="border-b border-[#dee1e6] dark:border-midnight-800 hover:bg-[#fafafb]/50 dark:hover:bg-midnight-900/50 transition-colors duration-150"
                    >
                      {/* STT */}
                      <td className="py-[16px] px-[20px] text-[14px] text-[#565d6d] dark:text-gray-400 font-base font-medium">
                        {(currentPageSafe - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>

                      {/* Tool name & image */}
                      <td className="py-[16px] px-[20px] flex items-start gap-[12px]">
                        <div className="relative flex-shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden bg-[#f3f6fd] dark:bg-midnight-900 border border-[#dbe2f9] dark:border-midnight-700 flex items-center justify-center text-[20px] select-none">
                          {tool.imageUrl && (tool.imageUrl.startsWith('http') || tool.imageUrl.startsWith('/')) ? (
                            <img
                              src={tool.imageUrl.startsWith('/static') ? `${API_BASE.replace('/v1', '')}${tool.imageUrl}` : tool.imageUrl}
                              alt={tool.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{tool.imageUrl || '🔧'}</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-[4px] min-w-0">
                          <span className="text-[14px] font-medium leading-[20px] text-[#171a1f] dark:text-light font-base truncate">
                            {tool.name}
                          </span>
                          <span className="text-[12px] font-normal leading-[16px] text-[#565d6d] dark:text-gray-400 font-base line-clamp-1">
                            {tool.description}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-[16px] px-[20px]">
                        <div className="flex flex-wrap gap-[6px] items-center">
                          {tool.category.map((cat) => {
                            return (
                              <span key={cat} className="inline-flex items-center justify-center bg-[#f0f3fa] dark:bg-midnight-900/60 border border-[#cbd7f0] dark:border-[#4a5a8a] text-[11px] font-semibold text-[#2c5097] dark:text-[#8fa4f5] rounded-full px-[10px] h-[20px] font-base whitespace-nowrap">
                                {cat}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-[16px] px-[20px]">
                        {tool.roles && tool.roles.length > 0 ? (
                          <div className="flex flex-wrap gap-[6px] items-center">
                            {tool.roles.map((rVal) => (
                              <span key={rVal} className={`inline-flex items-center text-[11px] font-semibold px-[10px] py-[3px] whitespace-nowrap font-base ${ROLE_BADGE_COLORS[rVal] || ROLE_BADGE_COLORS.default}`}>
                                {ROLE_OPTIONS.find(r => r.value === rVal)?.label ?? rVal}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[12px] text-gray-400 dark:text-gray-500 italic font-base">
                            {t('common.notSet')}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-[16px] px-[20px]">
                        <div className="flex items-center justify-center gap-[8px]">
                          <button
                            role="switch"
                            aria-checked={tool.status === 'public'}
                            onClick={() => handleToggleStatus(tool.id, tool.name, tool.status)}
                            className={`relative inline-flex h-[20px] w-[36px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tool.status === 'public' ? 'bg-[#22c55e]' : 'bg-[#dee1e6] dark:bg-midnight-800'
                              }`}
                            title={(tool.status === 'public' ? t('manageTools.makeDraft') : t('manageTools.makePublic')) as string}
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${tool.status === 'public' ? 'translate-x-[16px]' : 'translate-x-0'
                                }`}
                            />
                          </button>
                          <span className={`text-[12px] font-semibold font-base whitespace-nowrap ${tool.status === 'public' ? 'text-[#22c55e] dark:text-[#4ade80]' : 'text-[#565d6d] dark:text-gray-400'
                            }`}>
                            {tool.status === 'public' ? t('manageTools.public') : t('manageTools.draft')}
                          </span>
                        </div>
                      </td>

                      <td className="py-[16px] px-[20px] text-right">
                        <div className="flex items-center justify-end gap-[4px]">
                          <button
                            onClick={() => handleEdit(tool.id)}
                            className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-300 transition-colors duration-200"
                            title={t('common.edit') as string}
                          >
                            <PenIcon />
                          </button>
                          {tool.status === 'public' ? (
                            <button
                              className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-40"
                              title={t('manageTools.publicDeleteError', '公開中のため削除できません') as string}
                              disabled
                            >
                              <TrashIcon />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDelete(tool.id, tool.name)}
                              className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-red-50 dark:hover:bg-red-950/30 text-[#f25a5a] transition-colors duration-200"
                              title={t('common.delete') as string}
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                      {t('dashboard.noTools')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-[20px] py-[16px] border-t border-[#dee1e6] dark:border-midnight-800 bg-gray-50 dark:bg-midnight-950">
            <Pagination
              currentPage={currentPageSafe}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
              showItemCount={false}
              className="mt-0"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
              <h3 className="text-[16px] font-bold text-[#171a1f] dark:text-light leading-[24px]">{t('manageTools.deleteConfirmTitle', 'ツールの削除')}</h3>
              <button
                type="button"
                onClick={() => setDeletingTool(null)}
                className="flex items-center justify-center w-[32px] h-[32px] rounded-full hover:bg-[#f3f4f6] dark:hover:bg-midnight-800 text-[#9095a0] hover:text-[#171a1f] dark:hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Body */}
            <div className="px-[24px] py-[20px]">
              <p className="text-[14px] leading-[22px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
                {t('manageTools.deleteConfirmText', '「{{name}}」を削除してもよろしいですか？この操作は取り消せません。', { name: deletingTool.name })}
              </p>
            </div>

            {/* Footer */}
            <div className="px-[24px] py-[16px] bg-[#fafafb] dark:bg-midnight-900 border-t border-[#dee1e6] dark:border-midnight-800 flex justify-end gap-[12px]">
              <button
                type="button"
                onClick={() => setDeletingTool(null)}
                className="h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-400 font-base font-medium text-[14px] transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="h-[36px] px-[16px] bg-[#f25a5a] hover:bg-[#e04545] text-white rounded-[6px] font-base font-medium text-[14px] shadow-sm transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
