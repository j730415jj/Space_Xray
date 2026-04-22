
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Zap, Info, ShoppingCart, Lock, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

interface PricingProps {
  onUpgrade: (plan: 'pro') => void;
  onBuyTokens: (amount: number) => void;
  onNavigate?: (page: any) => void;
}

export function Pricing({ onUpgrade, onBuyTokens, onNavigate }: PricingProps) {
  const { language } = useLanguage();
  const t = translations[language].pricing;
  
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [purchaseItem, setPurchaseItem] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pendingPurchase, setPendingPurchase] = React.useState<{
    type: 'pro' | 'tokens';
    value: any;
    itemName: string;
    price: string;
  } | null>(null);
  
  const handlePurchase = (type: 'pro' | 'tokens', value: any, itemName: string, _planId: string, price: string) => {
    setPendingPurchase({ type, value, itemName, price });
  };

  const executePurchase = () => {
    if (!pendingPurchase) return;

    const { type, value, itemName } = pendingPurchase;
    setPendingPurchase(null);
    setIsProcessing(true);
    setPurchaseItem(itemName);

    // Google Play 인앱결제 연동 전 시뮬레이션 (출시 시 교체)
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      if (type === 'pro') onUpgrade('pro');
      else onBuyTokens(value);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="h-full w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12 overflow-y-auto overflow-x-hidden scrollbar-hide pb-32 relative">
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="bg-surface-muted rounded-[2rem] border border-border p-10 max-w-sm w-full text-center space-y-6">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-bold">
                  {language === 'ko' ? '결제 및 구독 진행 중...' : 'Processing Payment...'}
                </h3>
                <p className="text-text-muted text-sm">
                  {language === 'ko' 
                    ? `Stripe 보안 창으로 이동하고 있습니다. 잠시만 기다려 주세요.` 
                    : `Redirecting to Stripe secure checkout. Please wait.`}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-xl flex items-center gap-4"
          >
            <div className="font-bold text-sm">{error}</div>
            <button onClick={() => setError(null)} className="text-xs uppercase font-bold text-white/50 hover:text-white">Close</button>
          </motion.div>
        )}

        {pendingPurchase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-surface-muted rounded-[2.5rem] border border-border p-8 md:p-12 max-w-md w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    {pendingPurchase.type === 'pro' ? <Zap className="w-7 h-7" /> : <ShoppingCart className="w-7 h-7" />}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold">
                      {language === 'ko' ? '초이스 확인' : 'Confirm Selection'}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {language === 'ko' ? '결제를 진행하시겠습니까?' : 'Would you like to proceed?'}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-muted/50 rounded-2xl p-6 border border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-sm font-medium">
                      {language === 'ko' ? '상품명' : 'Item'}
                    </span>
                    <span className="font-bold text-text-base">
                       {pendingPurchase.itemName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-text-muted text-sm font-medium">
                      {language === 'ko' ? '최종 결제 금액' : 'Final Amount'}
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {pendingPurchase.price}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={executePurchase}
                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
                  >
                    {language === 'ko' ? '결제하기' : 'Pay Now'}
                  </button>
                  <button 
                    onClick={() => setPendingPurchase(null)}
                    className="w-full py-5 rounded-2xl bg-transparent text-text-muted font-bold text-base hover:text-text-base transition-all"
                  >
                    {language === 'ko' ? '취소' : 'Cancel'}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 opacity-30">
                  <div className="flex items-center gap-1.5 grayscale">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                      Secure
                    </span>
                  </div>
                  <div className="w-px h-3 bg-text-muted/30" />
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-wider">Apple Pay</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Google Pay</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(61,90,254,0.4)] flex items-center gap-4"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                {language === 'ko' ? '결제 완료!' : 'Payment Successful!'}
              </span>
              <span className="text-[10px] opacity-80 uppercase tracking-widest leading-none mt-0.5">
                {purchaseItem}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="text-center mb-10 md:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase mb-6"
        >
          Elevate Your Vision
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
        >
          {language === 'ko' ? (
            <>공간의 무한한 가능성,<br /><span className="text-primary">프리미엄 멤버십</span>으로 여세요</>
          ) : language === 'jp' ? (
            <>空間の無限の可能性、<br /><span className="text-primary">プレミアムメンバーシップ</span>で開きましょう</>
          ) : (
            <>Unlock infinite possibilities<br />with <span className="text-primary">Premium Membership</span></>
          )}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {t.subtitle}
        </motion.p>
      </section>

      {/* Plans Section */}
      <section className="mb-24 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        <PlanCard
          tier="Free"
          name={language === 'ko' ? "무료 플랜" : "Free Plan"}
          price="₩0"
          period={language === 'ko' ? "/ 평생 무료" : "/ Free Forever"}
          description={language === 'ko' ? "Gemini AI로 공간을 분석하는 기본 서비스" : "Basic space analysis powered by Gemini AI"}
          features={language === 'ko' ? [
            "Gemini 1.5 Flash AI 분석",
            "월 5회 분석 제공",
            "분석 결과 즉시 확인",
            { text: "결과 저장 (클라우드)", disabled: true },
            { text: "Claude AI 고품질 분석", disabled: true },
          ] : [
            "Gemini 1.5 Flash AI analysis",
            "5 analyses per month",
            "Instant result preview",
            { text: "Cloud storage", disabled: true },
            { text: "Claude AI premium analysis", disabled: true },
          ]}
          buttonText={t.current}
          disabled
        />
        <PlanCard
          tier="SPACE X-RAY PRO"
          name={language === 'ko' ? "프로 플랜" : "Pro Plan"}
          price="₩14,900"
          period={language === 'ko' ? "/ 월" : "/ month"}
          description={language === 'ko' ? "Claude AI 고품질 분석과 클라우드 저장소 제공" : "Claude AI premium analysis with cloud storage"}
          features={language === 'ko' ? [
            "Claude 3.5 Sonnet AI 고품질 분석",
            "월 50회 분석 제공",
            "500MB 클라우드 이미지 저장",
            "WebP 자동 압축 처리",
            "분석 히스토리 영구 보관",
          ] : [
            "Claude 3.5 Sonnet premium analysis",
            "50 analyses per month",
            "500MB cloud image storage",
            "Auto WebP compression",
            "Permanent history archive",
          ]}
          buttonText={t.upgrade}
          highlight
          onClick={() => handlePurchase('pro', 'pro', language === 'ko' ? '프로 플랜 구독' : 'Pro Plan', 'pro', '₩14,900')}
        />
      </section>

      {/* Tokens Boutique */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
          <div>
            <h3 className="font-headline text-3xl font-extrabold mb-2 tracking-tight">{t.tokens}</h3>
            <p className="text-text-muted max-w-lg">{language === 'ko' ? '일시적인 프로젝트 확장이 필요하신가요? 필요한 만큼만 충전하여 프리미엄 렌더링을 즉시 이용하세요.' : 'Need a temporary boost? Recharge as needed and use premium rendering immediately.'}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Info className="w-4 h-4" />
            {language === 'ko' ? '토큰은 구매 후 1년간 유효합니다' : 'Tokens are valid for 1 year after purchase'}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <TokenCard
            badge={language === 'ko' ? '베이직 팩' : 'Basic Pack'}
            amount={language === 'ko' ? '100 토큰' : '100 Tokens'}
            price="₩4,900"
            description={language === 'ko' ? '간단한 공간 분석과 스타일 탐색을 위한 입문 팩' : 'Starter pack for quick space analysis'}
            icon={<Zap className="w-6 h-6" />}
            onClick={() => handlePurchase('tokens', 100, language === 'ko' ? '베이직 팩 100토큰' : 'Basic Pack 100 Tokens', 'token-basic', '₩4,900')}
          />
          <TokenCard
            badge={language === 'ko' ? '스마트 팩' : 'Smart Pack'}
            amount={language === 'ko' ? '500 토큰' : '500 Tokens'}
            price="₩19,000"
            description={language === 'ko' ? '집 전체 공간을 분석하기에 딱 맞는 베스트 팩' : 'Best value for full-home analysis'}
            icon={<Zap className="w-6 h-6" />}
            discount={language === 'ko' ? '22% 할인' : '22% OFF'}
            highlight
            onClick={() => handlePurchase('tokens', 500, language === 'ko' ? '스마트 팩 500토큰' : 'Smart Pack 500 Tokens', 'token-smart', '₩19,000')}
          />
          <TokenCard
            badge={language === 'ko' ? '프로 팩' : 'Pro Pack'}
            amount={language === 'ko' ? '1,500 토큰' : '1,500 Tokens'}
            price="₩49,000"
            description={language === 'ko' ? '대규모 프로젝트와 복수 시나리오 분석을 위한 팩' : 'Large projects and multi-scenario analysis'}
            icon={<Zap className="w-6 h-6" />}
            discount={language === 'ko' ? '최대 33% 절약' : 'Save 33%'}
            onClick={() => handlePurchase('tokens', 1500, language === 'ko' ? '프로 팩 1,500토큰' : 'Pro Pack 1,500 Tokens', 'token-pro', '₩49,000')}
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="bg-surface-muted p-10 rounded-[2.5rem] border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-primary">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="font-headline text-xl font-bold">
                  {language === 'ko' ? '안전한 결제 환경' : 'Secure Payment'}
                </h3>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {language === 'ko'
                  ? '256-bit SSL 보안으로 모든 결제 정보가 보호됩니다. 모바일 앱 출시 후 Google Play 인앱 결제가 적용됩니다.'
                  : 'All payments are protected by 256-bit SSL. Google Play Billing will be applied upon mobile app release.'}
              </p>
            </div>
            <div className="flex items-center gap-6 opacity-40">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span className="font-bold text-sm tracking-tighter">Google Pay</span>
              </div>
              <span className="font-bold text-sm tracking-tighter">VISA</span>
              <span className="font-bold text-sm tracking-tighter">MasterCard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Links Footer */}
      <footer className="max-w-4xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 pb-20 text-text-muted text-[11px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-8">
          <button onClick={() => onNavigate?.('legal')} className="hover:text-primary transition-colors">
            {language === 'ko' ? '이용약관' : 'Terms of Service'}
          </button>
          <button onClick={() => onNavigate?.('legal')} className="hover:text-primary transition-colors">
            {language === 'ko' ? '개인정보처리방침' : 'Privacy Policy'}
          </button>
          <button onClick={() => onNavigate?.('legal')} className="hover:text-primary transition-colors">
            {language === 'ko' ? '환불정책' : 'Refund Policy'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3" />
          <span>SSL Encrypted</span>
        </div>
      </footer>
    </div>
  );
}

function PlanCard({ tier, name, price, period, description, features, buttonText, disabled, highlight, onClick }: any) {
  return (
    <div className={cn(
      "p-10 rounded-[2rem] border transition-all flex flex-col",
      highlight 
        ? "bg-surface-muted border-primary shadow-[0_32px_64px_-12px_rgba(61,90,254,0.3)] relative transform hover:scale-[1.01]" 
        : "bg-surface-muted border-border hover:bg-surface-muted/80"
    )}>
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full shadow-lg">
          Best Choice
        </div>
      )}
      <div className="mb-10">
        <span className={cn(
          "inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4",
          highlight ? "bg-primary/20 text-primary" : "bg-surface-muted text-text-muted"
        )}>
          {tier}
        </span>
        <h3 className="font-headline text-2xl font-bold">{name}</h3>
        <p className="text-text-muted text-sm mt-1">{description}</p>
      </div>
      <div className="mb-10 flex items-baseline gap-1">
        <span className={cn("text-5xl font-extrabold font-headline tracking-tight", highlight && "text-primary")}>{price}</span>
        <span className="text-text-muted font-medium">{period}</span>
      </div>
      <div className="space-y-4 mb-12 flex-grow">
        {features.map((f: any, i: number) => {
          const item = typeof f === 'string' ? { text: f } : f;
          return (
            <div key={i} className={cn("flex items-center gap-3", item.disabled && "opacity-30")}>
              <CheckCircle2 className={cn("w-5 h-5", item.disabled ? "text-white/20" : "text-primary")} />
              <span className={cn("text-[15px] font-medium", item.disabled && "line-through")}>{item.text}</span>
            </div>
          );
        })}
      </div>
      <button 
        onClick={onClick}
        className={cn(
          "w-full py-5 rounded-2xl font-bold text-base transition-all",
          highlight 
            ? "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20" 
            : "border border-border text-text-muted bg-surface-muted cursor-default"
        )}
      >
        {buttonText}
      </button>
    </div>
  );
}

function TokenCard({ amount, price, description, badge, icon, highlight, onClick, discount }: any) {
  return (
    <div
      className={cn(
        "bg-surface-muted p-8 rounded-[2rem] border border-border transition-all hover:bg-surface-muted/80 group relative overflow-hidden cursor-pointer",
        highlight && "border-primary/50 shadow-2xl"
      )}
      onClick={onClick}
    >
      {discount && (
        <div className="absolute top-0 right-0 bg-primary/20 text-primary px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
          {discount}
        </div>
      )}
      <div className="flex justify-between items-start mb-8">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
          highlight ? "bg-primary text-white" : "bg-white/5 text-primary"
        )}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-primary px-3 py-1 bg-primary/10 rounded-full tracking-wider uppercase border border-primary/10">
          {badge}
        </span>
      </div>
      <h4 className="font-headline text-2xl font-extrabold mb-1">{amount}</h4>
      <p className="text-sm text-text-muted mb-10 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <span className="text-3xl font-bold font-headline">{price}</span>
        <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg group-hover:scale-110">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
