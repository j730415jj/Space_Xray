
import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, UserPlus, Key, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { Page } from '../types';

interface AuthPageProps {
  type: 'signup' | 'forgot-password';
  onNavigate: (page: Page) => void;
}

export function AuthPages({ type, onNavigate }: AuthPageProps) {
  const { language } = useLanguage();
  const t = translations[language].auth;

  if (type === 'signup') {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-surface overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface-muted p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl"
        >
          <button 
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{t.backToLogin}</span>
          </button>

          <h1 className="text-3xl font-headline font-black mb-2">{t.signUp}</h1>
          <p className="text-white/40 mb-8 font-medium">{t.createAccount}</p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <AuthInput label={t.nameLabel} placeholder="John Doe" icon={<UserPlus className="w-4 h-4" />} />
              <AuthInput label={t.emailLabel} placeholder="email@example.com" icon={<Mail className="w-4 h-4" />} />
              <AuthInput label={t.pwLabel} placeholder="••••••••" type="password" icon={<Key className="w-4 h-4" />} />
            </div>

            <button className="w-full bg-primary text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-xs mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              {t.signUpSubmit}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-white/30 font-medium">
            {t.alreadyHaveAccount}{' '}
            <button onClick={() => onNavigate('login')} className="text-primary hover:underline">{language === 'ko' ? '로그인' : 'Log In'}</button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-surface overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface-muted p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl"
      >
        <button 
          onClick={() => onNavigate('login')}
          className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">{t.backToLogin}</span>
        </button>

        <h1 className="text-3xl font-headline font-black mb-2">{t.findPw}</h1>
        <p className="text-white/40 mb-8 font-medium">계정 정보를 입력해 주세요.</p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <AuthInput label={t.emailLabel} placeholder="email@example.com" icon={<Mail className="w-4 h-4" />} />
            <AuthInput label={t.phoneLabel} placeholder="010-0000-0000" icon={<UserPlus className="w-4 h-4" />} />
          </div>

          <button className="w-full border border-white/10 text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-xs mt-4 hover:bg-white/5 transition-all">
            {t.findIdSubmit}
          </button>
          
          <button className="w-full bg-primary text-white p-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            {t.findPwSubmit}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/30 font-medium">
          {t.needAccount}{' '}
          <button onClick={() => onNavigate('signup')} className="text-primary hover:underline">{t.signUp}</button>
        </p>
      </motion.div>
    </div>
  );
}

function AuthInput({ label, placeholder, type = "text", icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
          {icon}
        </div>
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-primary focus:bg-white/[0.05] transition-all outline-none"
        />
      </div>
    </div>
  );
}
