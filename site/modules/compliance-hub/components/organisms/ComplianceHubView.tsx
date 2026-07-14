import React, { useState, useEffect } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import { useSteps } from '../../../../base/hooks/useSteps';
import { Step } from '../../constants/steps';
import StepCard from '../molecules/StepCard';
import StepModal from '../molecules/StepModal';
import StepConnector from '../molecules/StepConnector';
import Pagination from '../../../../base/components/molecules/Pagination';
import ItemCount from '../../../../base/components/molecules/ItemCount';
import { API_BASE } from '../../../../base/utils/api';
import useAuthStore from '../../../../base/stores/useAuthStore';
import { useTranslation } from 'next-i18next';


const ITEMS_PER_PAGE = 16;

export default function ComplianceHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isFlowExpanded, setIsFlowExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStep, setSelectedStep] = useState('');
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);

  const { tools, total, loading: toolsLoading, toggleFavorite } = useTools({
    category: 'compliance',
    visibility: 'public',
    search: debouncedSearch || undefined,
    role: selectedRole || undefined,
    stepId: selectedStep || undefined,
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });
  const { steps, saveSteps, loading: stepsLoading } = useSteps();
  const token = useAuthStore((state) => state.token);
  const { t } = useTranslation('common');

  const handleDownloadAll = () => {
    const params = new URLSearchParams();
    params.append('hub', 'compliance');
    if (searchQuery) params.append('search', searchQuery);
    if (selectedRole) params.append('role', selectedRole);
    if (selectedStep) params.append('step_id', selectedStep);
    if (token) params.append('token', token);

    const downloadUrl = `${API_BASE}/tools/download-guides?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  };

  // Debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedRole, selectedStep]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...steps];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);

    // Re-map orders
    const reordered = updated.map((s, idx) => ({
      ...s,
      order: idx + 1
    }));

    setDraggedIndex(null);
    setDragOverIndex(null);
    await saveSteps(reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedResources = tools;

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) {
      alert(t('compliance.lastStepDeleteError', '最後のステップは削除できません。少なくとも1つのステップが必要です。'));
      return;
    }
    setDeletingStepId(id);
  };

  const confirmDeleteStep = async () => {
    if (!deletingStepId) return;
    const remaining = steps.filter(s => s.id !== deletingStepId);
    // Re-map orders
    const updated = remaining.map((s, idx) => ({
      ...s,
      order: idx + 1
    }));
    await saveSteps(updated);
    setDeletingStepId(null);
  };

  const handleAddStepAt = (index: number) => {
    setEditingStep(null);
    setInsertAtIndex(index);
    setIsModalOpen(true);
  };

  const handleSaveStep = async (data: { title: string; description: string; icon: string }) => {
    let updatedSteps: Step[] = [];
    if (editingStep) {
      // Edit mode
      updatedSteps = steps.map(s => s.id === editingStep.id ? { ...s, ...data } : s);
    } else {
      // Add mode
      if (steps.length >= 6) {
        alert(t('compliance.maxStepsError', 'ステップは最大6つまでです。'));
        return;
      }
      const newStep: Step = {
        id: `step-${Date.now()}`,
        order: 0,
        icon: data.icon,
        title: data.title,
        description: data.description,
      };

      if (insertAtIndex !== null) {
        const temp = [...steps];
        temp.splice(insertAtIndex, 0, newStep);
        updatedSteps = temp;
      } else {
        updatedSteps = [...steps, newStep];
      }

      // Re-map orders
      updatedSteps = updatedSteps.map((s, idx) => ({
        ...s,
        order: idx + 1
      }));
    }
    await saveSteps(updatedSteps);
    setIsModalOpen(false);
    setEditingStep(null);
    setInsertAtIndex(null);
  };

  return (
    <div className="flex flex-col gap-[28px] w-full text-[#171a1f] dark:text-light font-base">

      {/* Category Pill Badge & Header title */}
      <div className="flex flex-col items-start gap-[12px]">
        {/* Title & description */}
        <h2 className="text-[36px] font-extrabold leading-[40px] text-[#171a1f] dark:text-light tracking-[-0.9px] font-base">
          {t('nav.complianceHub')}
        </h2>
        <p className="text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal w-full">
          {t('compliance.flowDescHelp', '薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した safeコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツ は 以下のステップに従って確認を行ってください。')}
        </p>
      </div>

      {/* Section 1: Review Flow */}
      <section className="bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_3px_rgba(23,26,31,0.05)] p-[20px] sm:p-[24px]">
        {/* Card Header (Collapsible trigger) */}
        <div
          onClick={() => setIsFlowExpanded(!isFlowExpanded)}
          className="flex justify-between items-center cursor-pointer select-none"
        >
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-[20px] sm:text-[22px] font-bold leading-[30px] text-[#171a1f] dark:text-light tracking-[-0.5px]">
              {t('compliance.flowTitle')}
            </h3>
            <p className="text-[13px] sm:text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
              {t('compliance.flowDesc')}
            </p>
          </div>

          <div className="flex items-center gap-[12px]">
            {isFlowExpanded && steps.length < 6 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingStep(null);
                  setInsertAtIndex(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-[6px] px-[14px] py-[8px] bg-[#5570f6] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#405bd4] transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('compliance.addStep')}
              </button>
            )}

            {/* Collapse / Expand Arrow Icon */}
            <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center border border-[#dee1e6] dark:border-midnight-800 text-[#565d6d] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-midnight-900 transition-all ${isFlowExpanded ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {isFlowExpanded && (
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-[32px] md:gap-[16px] w-full px-[16px] py-[24px] mt-[24px] bg-[#fafafb] dark:bg-midnight-900/40 rounded-[12px] border border-[#dee1e6]/60 dark:border-midnight-800/60 overflow-x-auto md:overflow-x-visible min-h-[220px]">
            {stepsLoading ? (
              <div className="py-[32px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
                {t('common.loading')}
              </div>
            ) : (
              <>
                {/* Continuous horizontal line behind circles on desktop */}
                {steps.length > 1 && (
                  <div className="hidden md:block absolute top-[60px] left-[91px] right-[91px] h-[2px] bg-[#dee1e6] dark:bg-midnight-800 z-0" />
                )}

                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`transition-all duration-200 cursor-move rounded-[12px] p-[4px] w-full max-w-[200px] md:w-[150px] md:max-w-none md:flex-shrink-0 ${draggedIndex === index ? 'opacity-40 scale-95' : ''
                        } ${dragOverIndex === index ? 'ring-2 ring-dashed ring-[#5570f6] bg-[#f1f4fe] dark:bg-midnight-900' : ''
                        }`}
                    >
                      <StepCard
                        step={step}
                        onEdit={() => {
                          setEditingStep(step);
                          setInsertAtIndex(null);
                          setIsModalOpen(true);
                        }}
                        onDelete={() => handleDeleteStep(step.id)}
                        canDelete={steps.length > 1}
                      />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 w-full md:w-auto md:mt-[4px] flex items-center justify-center">
                        <StepConnector
                          onClick={() => handleAddStepAt(index + 1)}
                          disabled={steps.length >= 6}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Tools & References */}
      <section className="flex flex-col gap-[28px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px]">
          <div>
            <h3 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
              {t('compliance.toolsTitle')}
            </h3>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
              {t('compliance.toolsDesc')}
            </p>
          </div>
          <button
            onClick={handleDownloadAll}
            className="flex-shrink-0 inline-flex items-center justify-center gap-[8px] h-[40px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 hover:border-[#5570f6] hover:text-[#5570f6] bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-semibold text-[#565d6d] dark:text-gray-400 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{t('compliance.bulkDownload')}</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-[12px] w-full">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            selectedStep={selectedStep}
            onStepChange={setSelectedStep}
            steps={steps}
            showStepFilter={true}
          />

          <div className="flex flex-col gap-[12px] w-full">
            <div className="flex items-center justify-between w-full">
              <ItemCount
                currentPage={currentPageSafe}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>

            {/* Cards Grid */}
            {toolsLoading ? (
              <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
                {t('common.loading')}
              </div>
            ) : paginatedResources.length > 0 ? (
              <div className="flex flex-col gap-[28px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                  {paginatedResources.map((resource, index) => (
                    <ToolCard key={`${resource.id}-${index}`} tool={resource} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPageSafe}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={total}
                  itemsPerPage={ITEMS_PER_PAGE}
                  hideItemCount={true}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full">
                <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                  {t('dashboard.noTools')}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('');
                    setSelectedStep('');
                  }}
                  className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
                >
                  {t('dashboard.clearFilter')}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step Add/Edit Modal */}
      <StepModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStep(null);
        }}
        onSave={handleSaveStep}
        initialData={editingStep}
      />

      {/* Step Delete Confirmation Modal */}
      {deletingStepId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
              <h3 className="text-[16px] font-bold text-[#171a1f] dark:text-light leading-[24px]">{t('compliance.deleteStepModalHeader', 'ステップの削除')}</h3>
              <button
                type="button"
                onClick={() => setDeletingStepId(null)}
                className="flex items-center justify-center w-[32px] h-[32px] rounded-full hover:bg-[#f3f4f6] dark:hover:bg-midnight-800 text-[#9095a0] hover:text-[#171a1f] dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px]">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-[24px] py-[20px]">
              <p className="text-[14px] leading-[22px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
                {t('compliance.deleteStepConfirmText', '「{{title}}」を削除してもよろしいですか？この操作は取り消せません。', { title: steps.find(s => s.id === deletingStepId)?.title })}
              </p>
            </div>

            {/* Footer */}
            <div className="px-[24px] py-[16px] bg-[#fafafb] dark:bg-midnight-900 border-t border-[#dee1e6] dark:border-midnight-800 flex justify-end gap-[12px]">
              <button
                type="button"
                onClick={() => setDeletingStepId(null)}
                className="h-[36px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-400 font-base font-medium text-[14px] transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteStep}
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
