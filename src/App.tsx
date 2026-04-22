import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Studio } from './components/Studio';
import { Pricing } from './components/Pricing';
import { Legal } from './components/Legal';
import { Results } from './components/Results';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { AuthPages } from './components/AuthPages';
import { Page, User, DesignResult } from './types';
import { cn } from './lib/utils';
import { supabase } from './lib/supabaseClient';
import { User as UserIcon, LayoutGrid, History, Settings, LogOut, ArrowRight, Sparkles, Camera, Zap } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { translations } from './translations';

export default function App() {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [latestResult, setLatestResult] = useState<DesignResult | null>(null);

  // Check if it's a returning user on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem('vision_interior_visited');
    if (hasVisited) {
      setCurrentPage('login');
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.warn('Login error', error.message || error);
        return;
      }
      const userId = data.user?.id;
      if (!userId) {
        // 로그인은 되었지만 user id를 받지 못한 경우
        console.warn('No user id returned from Supabase auth');
        return;
      }

      // 사용자 credits 조회 (있으면 사용, 없으면 비회원 기본값 부여)
      const { data: row, error: rowErr } = await supabase.from('users').select('credits,is_pro,email').eq('id', userId).maybeSingle();
      if (rowErr) console.warn('Failed to fetch user row', rowErr.message || rowErr);

      let credits = 1;
      let isPro = false;
      if (row && typeof row.credits === 'number') {
        credits = row.credits;
        isPro = !!row.is_pro;
      } else {
        // 서버의 안전한 업서트를 통해 기본 1크레딧을 생성
        await fetch('/api/add_credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount: 1 }),
        });
        credits = 1;
      }

      const newUser: User = {
        id: userId,
        email,
        isPro,
        credits,
        tokenHistory: [],
      };
      setUser(newUser);
      setCurrentPage('studio');
      localStorage.setItem('vision_interior_visited', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem('vision_interior_visited', 'true');
    if (user) {
      setCurrentPage('studio');
    } else {
      setCurrentPage('login');
    }
  };

  const handleGenerate = (result: DesignResult) => {
    if (!user || user.credits < 1) {
      setCurrentPage('shop');
      return;
    }
    setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
    setLatestResult(result);
    setCurrentPage('results');
  };

  const handleUpgrade = () => {
    setUser(prev => prev ? { ...prev, isPro: true } : null);
  };

  const handleBuyTokens = (amount: number) => {
    const cost = amount === 500 ? 4.50 : (amount === 1250 ? 9.00 : 2.50);
    const newHistoryItem = {
      id: 'th_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount,
      cost
    };
    setUser(prev => prev ? {
      ...prev,
      credits: prev.credits + amount,
      tokenHistory: [newHistoryItem, ...(prev.tokenHistory || [])]
    } : null);
  };

  if (currentPage === 'landing') {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'signup' || currentPage === 'forgot-password') {
    return <AuthPages type={currentPage === 'signup' ? 'signup' : 'forgot-password'} onNavigate={setCurrentPage} />;
  }

  return (
    <div className="h-screen bg-surface selection:bg-primary/20 selection:text-primary overflow-hidden flex flex-col">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        credits={user?.credits || 0} 
        user={user || undefined}
      />

      <main className="flex-1 pt-16 md:pt-20 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full overflow-hidden"
          >
            {currentPage === 'studio' && (
              <Studio
                onGenerate={handleGenerate}
                credits={user?.credits || 0}
                isPro={user?.isPro ?? false}
                userId={user?.id ?? ''}
              />
            )}
            {currentPage === 'results' && latestResult && (
              <Results result={latestResult} />
            )}
            {currentPage === 'results' && !latestResult && (
              <div className="max-w-6xl mx-auto px-6 py-32 text-center space-y-4">
                <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                  <History className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-headline font-bold">
                  {language === 'ko' ? '생성된 결과가 없습니다' : language === 'jp' ? '生成された結果がありません' : 'No results generated'}
                </h2>
                <p className="text-white/40">
                  {language === 'ko' ? '스튜디오에서 첫 번째 디자인을 만들어보세요.' : language === 'jp' ? 'スタジオで最初のデザインを作成してください。' : 'Create your first design in the studio.'}
                </p>
                <button 
                  onClick={() => setCurrentPage('studio')}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
                >
                  {language === 'ko' ? '스튜디오로 이동' : language === 'jp' ? 'スタジオへ移動' : 'Go to Studio'}
                </button>
              </div>
            )}
            {currentPage === 'shop' && (
              <div className="h-full overflow-hidden">
                <Pricing 
                  onUpgrade={handleUpgrade} 
                  onBuyTokens={handleBuyTokens} 
                  onNavigate={setCurrentPage}
                  userId={user?.id}
                />
              </div>
            )}
            {currentPage === 'profile' && user && (
              <ProfilePage 
                user={user} 
                onLogout={() => setCurrentPage('login')} 
                onNavigate={setCurrentPage}
                onUpdateUser={(updated) => setUser(prev => prev ? { ...prev, ...updated } : null)}
              />
            )}
            {currentPage === 'legal' && (
              <Legal onBack={() => setCurrentPage('profile')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProfilePage({ user, onLogout, onNavigate, onUpdateUser }: { user: User; onLogout: () => void; onNavigate: (page: any) => void; onUpdateUser: (updated: Partial<User>) => void }) {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'collection' | 'history' | 'token_history' | 'settings'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const labels = {
    ko: {
      welcome: "님, 환영합니다",
      pro: "프로 플랜",
      basic: "베이직 플랜",
      summary: "계정 요약",
      tokens: "보유 분석권",
      projects: "프로젝트",
      collection: "마이 컬렉션",
      history: "생성 히스토리",
      tokenHistory: "분석권 충전 내역",
      settings: "계정 설정",
      logout: "로그아웃",
      benefits: "멤버십 혜택",
      benefitDesc: "프로 플랜으로 업그레이드하고 고해상도 4K 렌더링과 아키텍트 전용 리포트를 무제한으로 이용하세요.",
      b1: "무제한 프로젝트 아카이브",
      b2: "24/7 전용 서버 액세스",
      b3: "BOM 자재 산출 리포트",
      upgrade: "지금 업그레이드",
      support: "고객 지원"
    },
    en: {
      welcome: ", Welcome",
      pro: "PRO PLAN",
      basic: "BASIC PLAN",
      summary: "Account Summary",
      tokens: "Credits",
      projects: "Projects",
      collection: "My Collection",
      history: "History",
      tokenHistory: "Credit History",
      settings: "Settings",
      logout: "Sign Out",
      benefits: "Membership Benefits",
      benefitDesc: "Upgrade to Pro Plan and enjoy unlimited 4K high-res renders and architect-specific reports.",
      b1: "Unlimited Project Archive",
      b2: "24/7 Dedicated Server Access",
      b3: "BOM Material Report",
      upgrade: "Upgrade Now",
      support: "Support"
    },
    jp: {
      welcome: "さん、ようこそ",
      pro: "プロプラン",
      basic: "ベーシックプラン",
      summary: "アカウント概要",
      tokens: "保有分析権",
      projects: "プロジェクト",
      collection: "マイコレクション",
      history: "生成ヒストリー",
      tokenHistory: "分析権履歴",
      settings: "設定",
      logout: "ログアウト",
      benefits: "メンバーシップ特典",
      benefitDesc: "プロプランにアップグレードして、高解像度4Kレンダリングとアーキテクト専用レポートを無制限に利用してください。",
      b1: "無制限のプロジェクトアーカイブ",
      b2: "24/7専用サーバーアクセス",
      b3: "BOM資材算出レポート",
      upgrade: "今すぐアップグレード",
      support: "サポート"
    }
  }[language];

  const renderHeader = () => (
    <header className="flex items-center gap-6 mb-8 md:mb-12">
      <div 
        className="w-24 h-24 rounded-3xl bg-surface-muted border border-border flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl"
        onClick={() => fileInputRef.current?.click()}
      >
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <UserIcon className="w-10 h-10 text-white/20 group-hover:scale-110 transition-transform" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>
      <div>
        <h1 className="text-3xl font-headline font-black mb-2">
          {language === 'en' ? `${labels.welcome} ${user.email.split('@')[0]}` : `${user.email.split('@')[0]}${labels.welcome}`}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-muted">{user.email}</span>
          <div className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest",
            user.isPro ? "bg-primary text-white" : "bg-surface-muted text-text-muted"
          )}>
            {user.isPro ? labels.pro : labels.basic}
          </div>
        </div>
      </div>
    </header>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case 'collection':
        return (
          <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setActiveSubTab('overview')} className="p-2 hover:bg-white/5 rounded-full">
                <LayoutGrid className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-2xl font-headline font-extrabold">{labels.collection}</h2>
            </header>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-surface-muted rounded-2xl border border-border overflow-hidden group relative shadow-2xl">
                  <img src={`https://picsum.photos/seed/arch_coll_${i}/800/1000`} alt="Saved" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Architecture</p>
                    <p className="font-headline font-black text-lg">Interior Style {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setActiveSubTab('overview')} className="p-2 hover:bg-white/5 rounded-full">
                <LayoutGrid className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-2xl font-headline font-extrabold">{labels.history}</h2>
            </header>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-surface-muted p-5 rounded-2xl border border-border flex items-center justify-between hover:bg-surface-muted/50 transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface-muted rounded-xl flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      <img src={`https://picsum.photos/seed/hist_${i}/200/200`} className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <p className="font-bold text-base">Generation Design #{1204 + i}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Industrial • {10 + i}m ago</p>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all group-hover:text-white">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'token_history':
        return (
          <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setActiveSubTab('overview')} className="p-2 hover:bg-white/5 rounded-full">
                <LayoutGrid className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-2xl font-headline font-extrabold">{labels.tokenHistory}</h2>
            </header>
            <div className="space-y-4">
              {(user.tokenHistory || []).map(item => (
                <div key={item.id} className="bg-surface-muted p-6 rounded-2xl border border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Zap className="w-6 h-6 fill-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-base">{item.amount.toLocaleString()} Credits</p>
                          <p className="text-xs text-text-muted mt-0.5">{item.date}</p>
                        </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-black text-lg">${item.cost.toFixed(2)}</p>
                    <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-0.5">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setActiveSubTab('overview')} className="p-2 hover:bg-white/5 rounded-full">
                <LayoutGrid className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-2xl font-headline font-extrabold">{labels.settings}</h2>
            </header>
            <div className="grid gap-6">
              <div className="bg-surface-muted p-8 rounded-3xl border border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-headline font-bold text-lg">{language === 'ko' ? '알람 설정' : 'Notifications'}</p>
                    <p className="text-sm text-white/40">이메일 및 마케팅 알림을 받습니다.</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" /></div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between group cursor-pointer">
                  <div className="space-y-1">
                    <p className="font-headline font-bold text-lg">{language === 'ko' ? '계정 보안' : 'Account Security'}</p>
                    <p className="text-sm text-white/40">비밀번호 변경 및 보안 설정</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid md:grid-cols-2 gap-8">
            <section className="space-y-6">
              <h3 className="font-headline font-bold text-lg">{labels.summary}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-muted p-6 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{labels.tokens}</p>
                  <p className="text-2xl font-headline font-black text-primary">{user.credits.toLocaleString()}</p>
                </div>
                <div className="bg-surface-muted p-6 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">{labels.projects}</p>
                  <p className="text-2xl font-headline font-black">12</p>
                </div>
              </div>

              <div className="space-y-2">
                <ProfileLink 
                  icon={<LayoutGrid className="w-5 h-5" />} 
                  label={labels.collection} 
                  count={4} 
                  onClick={() => setActiveSubTab('collection')}
                />
                <ProfileLink 
                  icon={<History className="w-5 h-5" />} 
                  label={labels.history} 
                  onClick={() => setActiveSubTab('history')}
                />
                <ProfileLink 
                  icon={<Zap className="w-5 h-5" />} 
                  label={labels.tokenHistory} 
                  onClick={() => setActiveSubTab('token_history')}
                />
                <ProfileLink 
                  icon={<Settings className="w-5 h-5" />} 
                  label={labels.settings} 
                  onClick={() => setActiveSubTab('settings')}
                />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-500/10 text-red-400 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">{labels.logout}</span>
                  </div>
                </button>
              </div>
            </section>

            <section className="bg-surface-muted p-8 rounded-3xl border border-border relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="font-headline font-bold text-lg mb-4">{labels.benefits}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-6">
                  {labels.benefitDesc}
                </p>
                <ul className="space-y-3">
                  <BenefitItem text={labels.b1} />
                  <BenefitItem text={labels.b2} />
                  <BenefitItem text={labels.b3} />
                </ul>
              </div>
              {!user.isPro && (
                <button onClick={() => onNavigate('shop')} className="w-full bg-primary text-white py-4 rounded-2xl font-bold mt-8 shadow-xl shadow-primary/20">
                  {labels.upgrade}
                </button>
              )}
            </section>
          </div>
        );
    }
  };

  return (
    <div className="h-full w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 overflow-y-auto scrollbar-hide pb-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'overview' && renderHeader()}
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProfileLink({ icon, label, count, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-muted border border-border hover:bg-surface-muted/80 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="text-text-muted group-hover:text-primary transition-colors">{icon}</div>
        <span className="font-semibold text-sm">{label}</span>
      </div>
      {count !== undefined && <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded-md">{count}</span>}
    </button>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-medium">
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      {text}
    </li>
  );
}
