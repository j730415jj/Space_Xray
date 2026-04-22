
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Camera, Smartphone, MousePointer2, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  const { language, setLanguage } = useLanguage();
  const [step, setStep] = React.useState(0);
  const totalSteps = 3;

  const t = translations[language].landing;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="h-screen w-full bg-surface overflow-hidden relative">
      {/* Top Header with Language Selector */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 md:py-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-4 md:gap-5 pointer-events-auto cursor-pointer" onClick={() => setStep(0)}>
          <div className="w-7 h-7 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-lg md:text-2xl">architecture</span>
          </div>
          <span className="font-headline font-black text-base sm:text-lg md:text-2xl tracking-tighter text-white translate-y-[7px]">VisionInterior</span>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 md:p-1.5 rounded-full flex items-center gap-1 md:gap-2 pointer-events-auto shadow-2xl">
          <LangButton active={language === 'en'} onClick={() => setLanguage('en')} label="EN" />
          <LangButton active={language === 'ko'} onClick={() => setLanguage('ko')} label="KO" />
          <LangButton active={language === 'jp'} onClick={() => setLanguage('jp')} label="JP" />
        </div>
      </header>

      <div className="h-full w-full relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section 
              key="step0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/60 to-surface z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
                  alt="Hero Background"
                  className="w-full h-full object-cover grayscale brightness-75"
                />
              </div>

              <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary border border-primary text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-8 shadow-lg shadow-primary/20">
                    <Sparkles className="w-3 h-3" />
                    {t.tag}
                  </div>
                  
                  <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[0.95]">
                    {t.heroTitle}<br />
                    <span className="text-primary italic">{t.heroTitleAccent}</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    {t.heroSub}
                  </p>

                  <button 
                    onClick={nextStep}
                    className="group relative px-10 py-6 bg-primary text-white rounded-2xl font-headline font-black text-lg flex items-center gap-3 shadow-[0_20px_50px_rgba(61,90,254,0.4)] mx-auto transition-all hover:-translate-y-1 active:scale-95"
                  >
                    {t.learnMore}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section 
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col justify-center items-center px-6"
            >
              <div className="max-w-7xl w-full mx-auto">
                <div className="text-center mb-16">
                  <h2 className="font-headline text-4xl md:text-5xl font-black mb-6 italic">{t.featureTag}</h2>
                  <p className="text-white/40 text-lg uppercase tracking-[0.3em] font-bold">{t.featureTitle}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <FeatureItem 
                    icon={<Camera className="w-8 h-8" />}
                    title={t.f1Title}
                    description={t.f1Desc}
                  />
                  <FeatureItem 
                    icon={<Zap className="w-8 h-8" />}
                    title={t.f2Title}
                    description={t.f2Desc}
                  />
                  <FeatureItem 
                    icon={<ShieldCheck className="w-8 h-8" />}
                    title={t.f3Title}
                    description={t.f3Desc}
                  />
                </div>

                <div className="mt-16 flex justify-center">
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                  >
                    {t.nextStep} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center px-6"
            >
              <div className="max-w-6xl w-full bg-surface-muted rounded-[3rem] p-12 md:p-20 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex-1 text-center md:text-left">
                  <h2 className="font-headline text-4xl md:text-6xl font-black mb-8 leading-tight">
                    {t.ctaTitle} <br />
                    <span className="text-primary italic">{t.ctaTitleAccent}</span>{t.ctaTitleSuffix}
                  </h2>
                  <p className="text-white/50 text-xl mb-12 leading-relaxed">
                    {t.ctaSub}
                  </p>
                  <button 
                    onClick={onGetStarted}
                    className="bg-primary text-white px-12 py-6 rounded-2xl font-headline font-black text-xl hover:bg-primary/90 transition-all shadow-[0_20px_50px_rgba(61,90,254,0.3)]"
                  >
                    {t.startFree}
                  </button>
                </div>

                <div className="flex-1 relative hidden md:block">
                  <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-3">
                    <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Process" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-6 -left-6 w-48 bg-white p-6 rounded-2xl shadow-2xl -rotate-6">
                    <p className="text-surface text-xs font-bold uppercase tracking-widest mb-1">AI Matching</p>
                    <p className="text-surface font-headline font-black text-2xl">98% Accuracy</p>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-12 left-0 right-0 z-50 flex items-center justify-center gap-12 pointer-events-none">
        <button 
          onClick={prevStep}
          disabled={step === 0}
          className={cn(
            "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all pointer-events-auto",
            step === 0 ? "opacity-0 cursor-default" : "bg-black/40 backdrop-blur-md text-white hover:bg-primary hover:border-primary"
          )}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Progress Dots */}
        <div className="flex gap-3 pointer-events-auto bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                step === i ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <button 
          onClick={nextStep}
          disabled={step === totalSteps - 1}
          className={cn(
            "w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all pointer-events-auto",
            step === totalSteps - 1 ? "opacity-0 cursor-default" : "bg-black/40 backdrop-blur-md text-white hover:bg-primary hover:border-primary"
          )}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-10 bg-surface-muted rounded-[2.5rem] border border-white/5 hover:bg-white/[0.03] transition-all group">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-headline text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/40 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function LangButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-bold tracking-widest transition-all",
        active ? "text-primary" : "text-white/30 hover:text-white/60"
      )}
    >
      {label}
    </button>
  );
}
