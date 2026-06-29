import React, { useState, useMemo } from 'react';
import FilterBar from '../../../dashboard/components/molecules/FilterBar';
import ToolCard from '../../../dashboard/components/molecules/ToolCard';
import { useTools } from '../../../../base/hooks/useTools';
import { useSteps } from '../../../../base/hooks/useSteps';
import { Step } from '../../constants/steps';
import StepCard from '../molecules/StepCard';
import StepModal from '../molecules/StepModal';
import StepConnector from '../molecules/StepConnector';


export default function ComplianceHubView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { tools, loading: toolsLoading } = useTools({ hub: 'compliance' });
  const { steps, saveSteps, loading: stepsLoading } = useSteps();

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

      return matchesSearch;
    });
  }, [tools, searchQuery]);

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
    <div className="flex flex-col gap-[36px] w-full text-[#171a1f] dark:text-light font-base">
      
      {/* Category Pill Badge & Header title */}
      <div className="flex flex-col items-start gap-[12px]">
        {/* Title & description */}
        <h2 className="text-[36px] font-extrabold leading-[40px] text-[#171a1f] dark:text-light tracking-[-0.9px] font-base">
          法務・規制チェック プロセス
        </h2>
        <p className="text-[18px] leading-[29px] text-[#565d6d] dark:text-gray-400 font-normal w-full">
          薬機法（医薬品医療機器等法）および景表法（景品表示法）に準拠した安全なコンテンツ発信のためのガイドラインとツールを提供します。すべての外部公開コンテンツ is 以下のステップに従って確認を行ってください。
        </p>
      </div>

      {/* Section 1: Review Flow */}
      <section className="flex flex-col gap-[20px] mt-[12px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[12px]">
          <div>
            <h3 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
              標準レビューフロー
            </h3>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
              コンテンツ作成から公開までの必須手順 (ドラッグ＆ドロップで並び替え可能)
            </p>
          </div>
          {steps.length < 6 && (
            <button
              onClick={() => {
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
        </div>

        {/* Dynamic Step Diagram */}
        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-[32px] md:gap-[16px] w-full px-[16px] py-[24px] mt-[16px] isolate">
          {stepsLoading ? (
            <div className="py-[16px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
              読み込み中...
            </div>
          ) : (
            <>
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`transition-all duration-200 cursor-move rounded-[12px] p-[4px] w-full max-w-[200px] md:w-[150px] md:max-w-none md:flex-shrink-0 ${
                      draggedIndex === index ? 'opacity-40 scale-95' : ''
                    } ${
                      dragOverIndex === index ? 'ring-2 ring-dashed ring-[#5570f6] bg-[#f1f4fe] dark:bg-midnight-900' : ''
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
                    <div className="flex-1 w-full md:w-auto md:mt-[4px] flex items-center">
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
      </section>

      {/* Section 2: Tools & References */}
      <section className="flex flex-col gap-[20px] mt-[12px]">
        <div>
          <h3 className="text-[24px] font-bold leading-[32px] text-[#171a1f] dark:text-light tracking-[-0.6px]">
            ツール & リファレンス
          </h3>
          <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400 font-normal">
            チェック業務に必要なシステムや文書へのリンク
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={false}
        />

        {/* Cards Grid */}
        {toolsLoading ? (
          <div className="py-[48px] text-center text-[#565d6d] dark:text-gray-400 font-base w-full">
            読み込み中...
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] mt-[12px]">
            {filteredResources.map((resource, index) => (
              <ToolCard key={`${resource.id}-${index}`} tool={resource} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-[48px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[16px] text-center w-full mt-[12px]">
            <p className="text-[16px] text-[#565d6d] dark:text-gray-400 font-medium font-base">
              条件に一致するツールが見つかりませんでした。
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
              }}
              className="mt-[16px] text-[14px] text-[#5570f6] font-semibold hover:underline"
            >
              フィルターをクリア
            </button>
          </div>
        )}
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
