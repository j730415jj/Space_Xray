
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Focus, Maximize2, Zap, Palette, ArrowRight, Sparkles, Plus, X, Save } from 'lucide-react';
import { STYLES } from '../constants';
import { DesignStyle } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

import { DesignResult } from '../types';

interface StudioProps {
  onGenerate: (result: DesignResult) => void;
  credits: number;
  isPro: boolean;
  userId: string;
}

export function Studio({ onGenerate, credits, isPro, userId }: StudioProps) {
  const { language } = useLanguage();
  const t = translations[language].studio;
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>(STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [capturedMime, setCapturedMime] = useState<string>('image/jpeg');
  const [error, setError] = useState<string | null>(null);
  const [guestCredits, setGuestCredits] = useState<number>(() => {
    const v = parseInt(localStorage.getItem('guest_credits') || '1');
    return isNaN(v) ? 1 : v;
  });
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState('');
  const [params, setParams] = useState({
    modernity: 50,
    coziness: 50,
    minimalism: 50
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(hexInput)) {
      if (customColors.length < 5) {
        setCustomColors([...customColors, hexInput.toUpperCase()]);
        setHexInput('');
      }
    }
  };

  const removeColor = (index: number) => {
    setCustomColors(customColors.filter((_, i) => i !== index));
  };

  // 업로드 전 WebP 압축 (최대 1200px, 품질 85%)
  const compressToWebP = (file: File): Promise<{ dataUrl: string; base64: string }> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const maxW = 1200;
        const ratio = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(objectUrl);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('WebP 변환 실패'));
            const reader = new FileReader();
            reader.onloadend = () => {
              const dataUrl = reader.result as string;
              resolve({ dataUrl, base64: dataUrl.split(',')[1] });
            };
            reader.readAsDataURL(blob);
          },
          'image/webp',
          0.85,
        );
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError(null);
    try {
      const { dataUrl, base64 } = await compressToWebP(file);
      setCapturedImage(dataUrl);
      setCapturedBase64(base64);
      setCapturedMime('image/webp');
    } catch {
      setError(language === 'ko' ? '이미지 변환에 실패했습니다.' : 'Image conversion failed.');
    }
  };

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleGenerate = async () => {
    if (!capturedBase64) {
      setError(language === 'ko' ? '먼저 사진을 찍어주세요.' : 'Please take a photo first.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedBase64,
          mimeType: capturedMime,
          styleId: selectedStyle.id,
          styleName: selectedStyle.name,
          params,
          customColors: customColors.length > 0 ? customColors : [],
          isPro,
          userId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '분석 중 오류가 발생했습니다.');
        return;
      }
      const result = {
        id: Math.random().toString(36).substr(2, 9),
        style: selectedStyle.name,
        imageUrl: data.imageUrl,
        analysis: data.analysis,
      };
      onGenerate(result);
      // 비회원일 경우 로컬에 저장된 1회권 차감
      if (!userId) {
        const next = Math.max(0, guestCredits - 1);
        setGuestCredits(next);
        localStorage.setItem('guest_credits', String(next));
      }
    } catch {
      setError('서버 연결에 실패했습니다. 서버가 실행 중인지 확인하세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveState = () => {
    const state = {
      styleId: selectedStyle.id,
      customColors,
      params
    };
    localStorage.setItem('ais_studio_state', JSON.stringify(state));
    alert(language === 'ko' ? '디자인 설정이 저장되었습니다.' : 'Design settings saved.');
  };

  const remaining = userId ? credits : guestCredits;

  return (
    <div className="w-full h-full max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-20 md:pb-8 flex flex-col gap-5 md:gap-10 overflow-y-auto scrollbar-hide">
      {/* 숨겨진 파일 입력 — 모바일에서 카메라 직접 실행 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileSelect}
      />

      {/* Immersive Viewport */}
      <div className="relative shrink-0 w-full aspect-[16/10] sm:aspect-[3/2] md:flex-1 md:min-h-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-border group">
        {capturedImage ? (
          <img src={capturedImage} alt="촬영된 공간" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-surface-muted">
            <Camera className="w-14 h-14 text-white/20" />
            <p className="text-white/30 text-sm font-medium">
              {language === 'ko' ? '하단 버튼으로 공간을 촬영하세요' : 'Tap the shutter to capture your space'}
            </p>
          </div>
        )}
        
        {/* HUD Overlay */}
        <div className="absolute inset-0 p-6 pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-black/85 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">{language === 'ko' ? 'LIVE 정밀 뷰' : 'LIVE HUD'}</span>
            </div>
            <div className="flex gap-2 pointer-events-auto">
              <HudButton icon={<Focus className="w-5 h-5" />} />
              <HudButton icon={<Maximize2 className="w-5 h-5" />} />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-black/85 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 flex items-stretch shadow-2xl">
              <HudStat label={language === 'ko' ? "초점 거리" : "Focus"} value="24mm" />
              <div className="w-px bg-white/20 my-2 mx-1" />
              <HudStat label={language === 'ko' ? "노출 보정" : "Exposure"} value="+0.4 EV" />
              <HudStat label="AI" value="85%" highlight />
            </div>
          </div>
        </div>

        {/* Capture Shutter */}
        <div className="absolute inset-x-0 bottom-8 flex justify-center pointer-events-none">
          <button 
            onClick={handleCapture}
            className="w-16 h-16 rounded-full border-4 border-white/30 p-1 pointer-events-auto active:scale-95 transition-all"
          >
            <div className="w-full h-full rounded-full bg-white transition-opacity hover:opacity-90" />
          </button>
        </div>

        {/* Framing Corners */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/20" />
      </div>

      {/* Controls Section */}
      <div className="grid lg:grid-cols-[1fr_400px] gap-6 md:gap-8 items-start shrink-0">
        <section className="flex flex-col gap-3 md:gap-6 min-w-0">
          <div className="flex items-end justify-between px-2">
            <div>
              <h3 className="font-headline font-extrabold text-lg md:text-2xl tracking-tight leading-none">{t.styleTitle}</h3>
              <p className="text-white/40 text-[10px] md:text-sm mt-1">{language === 'ko' ? '분위기를 결정할 스타일 선택' : 'Select a style'}</p>
            </div>
          </div>

          <div className="flex gap-2.5 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  "flex-shrink-0 snap-center group relative w-24 sm:w-36 md:w-44 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300",
                  selectedStyle.id === style.id 
                    ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                    : "border-border opacity-60 hover:opacity-100"
                )}
              >
                <img src={style.image} alt={style.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t transition-all",
                  selectedStyle.id === style.id 
                    ? "from-primary/90 via-primary/10" 
                    : "from-black/80"
                )} />
                
                {selectedStyle.id === style.id && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary rounded-full p-1 border border-border">
                      <Zap className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-[10px] font-bold text-white/60 mb-1 uppercase tracking-widest">{style.id === selectedStyle.id ? 'SELECTED' : 'STYLE'}</p>
                  <p className="font-headline font-black text-lg text-white leading-tight">{style.name}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h4 className="font-headline font-bold text-lg">{language === 'ko' ? '커스텀 컬러 하모니' : 'Custom Color Harmony'}</h4>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              {customColors.map((color, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 bg-surface-muted border border-border p-1.5 rounded-full pl-3 group"
                >
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-mono font-bold">{color}</span>
                  <button 
                    onClick={() => removeColor(i)}
                    className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {customColors.length < 5 && (
                <div className="flex items-center gap-2 bg-surface-muted border border-border px-3 py-1 rounded-full focus-within:border-primary transition-colors">
                  <input 
                    type="text" 
                    placeholder="#HEX"
                    className="bg-transparent border-none p-0 text-[10px] font-mono font-bold w-12 focus:ring-0 placeholder:text-text-muted"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
                  />
                  <button 
                    onClick={handleAddColor}
                    className="p-0.5 hover:text-primary transition-colors disabled:opacity-30"
                    disabled={!/^#[0-9A-F]{6}$/i.test(hexInput)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-text-muted mt-3">
              {language === 'ko' ? '* 최대 5가지의 강조 색상을 지정할 수 있습니다.' : '* Specify up to 5 accent colors for your design.'}
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <h4 className="font-headline font-bold text-lg">{language === 'ko' ? '정밀 튜닝 마스터' : 'Fine-tuning Master'}</h4>
            </div>
            
            <div className="grid gap-6">
              <Slider 
                label={language === 'ko' ? '모던함' : 'Modernity'} 
                value={params.modernity} 
                onChange={(v) => setParams(p => ({ ...p, modernity: v }))} 
              />
              <Slider 
                label={language === 'ko' ? '아늑함' : 'Coziness'} 
                value={params.coziness} 
                onChange={(v) => setParams(p => ({ ...p, coziness: v }))} 
              />
              <Slider 
                label={language === 'ko' ? '미니멀리즘' : 'Minimalism'} 
                value={params.minimalism} 
                onChange={(v) => setParams(p => ({ ...p, minimalism: v }))} 
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:gap-6 shrink-0">
          <div className="bg-surface-muted p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-3 md:space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">Ready to Process</p>
                  <p className="text-[11px] md:text-sm font-medium leading-[1.3] md:leading-relaxed text-text-base">
                    {language === 'ko' ? (
                      <>Vision-LLM 장면 분석 <span className="font-bold border-b border-primary/30">{selectedStyle.name}</span></>
                    ) : (
                      <>Analyzing <span className="font-bold border-b border-primary/30">{selectedStyle.name}</span></>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ETA</span>
                  <span className="text-base md:text-xl font-headline font-black text-primary leading-none">12s</span>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !capturedBase64 || remaining <= 0}
                  className={cn(
                    "w-full py-3.5 md:py-5 rounded-xl md:rounded-2xl font-headline font-black text-base md:text-lg flex flex-col items-center justify-center gap-0.5 transition-all group overflow-hidden",
                    isGenerating || !capturedBase64
                      ? "bg-primary/20 text-white/50 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 shadow-2xl shadow-primary/20"
                  )}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {isPro
                        ? (language === 'ko' ? 'Claude AI 분석 중...' : 'Analyzing with Claude AI...')
                        : (language === 'ko' ? 'Gemini AI 분석 중...' : 'Analyzing with Gemini AI...')}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <Sparkles className="w-5 h-5" />
                        {capturedBase64 ? t.generate : (language === 'ko' ? '사진을 먼저 찍어주세요' : 'Take a photo first')}
                        {capturedBase64 && <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                      </div>
                      {capturedBase64 && (
                        <span className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-90 mt-1">{language === 'ko' ? `남은 분석권: ${remaining}개` : `Remaining credits: ${remaining}`}</span>
                      )}
                    </>
                  )}
                </button>

                <button
                  onClick={handleSaveState}
                  className="w-full py-3 rounded-xl border border-border bg-surface hover:bg-surface-muted transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                >
                  <Save className="w-4 h-4" />
                  {language === 'ko' ? '현재 설정 저장' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HudButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="bg-black/85 backdrop-blur-xl p-2.5 rounded-xl border border-white/20 text-white transition-all hover:bg-white/10 active:scale-95 pointer-events-auto shadow-2xl">
      {icon}
    </button>
  );
}

function HudStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="px-6 py-2 flex flex-col items-center min-w-[100px]">
      <span className="text-[9px] uppercase tracking-tighter text-white/40 font-bold mb-0.5">{label}</span>
      <span className={cn("text-sm font-headline font-black", highlight ? "text-primary" : "text-white")}>
        {value}
      </span>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</span>
        <span className="text-xs font-mono font-black text-primary">{value}%</span>
      </div>
      <div className="relative h-1.5 w-full bg-surface-muted rounded-full overflow-hidden border border-border">
        <div 
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
          style={{ width: `${value}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
