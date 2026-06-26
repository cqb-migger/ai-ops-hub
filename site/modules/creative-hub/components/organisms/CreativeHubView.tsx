// 📁 modules/creative-hub/components/organisms/CreativeHubView.tsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Persona {
  id: string;
  name: string;
  description: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export default function CreativeHubView() {
  const personas: Persona[] = [
    {
      id: 'women',
      name: '20-30代 働く女性',
      description: '美容・健康・トレンドに関心が高く、タイムパフォーマンスを重視する層。',
    },
    {
      id: 'executives',
      name: '40-50代 経営者・役員',
      description: '業務効率化、コスト削減、組織課題の解決を求める決裁者層。',
    },
    {
      id: 'genz',
      name: 'Z世代 学生',
      description: 'SNSでの共感や映えを重視し、新しい体験に価値を見出す層。',
    },
  ];

  const templates: Template[] = [
    {
      id: 'pasona',
      name: 'PASONAの法則',
      description: '問題提起から煽り、解決策の提示へと繋げる王道のセールスライティング。',
    },
    {
      id: 'prep',
      name: 'PREP法',
      description: '結論から論理的に展開し、説得力を持たせるビジネスライティング。',
    },
    {
      id: 'storytelling',
      name: 'ストーリーテリング',
      description: '感情に訴えかけ、共感を生むことでブランドのファンを作る手法。',
    },
  ];

  const [selectedPersona, setSelectedPersona] = useState<string>('women');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('pasona');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const activePersona = personas.find((p) => p.id === selectedPersona) || personas[0];
  const activeTemplate = templates.find((t) => t.id === selectedTemplate) || templates[0];

  const promptText = React.useMemo(() => {
    let frameworkDetails = '';
    let toneDetails = '';

    if (selectedTemplate === 'pasona') {
      frameworkDetails = `1. メインキャッチコピー（3案）
2. サブコピー（3案）
3. PASONAの法則に基づく本文構成案`;
      toneDetails = 'ターゲットに寄り添う親しみやすさと、プロフェッショナルな信頼感を両立させること。';
    } else if (selectedTemplate === 'prep') {
      frameworkDetails = `1. メインキャッチコピー（3案）
2. サブコピー（3案）
3. PREP法（Point, Reason, Example, Point）に基づく構成案`;
      toneDetails = '論理的で分かりやすく、説得力のあるトーンにすること。';
    } else {
      frameworkDetails = `1. メインキャッチコピー（3案）
2. サブコピー（3案）
3. ストーリーテリング（導入・展開・解決・結末）に基づく本文構成案`;
      toneDetails = '感情に訴えかけ、共感を生むエモーショナルな表現にすること。';
    }

    return `以下の条件に従って、魅力的なキャッチコピーと広告文の構成案を生成してください。

【ターゲットペルソナ】
${activePersona.name}：${activePersona.description}

【訴求フレームワーク】
${activeTemplate.name}を適用すること。

【出力要件】
${frameworkDetails}
4. トーン＆マナー：${toneDetails}

【注意事項】
専門用語は避け、直感的にメリットが伝わる表現を心がけてください。`;
  }, [selectedPersona, selectedTemplate, activePersona, activeTemplate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      toast.success('プロンプトをクリップボードにコピーしました！');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('コピーに失敗しました。');
    }
  };

  return (
    <div className="flex flex-col gap-[28px] w-full text-[#171a1f] dark:text-light font-base animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col gap-[12px]">
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[30px] leading-[36px] tracking-[-0.75px] text-[#171a1f] dark:text-light">
          クリエイティブハブ
        </h1>
        <p className="font-normal text-[16px] leading-[24px] text-[#565d6d] dark:text-gray-400">
          ペルソナと訴求手法を選択し、各AIツールに最適なプロンプトテンプレートを生成します。
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[28px] items-start w-full">
        
        {/* Left Column: Selections */}
        <section className="lg:col-span-5 flex flex-col gap-[28px] w-full">
          
          {/* Section 1: Target Persona */}
          <div className="flex flex-col gap-[16px] w-full">
            <header className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] rounded-lg bg-primary-50 dark:bg-midnight-800 flex items-center justify-center text-primary dark:text-primary-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
                1. ターゲットペルソナの選択
              </h2>
            </header>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400">
              誰に向けてメッセージを発信するかを定義します。
            </p>

            <div className="flex flex-col gap-[12px] w-full">
              {personas.map((p) => {
                const isActive = p.id === selectedPersona;
                return (
                  <article
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`flex items-start gap-[16px] p-[16px] border rounded-[6px] cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-midnight-800 border-primary dark:border-primary-500 shadow-sm'
                        : 'bg-light dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 hover:border-gray-400 dark:hover:border-midnight-600'
                    }`}
                  >
                    <div className={`w-[32px] h-[32px] rounded-full shrink-0 flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-midnight-800 text-gray-500'
                    }`}>
                      {p.id === 'women' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                      {p.id === 'executives' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      )}
                      {p.id === 'genz' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px] flex-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[14px] text-[#171a1f] dark:text-light">{p.name}</span>
                        {isActive && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[12px] leading-[16px] text-[#565d6d] dark:text-gray-400">{p.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Section 2: Appeal Template */}
          <div className="flex flex-col gap-[16px] w-full">
            <header className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] rounded-lg bg-primary-50 dark:bg-midnight-800 flex items-center justify-center text-primary dark:text-primary-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
                2. 訴求テンプレートの選択
              </h2>
            </header>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400">
              効果的な情報伝達のためのフレームワークを選択します。
            </p>

            <div className="flex flex-col gap-[12px] w-full">
              {templates.map((t) => {
                const isActive = t.id === selectedTemplate;
                return (
                  <article
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`flex items-start gap-[16px] p-[16px] border rounded-[6px] cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-midnight-800 border-primary dark:border-primary-500 shadow-sm'
                        : 'bg-light dark:bg-midnight-900 border-[#dee1e6] dark:border-midnight-800 hover:border-gray-400 dark:hover:border-midnight-600'
                    }`}
                  >
                    <div className={`w-[32px] h-[32px] rounded-full shrink-0 flex items-center justify-center ${
                      isActive ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-midnight-800 text-gray-500'
                    }`}>
                      {t.id === 'pasona' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      )}
                      {t.id === 'prep' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      )}
                      {t.id === 'storytelling' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-[4px] flex-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-[14px] text-[#171a1f] dark:text-light">{t.name}</span>
                        {isActive && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[12px] leading-[16px] text-[#565d6d] dark:text-gray-400">{t.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right Column: Generated Prompt Box & Tool Redirection */}
        <section className="lg:col-span-7 flex flex-col gap-[28px] w-full">
          
          {/* Prompt Display Card */}
          <div className="flex flex-col bg-white dark:bg-midnight-950 border border-[#dee1e6] dark:border-midnight-800 rounded-[10px] shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07),0px_0px_2px_0px_rgba(23,26,31,0.08)] overflow-hidden h-[400px]">
            {/* Card Header */}
            <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#dee1e6] dark:border-midnight-800 bg-[#fafafb]/50 dark:bg-midnight-900/50">
              <div className="flex items-center gap-[8px]">
                <div className="text-primary dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[16px] text-[#171a1f] dark:text-light">
                  生成されたプロンプト
                </h3>
              </div>
              
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-[6px] px-[14px] py-[8px] rounded-[6px] font-medium text-[14px] text-white shadow-[0px_1px_2.5px_0px_rgba(23,26,31,0.07)] transition-all duration-150 ${
                  isCopied
                    ? 'bg-green-400 hover:bg-[#00a679]'
                    : 'bg-primary hover:bg-[#2c4cb8]'
                }`}
              >
                {isCopied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    コピー完了
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    クリップボードにコピー
                  </>
                )}
              </button>
            </div>
            
            {/* Card Body */}
            <div className="flex-1 p-[24px] overflow-y-auto bg-[#fafafb]/20 dark:bg-midnight-950/20 font-mono text-[14px] leading-[23px] text-[#171a1f] dark:text-gray-300 whitespace-pre-wrap select-all">
              {promptText}
            </div>
          </div>

          {/* AI Tools Redirect Section */}
          <div className="flex flex-col gap-[16px] w-full">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] leading-[28px] text-[#171a1f] dark:text-light">
              推奨AIツールへの遷移
            </h3>
            <p className="text-[14px] leading-[20px] text-[#565d6d] dark:text-gray-400">
              コピーしたプロンプトを以下のツールにペーストして作業を続行します。
            </p>

            {/* AI Tools Card List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] w-full">
              
              {/* ChatGPT Card */}
              <a
                href="https://chatgpt.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => toast.success('ChatGPT を開いています...')}
                className="flex flex-col justify-between h-[150px] p-[20px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#171a1f] dark:text-light group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
                      ChatGPT
                    </span>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#fafafb] dark:bg-midnight-800 flex items-center justify-center text-[#8c94b3] group-hover:bg-primary-50 dark:group-hover:bg-midnight-700 group-hover:text-primary transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] transform group-hover:translate-x-[1px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[16px] text-[#565d6d] dark:text-gray-400">
                    テキスト生成・構成案
                  </p>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    GPT-4o
                  </span>
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    文章作成
                  </span>
                </div>
              </a>

              {/* Claude Card */}
              <a
                href="https://claude.ai/"
                target="_blank"
                rel="noreferrer"
                onClick={() => toast.success('Claude を開いています...')}
                className="flex flex-col justify-between h-[150px] p-[20px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#171a1f] dark:text-light group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
                      Claude
                    </span>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#fafafb] dark:bg-midnight-800 flex items-center justify-center text-[#8c94b3] group-hover:bg-primary-50 dark:group-hover:bg-midnight-700 group-hover:text-primary transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] transform group-hover:translate-x-[1px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[16px] text-[#565d6d] dark:text-gray-400">
                    自然な文章作成・校正
                  </p>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    Sonnet 3.5
                  </span>
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    長文処理
                  </span>
                </div>
              </a>

              {/* Midjourney Card */}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => toast.success('Midjourney を開いています...')}
                className="flex flex-col justify-between h-[150px] p-[20px] bg-white dark:bg-midnight-900 border border-[#dee1e6] dark:border-midnight-800 rounded-[6px] hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 group cursor-pointer"
              >
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#171a1f] dark:text-light group-hover:text-primary dark:group-hover:text-primary-300 transition-colors">
                      Midjourney
                    </span>
                    <div className="w-[24px] h-[24px] rounded-full bg-[#fafafb] dark:bg-midnight-800 flex items-center justify-center text-[#8c94b3] group-hover:bg-primary-50 dark:group-hover:bg-midnight-700 group-hover:text-primary transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] transform group-hover:translate-x-[1px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[16px] text-[#565d6d] dark:text-gray-400">
                    バナー用画像生成
                  </p>
                </div>
                <div className="flex flex-wrap gap-[6px]">
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    画像生成
                  </span>
                  <span className="px-[8px] py-[2px] bg-gray-100 dark:bg-midnight-800 text-[#1e2128] dark:text-gray-300 text-[10px] font-normal rounded-[9px]">
                    高品質
                  </span>
                </div>
              </a>

            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
