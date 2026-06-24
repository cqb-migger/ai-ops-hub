import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface ManagedTool {
  id: string;
  name: string;
  description: string;
  category: string;
  teams: string[];
  extraTeamCount?: number;
  status: string;
  imageUrl: string;
}

const INITIAL_TOOLS: ManagedTool[] = [
  {
    id: 'chatpro-enterprise',
    name: 'ChatPro Enterprise',
    description: '汎用的なテキスト生成、コード作成、データ分析をサポートする高度なAIアシスタント。',
    category: 'LLM / 对话型AI',
    teams: ['全社', '開発'],
    extraTeamCount: 1,
    status: '公開中',
    imageUrl: 'http://localhost:3845/assets/48bb8541d7c0769e311742688649f4c8bd0e0b29.png',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: '高品質なコンセプトアートやマーケティング用ビジュアルを生成するAIツール。',
    category: '画像生成',
    teams: ['デザイン', 'マーケティング'],
    status: '公開中',
    imageUrl: 'http://localhost:3845/assets/3cbb79e7bb9709e7da467c53d555258f2fa56af6.png',
  },
  {
    id: 'designgenius-ai',
    name: 'DesignGenius AI',
    description: 'エディタ内でリアルタイムにコード補完やテストコード生成を行うAIペアプログラマー。',
    category: '開発支援',
    teams: ['開発'],
    status: '公開中',
    imageUrl: 'http://localhost:3845/assets/efb4c35a8fdab57789ecd52490543dadb4a3a3c0.png',
  },
];

// Icons
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-[#565d6d] dark:text-gray-400">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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

export default function ToolManagementTable() {
  const router = useRouter();
  const [tools, setTools] = useState<ManagedTool[]>(INITIAL_TOOLS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tools, searchQuery]);

  const handleAddNew = () => {
    router.push('/manage-tools/new');
  };

  const handleEdit = (name: string) => {
    toast.success(`${name} の編集画面を開きます (シミュレーション)`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${name} を削除してもよろしいですか？`)) {
      setTools(tools.filter((t) => t.id !== id));
      toast.success(`${name} を削除しました`);
    }
  };

  return (
    <div className="flex flex-col gap-[28px] w-full">
      {/* Title section with Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <h2 className="text-[30px] font-bold leading-[36px] text-[#171a1f] dark:text-light tracking-[-0.75px] font-base">
            ツール管理
          </h2>
          <p className="text-[14px] font-normal leading-[20px] text-[#565d6d] dark:text-gray-400 font-base">
            AIツールのディレクトリを管理します。新しいツールの登録、既存ツールの編集、削除が可能です。
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-[8px] h-[40px] px-[16px] bg-[#5570f6] text-white hover:bg-primary-600 rounded-[6px] shadow-sm font-base font-medium text-[14px] transition-all duration-200"
        >
          <PlusIcon />
          <span>新規追加</span>
        </button>
      </div>

      {/* Search & filter row */}
      <div className="flex items-center gap-[16px]">
        {/* Search input */}
        <div className="relative flex items-center w-[319px] h-[39px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] px-[12px] gap-[8px]">
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ツール名や説明で検索..."
            className="w-full bg-transparent border-none outline-none text-[14px] leading-[22px] text-[#171a1f] dark:text-light placeholder-[#565d6d] dark:placeholder-gray-500 font-base"
          />
        </div>

        {/* Funnel button */}
        <button className="flex items-center justify-center w-[40px] h-[40px] bg-[#fafafb] dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:bg-primary-50 dark:hover:bg-midnight-800 transition-colors duration-200">
          <FunnelIcon />
        </button>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px]">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#fafafb] dark:bg-midnight-900 border-b border-[#dee1e6] dark:border-midnight-800">
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[400px]">
                ツール名
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[180px]">
                カテゴリ
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base w-[220px]">
                対象チーム
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-center w-[120px]">
                ステータス
              </th>
              <th className="py-[14px] px-[20px] text-[14px] font-semibold text-[#171a1f] dark:text-light font-base text-right w-[120px]">
                アクション
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <tr
                  key={tool.id}
                  className="border-b border-[#dee1e6] dark:border-midnight-800 hover:bg-[#fafafb]/50 dark:hover:bg-midnight-900/50 transition-colors duration-150"
                >
                  {/* Tool name & image */}
                  <td className="py-[16px] px-[20px] flex items-start gap-[12px]">
                    <div className="relative flex-shrink-0 w-[40px] h-[40px] rounded-[4px] overflow-hidden bg-gray-100 dark:bg-midnight-800 border border-[#dee1e6] dark:border-midnight-700 flex items-center justify-center">
                      <img
                        src={tool.imageUrl}
                        alt={tool.name}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="hidden absolute inset-0 items-center justify-center text-[14px] font-bold text-[#5570f6] dark:text-primary-400 font-base select-none">
                        {tool.name.charAt(0)}
                      </div>
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
                    <span className="inline-flex items-center justify-center bg-[#f3f4f6] dark:bg-midnight-800 text-[12px] font-semibold text-[#1e2128] dark:text-gray-300 rounded-[11px] px-[12px] h-[22px] font-base whitespace-nowrap">
                      {tool.category}
                    </span>
                  </td>

                  {/* Teams */}
                  <td className="py-[16px] px-[20px]">
                    <div className="flex flex-wrap gap-[6px] items-center">
                      {tool.teams.map((team) => (
                        <span
                          key={team}
                          className="bg-[#f3f4f6] dark:bg-midnight-800 text-[12px] font-normal text-[#565d6d] dark:text-gray-300 rounded-[6px] px-[8px] h-[24px] flex items-center justify-center font-base"
                        >
                          {team}
                        </span>
                      ))}
                      {tool.extraTeamCount && tool.extraTeamCount > 0 && (
                        <span className="bg-[#f3f4f6] dark:bg-midnight-800 text-[12px] font-normal text-[#565d6d] dark:text-gray-300 rounded-[6px] px-[8px] h-[24px] flex items-center justify-center font-base">
                          +{tool.extraTeamCount}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-[16px] px-[20px] text-center">
                    <span className="inline-flex items-center justify-center gap-[6px] text-[12px] font-semibold text-[#171a1f] dark:text-light font-base">
                      <CircleCheckIcon />
                      <span>{tool.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-[16px] px-[20px] text-right">
                    <div className="flex items-center justify-end gap-[8px]">
                      <button
                        onClick={() => handleEdit(tool.name)}
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] hover:bg-gray-100 dark:hover:bg-midnight-800 text-[#565d6d] dark:text-gray-300 transition-colors duration-200"
                        title="編集"
                      >
                        <PenIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="w-[40px] h-[40px] flex items-center justify-center rounded-[6px] hover:bg-red-50 dark:hover:bg-red-950/30 text-[#f25a5a] transition-colors duration-200"
                        title="削除"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-[48px] px-[20px] text-center text-[#565d6d] dark:text-gray-400 font-base">
                  条件に一致するツールが見つかりませんでした。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
