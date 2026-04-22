
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, ShoppingBag, User, Languages, Sun, Moon } from 'lucide-react';
import { Page, User as UserType } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../translations';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  credits: number;
  user?: UserType;
}

export function Navbar({ currentPage, setCurrentPage, credits, user }: NavbarProps) {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = translations[language].nav;

  return (
    <>
      {/* Desktop Navigation */}
      <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-border px-8 py-4 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer shrink-0" onClick={() => setCurrentPage('landing')}>
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-[18px]">architecture</span>
          </div>
          <h1 className="font-headline tracking-tight font-extrabold text-lg md:text-xl translate-y-[7px]">VisionInterior</h1>
        </div>
        
        <nav className="flex items-center gap-4 lg:gap-10 mx-4">
          <NavItem active={currentPage === 'studio'} onClick={() => setCurrentPage('studio')} label={t.studio} />
          <NavItem active={currentPage === 'results'} onClick={() => setCurrentPage('results')} label={t.results} />
          <NavItem active={currentPage === 'shop'} onClick={() => setCurrentPage('shop')} label={t.shop} />
          <NavItem active={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} label={t.profile} />
        </nav>

        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-full shrink-0">
            <button 
              onClick={() => setLanguage('en')}
              className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                language === 'en' ? "text-primary" : "text-text-muted hover:text-text-base"
              )}
            >
              EN
            </button>
            <div className="w-px h-2 bg-white/10" />
            <button 
              onClick={() => setLanguage('ko')}
              className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                language === 'ko' ? "text-primary" : "text-text-muted hover:text-text-base"
              )}
            >
              KO
            </button>
            <div className="w-px h-2 bg-white/10" />
            <button 
              onClick={() => setLanguage('jp')}
              className={cn(
                "px-2 py-1 rounded-full text-[10px] font-bold transition-all",
                language === 'jp' ? "text-primary" : "text-text-muted hover:text-text-base"
              )}
            >
              JP
            </button>
          </div>

          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-surface-muted border border-border flex items-center justify-center text-text-muted hover:text-primary transition-all shadow-lg"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 bg-surface-muted px-4 py-1.5 rounded-full border border-border shrink-0">
            <span className="material-symbols-outlined text-primary text-[16px] fill-1">generating_tokens</span>
            <span className="font-headline font-bold text-sm tracking-tight">{credits.toLocaleString()}</span>
          </div>

          <div 
            className="w-10 h-10 rounded-xl bg-surface-muted border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setCurrentPage('profile')}
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Top Bar (Language Switcher Only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-end pointer-events-none">
        <div className="bg-surface/80 backdrop-blur-xl border border-border p-1.5 rounded-full flex items-center gap-2 pointer-events-auto shadow-xl">
           <button 
              onClick={() => setLanguage('en')}
              className={cn(
                "px-2 py-1 rounded-full text-[9px] font-bold transition-all",
                language === 'en' ? "text-primary" : "text-text-muted"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ko')}
              className={cn(
                "px-2 py-1 rounded-full text-[9px] font-bold transition-all",
                language === 'ko' ? "text-primary" : "text-text-muted"
              )}
            >
              KO
            </button>
            <button 
              onClick={() => setLanguage('jp')}
              className={cn(
                "px-2 py-1 rounded-full text-[9px] font-bold transition-all",
                language === 'jp' ? "text-primary" : "text-text-muted"
              )}
            >
              JP
            </button>
        </div>
      </div>
      <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-4 py-3 pb-8 bg-surface/90 backdrop-blur-xl z-50 rounded-t-[2.5rem] border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <MobileNavItem 
          active={currentPage === 'studio'} 
          onClick={() => setCurrentPage('studio')} 
          icon={<Camera className="w-6 h-6" />} 
          label="스튜디오" 
        />
        <MobileNavItem 
          active={currentPage === 'results'} 
          onClick={() => setCurrentPage('results')} 
          icon={<Sparkles className="w-6 h-6" />} 
          label="결과" 
        />
        <MobileNavItem 
          active={currentPage === 'shop'} 
          onClick={() => setCurrentPage('shop')} 
          icon={<ShoppingBag className="w-6 h-6" />} 
          label="상점" 
        />
        <MobileNavItem 
          active={currentPage === 'profile'} 
          onClick={() => setCurrentPage('profile')} 
          icon={user?.profilePicture ? (
            <img src={user.profilePicture} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )} 
          label={t.profile} 
        />
      </nav>
    </>
  );
}

function NavItem({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "text-sm font-semibold tracking-tight transition-all duration-300 relative py-1",
        active ? "text-primary" : "text-text-muted hover:text-text-base"
      )}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </button>
  );
}

function MobileNavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-4 py-2 transition-all active:scale-90",
        active ? "text-primary" : "text-text-muted"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        active && "bg-primary/10"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
}
