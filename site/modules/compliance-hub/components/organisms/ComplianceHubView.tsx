import React, { useState, useMemo, useEffect } from 'react';
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


export default function ComplianceHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isFlowExpanded, setIsFlowExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStep, setSelectedStep] = useState('');

  const { tools, loading: toolsLoading } = useTools({ category: 'compliance', visibility: 'public' });
  const { steps, saveSteps, loading: stepsLoading } = useSteps();

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedStep]);

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

  const filteredResources = useMemo(() => {
    const complianceTools = [...tools, ...tools];
    return complianceTools.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRole === '' || resource.role === selectedRole;

      // Mock implementation: Since backend doesn't have stepId yet, if a step is selected, 
      // we filter. Currently we might not have `stepId` on `resource`. 
      // Let's assume `resource` will have `stepId`. If it doesn't, we can simulate it.
      // For now, let's just do `resource as any` to avoid TS error if stepId isn't on Tool type.
      const matchesStep = 
        selectedStep === '' || (resource as any).stepId === selectedStep;

      return matchesSearch && matchesRole && matchesStep;
    });
  }, [tools, searchQuery, selectedRole, selectedStep]);

  const ITEMS_PER_PAGE = 16;
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const currentPageSafe = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedResources = useMemo(() => {
    const startIdx = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredResources, currentPageSafe]);

  const handleDeleteStep = async (id: string) => {
    if (steps.length <= 1) {
      alert('最後のステップは削除できません。少なくとも1つのステップが必要です。');
      return;
    }
    if (window.confirm('このステップを削除してもよろしいですか？')) {
      const remaining = steps.filter(s => s.id !== id);
      // Re-map orders
      const updated = remaining.map((s, idx) => ({
        ...s,
        order: idx + 1
      }));
      await saveSteps(updated);
    }
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
        alert('ステップは最大6つまでです。');
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
          コンプライアンスハブ
        </h2>
        <p className="text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal w-full">
          薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した安全なコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツ は 以下のステップに従って確認を行ってください。
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
              標準レビューフロー
            </h3>
            <p className="text-[13px] sm:text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
              コンテンツ作成から公開までの必須手順 (ドラッグ＆ドロップで並び替え可能)
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
                ステップを追加
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
                読み込み中...
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
              ツール & リファレンス
            </h3>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
              チェック業務に必要なシステムや文書へのリンク
            </p>
          </div>
          <a
            href="/assets/compliance_guideline.txt"
            download="compliance_guideline.txt"
            className="flex-shrink-0 inline-flex items-center justify-center gap-[8px] h-[40px] px-[16px] border border-[#dee1e6] dark:border-midnight-800 hover:border-[#5570f6] hover:text-[#5570f6] bg-white dark:bg-midnight-900 rounded-[8px] text-[14px] font-semibold text-[#565d6d] dark:text-gray-400 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>一括ダウンロード</span>
          </a>
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
              totalItems={filteredResources.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
            <button className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px] border border-[#dee1e6] dark:border-midnight-800 bg-white dark:bg-midnight-900 text-[#565d6d] dark:text-gray-400 hover:bg-[#f3f4f6] dark:hover:bg-midnight-800 transition-colors" title="名前順で並び替え">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 17h10"/>
                <path d="M11 13h7"/>
                <path d="M11 9h4"/>
                <path d="m3 16 4 4 4-4"/>
                <path d="M7 20V4"/>
              </svg>
            </button>
          </div>

          {/* Cards Grid */}
          {toolsLoading ? (
            <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
              読み込み中...
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="flex flex-col gap-[28px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                {paginatedResources.map((resource, index) => (
                  <ToolCard key={`${resource.id}-${index}`} tool={resource} />
                ))}
              </div>
              <Pagination
                currentPage={currentPageSafe}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredResources.length}
                itemsPerPage={ITEMS_PER_PAGE}
                hideItemCount={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full">
              <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
                条件に一致するツールが見つかりませんでした。
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('');
                }}
                className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
              >
                フィルターをクリア
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
    </div>
  );
}
