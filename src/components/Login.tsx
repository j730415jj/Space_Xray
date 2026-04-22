
import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabaseClient';
import { Page } from '../types';
import { translations } from '../translations';

import { useLanguage } from '../contexts/LanguageContext';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigate: (page: Page) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].auth;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-12 overflow-hidden bg-surface">
      <div className="w-full max-w-6xl h-full max-h-[800px] grid lg:grid-cols-12 bg-surface-muted rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
        {/* Visual Side */}
        <div className="hidden lg:block lg:col-span-6 relative bg-[#121212]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" 
            alt="Architectural"
            className="w-full h-full object-cover grayscale brightness-50"
          />
          <div className="absolute bottom-12 left-12 right-12 z-20">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-surface text-3xl">architecture</span>
            </div>
            <h2 className="text-5xl font-extralight tracking-tighter text-white leading-[1.1] mb-6">
              Spatial <span className="font-medium">precision</span><br />
              refined by <span className="italic font-serif">intelligence</span>.
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Professional Architectural Studio — v2024</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-6 bg-surface p-8 md:p-20 lg:p-24 flex flex-col justify-center">
          <div className="mb-12 md:mb-20 flex justify-between items-center">
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={() => setLanguage('en')}
                className={cn(
                  "text-[11px] font-bold tracking-widest transition-all",
                  language === 'en' ? "text-primary" : "text-white/30 hover:text-white/60"
                )}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('ko')}
                className={cn(
                  "text-[11px] font-bold tracking-widest transition-all",
                  language === 'ko' ? "text-primary" : "text-white/30 hover:text-white/60"
                )}
              >
                KO
              </button>
              <button 
                onClick={() => setLanguage('jp')}
                className={cn(
                  "text-[11px] font-bold tracking-widest transition-all",
                  language === 'jp' ? "text-primary" : "text-white/30 hover:text-white/60"
                )}
              >
                JP
              </button>
            </div>
          </div>

          <div className="max-w-md w-full mx-auto lg:mx-0">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-12"
            >
              <h1 className="text-4xl font-headline font-black mb-3 text-white/30">
                {language === 'ko' ? '로그인' : language === 'jp' ? 'ログイン' : 'Sign In'}
              </h1>
              <p className="text-white/40 font-medium">
                {language === 'ko' ? '건축 워크스페이스에 접속하세요' : language === 'jp' ? 'ワークスペースにアクセス' : 'Access your architectural workspace'}
              </p>
            </motion.div>

            <form className="space-y-10" onSubmit={async (e) => { e.preventDefault(); setIsSubmitting(true); await onLogin(email, password); setIsSubmitting(false); }}>
              <div className="space-y-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    {t.emailLabel}
                  </label>
                  <input 
                    type="email" 
                    placeholder="architect@vision.studio"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 transition-all py-3 px-0 text-lg placeholder:text-white/5"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                    {t.pwLabel}
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/10 focus:border-primary focus:ring-0 transition-all py-3 px-0 text-lg placeholder:text-white/5"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-white text-primary p-6 rounded-sm font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all hover:bg-white/90 active:scale-95"
                  disabled={isSubmitting}
                >
                  {language === 'ko' ? '워크스페이스 입장' : language === 'jp' ? 'ワークスペースに入る' : 'Workplace Entrance'}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] font-medium text-white/40 hover:text-white"
                >
                  {t.findId}
                </button>
                <button 
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] font-medium text-white/40 hover:text-white"
                >
                  {t.findPw}
                </button>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="text-[11px] font-medium text-white/40 hover:text-white"
                >
                  {t.signUp}
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                AI Assisted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
