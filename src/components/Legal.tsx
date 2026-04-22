import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, ArrowLeft, Scale, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Legal({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'tos' | 'privacy' | 'refund'>('tos');

  const content = {
    ko: {
      tos: {
        title: "이용약관",
        sections: [
          {
            h: "1. 서비스 이용 및 AI 결과물 책임 제한",
            p: "SPACE X-RAY는 AI 기술을 활용한 인테리어 디자인 참고 도구입니다. AI가 생성한 결과물은 참고용이며, 실제 시공 가능 여부 및 비용은 반드시 전문 인테리어 업체나 건축사의 확인이 필요합니다. 회사는 AI 결과물을 근거로 발생한 시공상 하자, 비용 손실 등에 대해 법적 책임을 지지 않습니다."
          },
          {
            h: "2. 인앱 결제 (Google Play / App Store)",
            p: "모바일 앱에서의 구독 및 토큰 구매는 Google Play 결제 시스템을 통해 처리됩니다. 구독 갱신은 현재 결제 기간 종료 24시간 전 자동으로 진행되며, Google Play 계정 설정에서 언제든지 관리할 수 있습니다. Google Play 정책에 따라 구매한 디지털 콘텐츠는 사용 시작 후 환불이 제한될 수 있습니다."
          },
          {
            h: "3. 사용자 데이터 및 업로드 콘텐츠",
            p: "사용자가 업로드한 공간 사진은 AI 분석 목적으로만 사용됩니다. 무료 사용자의 이미지는 분석 후 즉시 파기되며 저장되지 않습니다. 프로 사용자의 이미지는 Supabase 보안 스토리지에 암호화하여 저장됩니다."
          },
          {
            h: "4. 서비스 변경 및 중단",
            p: "회사는 서비스 품질 향상을 위해 사전 공지 후 서비스를 변경하거나 일시 중단할 수 있습니다. 유료 구독 기간 중 서비스가 중단되는 경우 잔여 기간에 해당하는 금액이 환불됩니다."
          }
        ]
      },
      privacy: {
        title: "개인정보 처리방침",
        sections: [
          {
            h: "1. 수집 항목 및 목적",
            p: "이메일 주소 (회원 식별), 서비스 이용 기록 (서비스 개선), 결제 정보 (Google Play를 통해 처리되며 당사 서버에 카드 정보는 저장되지 않음), 업로드 이미지 (AI 분석 후 즉시 파기 또는 Pro 유저 클라우드 저장)"
          },
          {
            h: "2. 제3자 제공 및 처리 위탁",
            p: "Google (Google Play 결제 처리, Firebase Analytics), Anthropic (Claude AI 분석), Google (Gemini AI 분석), Supabase (데이터베이스 및 스토리지). 모든 처리위탁은 개인정보 보호 계약 하에 이루어집니다."
          },
          {
            h: "3. 보유 기간 및 파기",
            p: "회원 탈퇴 시 30일 이내 모든 개인정보를 파기합니다. 단, 관련 법령(전자상거래법 등)에 따라 일정 기간 보존이 필요한 정보는 해당 기간 동안 보관 후 파기합니다."
          },
          {
            h: "4. 이용자 권리",
            p: "이용자는 언제든지 개인정보 조회, 수정, 삭제, 처리 정지를 요구할 수 있습니다. 문의: j730415@gmail.com"
          }
        ]
      },
      refund: {
        title: "환불 정책",
        sections: [
          {
            h: "1. Google Play 구매 환불",
            p: "Google Play를 통한 구매는 Google Play 환불 정책을 따릅니다. 구매 후 48시간 이내에는 Google Play 고객센터를 통해 환불을 요청할 수 있습니다."
          },
          {
            h: "2. 분석권 환불 기준",
            p: "구매 후 7일 이내, 분석권을 전혀 사용하지 않은 경우 전액 환불이 가능합니다. 1회라도 분석을 실행한 경우, 디지털 콘텐츠 즉시 인도의 특성상 환불이 불가합니다."
          },
          {
            h: "3. 프로 구독 해지",
            p: "프로 구독은 Google Play 설정 또는 앱 내 계정 설정에서 언제든지 해지할 수 있습니다. 해지 시 현재 결제 기간 종료까지 서비스가 유지되며, 이미 결제된 기간에 대한 일할 환불은 제공되지 않습니다."
          },
          {
            h: "4. 기술적 오류 환불",
            p: "서비스 오류로 인해 분석권이 차감되었으나 AI 분석이 정상 완료되지 않은 경우, 차감된 분석권을 복구해 드립니다. 문의: j730415@gmail.com"
          }
        ]
      }
    },
    en: {
      tos: {
        title: "Terms of Service",
        sections: [
          {
            h: "1. Service Usage & AI Disclaimer",
            p: "SPACE X-RAY is an AI-powered interior design reference tool. All AI-generated results are for reference purposes only. Actual construction feasibility and costs must be verified by a licensed architect or interior designer. The company bears no legal responsibility for damages arising from reliance on AI-generated designs."
          },
          {
            h: "2. In-App Purchases (Google Play / App Store)",
            p: "Subscriptions and token purchases on the mobile app are processed via Google Play Billing. Subscriptions auto-renew 24 hours before the current period ends and can be managed in your Google Play account settings. Per Google Play policy, refunds for digital content may be restricted once usage has started."
          },
          {
            h: "3. User Data & Uploaded Content",
            p: "Photos you upload are used solely for AI analysis. Free users' images are immediately discarded after analysis. Pro users' images are encrypted and stored in Supabase secure storage."
          },
          {
            h: "4. Service Changes",
            p: "The company may modify or temporarily suspend the service with prior notice. If the service is suspended during an active paid subscription, a prorated refund will be issued."
          }
        ]
      },
      privacy: {
        title: "Privacy Policy",
        sections: [
          {
            h: "1. Data Collected & Purpose",
            p: "Email address (user identification), usage logs (service improvement), payment info (processed via Google Play — no card data stored on our servers), uploaded images (discarded after analysis, or stored for Pro users)."
          },
          {
            h: "2. Third-Party Processors",
            p: "Google (Google Play Billing, Firebase Analytics), Anthropic (Claude AI analysis), Google (Gemini AI analysis), Supabase (database & storage). All processors operate under data protection agreements."
          },
          {
            h: "3. Retention & Deletion",
            p: "All personal data is deleted within 30 days of account deletion, except where required by law (e.g., e-commerce regulations)."
          },
          {
            h: "4. Your Rights",
            p: "You may request access, correction, deletion, or restriction of your personal data at any time. Contact: j730415@gmail.com"
          }
        ]
      },
      refund: {
        title: "Refund Policy",
        sections: [
          {
            h: "1. Google Play Purchases",
            p: "Purchases made via Google Play are subject to Google Play's refund policy. Refunds may be requested within 48 hours of purchase through the Google Play Help Center."
          },
          {
            h: "2. Credit Refund Policy",
            p: "Full refunds are available within 7 days of purchase if no credits have been consumed. Once any credit is used to run an AI analysis, the purchase is non-refundable due to immediate digital delivery."
          },
          {
            h: "3. Pro Subscription Cancellation",
            p: "Cancel anytime via Google Play settings or in-app account settings. Service continues until the end of the current billing period. No prorated refunds for unused time."
          },
          {
            h: "4. Technical Error Refunds",
            p: "If credits were deducted but AI analysis did not complete due to a service error, the credits will be restored. Contact: j730415@gmail.com"
          }
        ]
      }
    }
  };

  const l = language === 'ko' ? content.ko : content.en;
  let current = l.tos;
  if (activeTab === 'privacy') current = l.privacy;
  if (activeTab === 'refund') current = l.refund;

  return (
    <div className="h-full w-full max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-12 overflow-y-auto scrollbar-hide">
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">Back</span>
        </button>
        <div className="flex bg-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('tos')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'tos' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:bg-white/5'}`}
          >
            {language === 'ko' ? '이용약관' : 'Terms'}
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'privacy' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:bg-white/5'}`}
          >
            {language === 'ko' ? '개인정보처리방침' : 'Privacy'}
          </button>
          <button 
            onClick={() => setActiveTab('refund')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'refund' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:bg-white/5'}`}
          >
            {language === 'ko' ? '환불정책' : 'Refund'}
          </button>
        </div>
      </header>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
            {activeTab === 'tos' && <Scale className="w-8 h-8 text-primary" />}
            {activeTab === 'privacy' && <Shield className="w-8 h-8 text-primary" />}
            {activeTab === 'refund' && <RotateCcw className="w-8 h-8 text-primary" />}
          </div>
          <div>
            <h1 className="font-headline text-3xl font-black">{current.title}</h1>
            <p className="text-white/30 text-sm italic">Last updated: April 2026</p>
          </div>
        </div>

        <div className="space-y-6 bg-surface-muted p-8 rounded-3xl border border-white/5">
          {current.sections.map((s, i) => (
            <div key={i} className="space-y-3">
              <h3 className="font-headline font-bold text-xl text-white/80">{s.h}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{s.p}</p>
              {i < current.sections.map.length - 1 && <div className="h-px bg-white/5 pt-6" />}
            </div>
          ))}
        </div>

        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-2xl">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary mb-1">
              {language === 'ko' ? '금융 보안 준수' : 'Financial Security Compliant'}
            </h4>
            <p className="text-white/40 text-xs leading-relaxed">
              {language === 'ko'
                ? '모바일 결제는 Google Play Billing을 통해 처리되며 PCI-DSS 인증 환경을 준수합니다. 귀하의 카드 정보는 당사 서버에 저장되지 않습니다. AI 분석 결과는 참고용이며 전문가 확인이 필요합니다.'
                : 'Mobile payments are processed via Google Play Billing, complying with PCI-DSS standards. Card information is never stored on our servers. AI results are for reference only and require professional verification.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
