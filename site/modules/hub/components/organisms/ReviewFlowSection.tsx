import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'next-i18next';
import { Step } from '../../../../base/types/steps';
import StepCard from '../../../../base/components/molecules/StepCard';
import StepModal from '../../../../base/components/molecules/StepModal';
import StepConnector from '../../../../base/components/molecules/StepConnector';

interface ReviewFlowSectionProps {
  steps: Step[];
  saveSteps: (steps: Step[]) => Promise<any>;
  stepsLoading: boolean;
  isAdmin: boolean;
}

/**
 * The compliance-style "Review Flow" — a collapsible, drag-orderable list of steps.
 * Steps are global (one shared set), so this section only needs the shared step state.
 */
export default function ReviewFlowSection({ steps, saveSteps, stepsLoading, isAdmin }: ReviewFlowSectionProps) {
  const { t } = useTranslation('common');
  const [isFlowExpanded, setIsFlowExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [deletingStepId, setDeletingStepId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) setDragOverIndex(index);
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
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setDraggedIndex(null);
    setDragOverIndex(null);
    await saveSteps(reordered);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) {
      alert(t('compliance.lastStepDeleteError', '最後のステップは削除できません。少なくとも1つのステップが必要です。'));
      return;
    }
    setDeletingStepId(id);
  };
  const confirmDeleteStep = async () => {
    if (!deletingStepId) return;
    const remaining = steps.filter((s) => s.id !== deletingStepId);
    const updated = remaining.map((s, idx) => ({ ...s, order: idx + 1 }));
    try {
      await saveSteps(updated);
      setDeletingStepId(null);
    } catch (err: any) {
      toast.error(err?.message || t('compliance.deleteStepFailed', 'ステップの削除に失敗しました。'));
      setDeletingStepId(null);
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
      updatedSteps = steps.map((s) => (s.id === editingStep.id ? { ...s, ...data } : s));
    } else {
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
      updatedSteps = updatedSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    }
    await saveSteps(updatedSteps);
    setIsModalOpen(false);
    setEditingStep(null);
    setInsertAtIndex(null);
  };

  return (
    <section className="bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] shadow-[0px_1px_3px_rgba(23,26,31,0.05)] p-[20px] sm:p-[24px]">
      {/* Card Header (Collapsible trigger) */}
      <div
        onClick={() => setIsFlowExpanded(!isFlowExpanded)}
        className="flex justify-between items-center cursor-pointer select-none"
      >
        <div className="flex flex-col gap-[4px]">
          <h3 className="text-[20px] sm:text-[22px] font-bold leading-[30px] text-[#171a1f] dark:text-light tracking-[-0.5px] font-base">
            {t('compliance.flowTitle')}
          </h3>
          <p className="text-[13px] sm:text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
            {t('compliance.flowDesc')}
          </p>
        </div>

        <div className="flex items-center gap-[12px] flex-shrink-0">
          {isAdmin && isFlowExpanded && steps.length < 6 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingStep(null);
                setInsertAtIndex(null);
                setIsModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-[6px] px-[14px] py-[8px] bg-[#5570f6] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#405bd4] transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t('compliance.addStep')}
            </button>
          )}
          <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center border border-[#dee1e6] dark:border-midnight-800 text-[#565d6d] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-midnight-900 transition-all ${isFlowExpanded ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Add Step — mobile only, own row */}
      {isAdmin && isFlowExpanded && steps.length < 6 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingStep(null);
            setInsertAtIndex(null);
            setIsModalOpen(true);
          }}
          className="sm:hidden mt-[16px] w-full flex items-center justify-center gap-[6px] px-[14px] py-[10px] bg-[#5570f6] text-white text-[14px] font-bold rounded-[8px] hover:bg-[#405bd4] transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('compliance.addStep')}
        </button>
      )}

      {/* Collapsible Content */}
      {isFlowExpanded && (
        <div className="w-full mt-[24px] bg-[#fafafb] dark:bg-midnight-900/40 rounded-[12px] border border-[#dee1e6]/60 dark:border-midnight-800/60 overflow-x-auto min-h-[220px]">
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-[20px] md:gap-[16px] w-full md:w-max md:min-w-full px-[12px] md:px-[16px] py-[16px] md:py-[24px]">
            {stepsLoading ? (
              <div className="py-[32px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
                {t('common.loading')}
              </div>
            ) : (
              <>
                {steps.length > 1 && (
                  <div className="hidden md:block absolute top-[60px] left-[91px] right-[91px] h-[2px] bg-[#dee1e6] dark:bg-midnight-800 z-0" />
                )}
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div
                      draggable={isAdmin}
                      onDragStart={isAdmin ? (e) => handleDragStart(e, index) : undefined}
                      onDragOver={isAdmin ? (e) => handleDragOver(e, index) : undefined}
                      onDrop={isAdmin ? (e) => handleDrop(e, index) : undefined}
                      onDragEnd={isAdmin ? handleDragEnd : undefined}
                      className={`transition-all duration-200 rounded-[12px] p-[4px] w-full max-w-[280px] md:flex-1 md:min-w-[180px] md:max-w-none md:flex-shrink-0 ${isAdmin ? 'cursor-move' : ''
                        } ${draggedIndex === index ? 'opacity-40 scale-95' : ''
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
                        isAdmin={isAdmin}
                      />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 w-full md:w-auto md:min-w-[48px] md:mt-[4px] flex items-center justify-center">
                        <StepConnector
                          onClick={() => handleAddStepAt(index + 1)}
                          disabled={!isAdmin || steps.length >= 6}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px] bg-black/40 backdrop-blur-[2px]">
          <div className="w-full max-w-[440px] bg-white dark:bg-midnight-950 rounded-[16px] shadow-[0_8px_40px_rgba(23,26,31,0.18)] border border-[#dee1e6] dark:border-midnight-800 overflow-hidden">
            <div className="flex items-center justify-between px-[16px] sm:px-[24px] py-[16px] sm:py-[20px] border-b border-[#dee1e6] dark:border-midnight-800">
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
            <div className="px-[16px] sm:px-[24px] py-[16px] sm:py-[20px]">
              <p className="text-[14px] leading-[22px] text-[#565d6d] dark:text-gray-400 font-base font-normal">
                {t('compliance.deleteStepConfirmText', '「{{title}}」を削除してもよろしいですか？この操作は取り消せません。', { title: steps.find((s) => s.id === deletingStepId)?.title })}
              </p>
            </div>
            <div className="px-[16px] sm:px-[24px] py-[16px] bg-[#fafafb] dark:bg-midnight-900 border-t border-[#dee1e6] dark:border-midnight-800 flex justify-between gap-[12px]">
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
    </section>
  );
}
