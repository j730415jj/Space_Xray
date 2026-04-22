
import React from 'react';
import { motion } from 'motion/react';
import { Download, Bookmark, Zap, Lock, ShieldCheck, ChevronRight, BarChart2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { DesignResult } from '../types';

import { useLanguage } from '../contexts/LanguageContext';

interface ResultsProps {
  result: DesignResult;
}

export function Results({ result }: ResultsProps) {
  const { language } = useLanguage();
  
  const labels = {
    ko: {
      tag: "건축적 분석",
      title: "AI 생성 디자인 결과",
      desc: "테마를 기반으로 정교하게 분석된 현장 맞춤형 공간 최적화 솔루션입니다.",
      remaining: "남은 편집 횟수",
      edits: "무료 수정",
      variation: "베리에이션",
      v1Title: "자연광 최적화 구조",
      v1Desc: "남향 창의 조도를 극대화하기 위해 배치된 가구와 부드러운 텍스처의 조화.",
      download: "고해상도 리포트 다운로드",
      save: "내 컬렉션에 저장하기",
      summary: "공간 구성 기본 요약",
      fit: "구조적 적합성 분석",
      fitDesc: "AI 알고리즘이 분석한 결과, 해당 제안은 기존 공간 구조 레이아웃과",
      compatibility: "의 호환성",
      proTitle: "PRO 건축가 전용 리포트",
      proDesc: "자재 명세서(BOM), 가구 소싱 카탈로그, 그리고 상세 구조 히트맵 데이터가 포함되어 있습니다.",
      proBtn: "Vision Pro 멤버십 시작하기",
      proTag: "프리미엄 통찰력 잠금 해제"
    },
    en: {
      tag: "Architectural Analysis",
      title: "AI Design Results",
      desc: "Site-specific space optimization solutions based on your chosen theme.",
      remaining: "Remaining Edits",
      edits: "Free Edits",
      variation: "Variation",
      v1Title: "Natural Light Optimization",
      v1Desc: "A harmony of furniture and soft textures arranged to maximize lighting from south-facing windows.",
      download: "Download High-Res Report",
      save: "Save to My Collection",
      summary: "Space Configuration Summary",
      fit: "Structural Suitability Analysis",
      fitDesc: "AI algorithms show this proposal has",
      compatibility: "compatibility",
      proTitle: "PRO Architect Report",
      proDesc: "Includes Bill of Materials (BOM), sourcing catalogs, and detailed heatmaps.",
      proBtn: "Start Vision Pro Membership",
      proTag: "Unlocking Premium Insights"
    },
    jp: {
      tag: "建築的分析",
      title: "AI生成デザイン結果",
      desc: "テーマに基づき精교에 분석된, 現場カスタマイズ型の空間最適化ソリューションです。",
      remaining: "残り編集回数",
      edits: "無料修正",
      variation: "バリエーション",
      v1Title: "自然光最適化構造",
      v1Desc: "南向き窓の照度を最大限に引き出すための家具配置とソフトな質感の調和。",
      download: "高解像度レポートをダウンロード",
      save: "マイコレクションに保存",
      summary: "空間構成の基本要約",
      fit: "構造的適合性分析",
      fitDesc: "AIアルゴリズムによる分析結果、この提案は既存の空間構造レイアウトと",
      compatibility: "の互換性",
      proTitle: "PRO建築家専用レポート",
      proDesc: "資材明細(BOM)、家具調達カタログ、および詳細な構造ヒートマップデータが含まれています。",
      proBtn: "Vision Proメンバーシップを開始",
      proTag: "プレミアムインサイトのロック解除"
    }
  }[language];
  return (
    <div className="h-full w-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 overflow-y-auto overflow-x-hidden scrollbar-hide pb-32">
      {/* Header */}
      <header className="mb-8 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
            <span className="w-8 h-[1px] bg-primary"></span>
            {labels.tag}
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight mb-4">{labels.title}</h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            {result.style} {labels.desc}
          </p>
        </div>
        
        <div className="bg-surface-muted border border-border px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            <Zap className="w-6 h-6 text-primary fill-primary relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">{labels.remaining}</span>
            <span className="font-headline text-sm font-extrabold">{labels.edits} 5 / 30</span>
          </div>
        </div>
      </header>

      {/* Main Showcase */}
      <section className="mb-20 grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
          <img 
            src={result.imageUrl} 
            alt="Result" 
            className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-[10px] uppercase tracking-widest border border-white/10">
                {labels.variation} 01
              </span>
              <h3 className="text-3xl md:text-4xl font-headline font-black">{labels.v1Title}</h3>
              <p className="text-white/60 max-w-md text-sm leading-relaxed">{labels.v1Desc}</p>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button className="flex-1 bg-primary text-white p-6 rounded-[2rem] font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all hover:-translate-y-1 shadow-xl shadow-primary/20">
            <Download className="w-5 h-5" />
            {labels.download}
          </button>
          <button className="flex-1 bg-surface-muted border border-border p-6 rounded-[2rem] font-headline font-bold text-lg flex items-center justify-center gap-3 hover:bg-surface-muted/80 transition-all">
            <Bookmark className="w-5 h-5" />
            {labels.save}
          </button>
        </div>
      </section>

      {/* Analysis Grid */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-surface-muted p-10 rounded-[2.5rem] border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">analytics</span>
            </div>
            <div>
              <h2 className="font-headline text-2xl font-black tracking-tight">{labels.summary}</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-0.5">Primary Space Analysis</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <AnalysisCard label="Core Design Style" value={result.analysis.coreStyle} subValue="Main" />
            <AnalysisCard label="Color Harmony" value={result.analysis.colorHarmony.join(', ')} colors={result.analysis.colorHarmony} />
          </div>

          {result.analysis.fineTuning && (
            <div className="mb-10 p-6 bg-surface rounded-3xl border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Fine-Tuning Applied</span>
              </div>
              <div className="flex gap-4">
                {[
                  { label: language === 'ko' ? '모던함' : 'Modernity', value: result.analysis.fineTuning.modernity },
                  { label: language === 'ko' ? '아늑함' : 'Coziness', value: result.analysis.fineTuning.coziness },
                  { label: language === 'ko' ? '미니멀리즘' : 'Minimalism', value: result.analysis.fineTuning.minimalism },
                ].map((p, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-[10px] text-text-muted mb-1 font-bold">{p.label}</div>
                    <div className="text-sm font-black text-primary">{p.value}%</div>
                    <div className="w-full h-1 bg-surface-muted rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${p.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h4 className="font-headline font-extrabold text-lg tracking-tight">{labels.fit}</h4>
            </div>
            <p className="text-white/70 leading-relaxed text-base">
              {labels.fitDesc} <span className="text-primary font-bold">{result.analysis.suitability}%{labels.compatibility}</span>를 보입니다. 
              {language === 'ko' ? result.analysis.details : 'Structural balance is achieved through precise AI analysis.'}
            </p>
          </div>
        </div>

        {/* Pro Unlock Card */}
        <div className="lg:col-span-5">
          <div className="relative h-full bg-zinc-900 p-1 rounded-[2.5rem] shadow-2xl overflow-hidden pro-glow border border-white/5">
            <div className="bg-black/40 backdrop-blur-3xl rounded-[2.25rem] p-8 h-full relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-tr from-primary via-blue-400 to-primary rounded-3xl rotate-12 flex items-center justify-center mb-8 shadow-2xl shadow-primary/50 mx-auto">
                  <Lock className="w-10 h-10 text-white -rotate-12 fill-white" />
                </div>
                <h3 className="font-headline text-2xl font-black text-white mb-3 tracking-tight">{labels.proTitle}</h3>
                <p className="text-sm text-white/40 mb-8 max-w-[240px] leading-relaxed mx-auto">{labels.proDesc}</p>
                <button className="w-full bg-white text-black px-6 py-5 rounded-2xl font-headline font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all shadow-xl">
                  {labels.proBtn}
                </button>
                <p className="mt-4 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">{labels.proTag}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ label, value, subValue, colors }: any) {
  return (
    <div className="p-6 bg-surface rounded-2xl border border-border">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">{label}</span>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="font-headline font-extrabold text-lg tracking-tight uppercase">{typeof value === 'string' && value.length > 20 ? value.substring(0, 17) + '...' : value}</span>
          {subValue && <span className="text-[10px] text-primary font-bold">{subValue}</span>}
        </div>
        {colors && (
          <div className="flex gap-1.5 flex-wrap">
            {colors.map((color: string, i: number) => (
              <div 
                key={i} 
                className="w-5 h-5 rounded-full ring-2 ring-surface shadow-inner" 
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
