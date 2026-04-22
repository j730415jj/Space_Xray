# SPACE X-RAY — 개발 로드맵

> 최종 업데이트: 2026-04-22
> 담당: Claude (코드 구현) | Gemini (기획)

---

## ✅ Phase 1 — 기반 구축 (완료)

- [x] React + Vite + TypeScript 프로젝트 세팅
- [x] Express 서버 구성 (server.ts)
- [x] Tailwind CSS 다크 테마 UI 구축
- [x] 다국어 지원 (한국어 / 영어 / 일본어)
- [x] 랜딩, 로그인, 스튜디오, 결과, 상점, 프로필, 법적 페이지 구현

---

## ✅ Phase 2 — AI 엔진 및 인프라 연결 (완료)

- [x] **Gemini 1.5 Flash** 연결 (무료 유저용 — 가성비 우선)
- [x] **Claude 3.5 Sonnet** 연결 (Pro 유저용 — 고품질 분석)
- [x] 유저 등급별 모델 자동 스위칭 (`ModelSelector` 로직, server.ts 내)
- [x] **Supabase** 연결 (DB + Storage)
  - Pro 유저: 이미지 Supabase Storage 업로드 (500MB 한도)
  - Free 유저: 분석 후 이미지 즉시 파기 (휘발성)
  - 분석 이력 `analyses` 테이블 저장
- [x] **WebP 자동 압축** (업로드 전 Canvas API로 최대 1200px, 85% 품질 변환)
- [x] 실제 카메라 촬영 연동 (`capture="environment"` — 모바일 후면 카메라)

---

## ✅ Phase 3 — 상점 및 결제 현실화 (완료)

- [x] 가격 업데이트
  - 프로 구독: **₩14,900/월** (월 50회 분석, 500MB 저장소)
  - 베이직 팩: 100토큰 **₩4,900**
  - 스마트 팩: 500토큰 **₩19,000** (22% 할인)
  - 프로 팩: 1,500토큰 **₩49,000** (33% 절약)
- [x] 토큰 팩명 정리: 베이직 팩 / 스마트 팩 / 프로 팩
- [x] Material Icons 오타 제거 → Lucide Icons로 교체
- [x] Google Pay 결제 안내 추가 (모바일 앱 출시 후 Google Play Billing 적용 예정)
- [x] Stripe 결제 세션 통화 KRW로 변경

---

## ✅ Phase 4 — 법적 정책 (완료)

- [x] 이용약관 — AI 결과물 책임 제한 문구, Google Play 인앱 결제 조항 포함
- [x] 개인정보처리방침 — 제3자 처리위탁 (Google, Anthropic, Supabase) 명시
- [x] 환불정책 — Google Play 48시간 환불, 토큰 사용 시 환불 불가 조항

---

## 🔲 Phase 5 — Supabase DB 세팅 (수동 작업 필요)

Supabase 대시보드에서 아래 테이블 생성 필요:

```sql
CREATE TABLE analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  style text,
  image_url text,
  result jsonb,
  model_used text,
  created_at timestamptz DEFAULT now()
);

-- Storage 버킷 생성 (Supabase 대시보드 > Storage)
-- 버킷명: user-images (Public 아님, 인증 필요)
-- 용량 정책: 사용자당 500MB 제한 (별도 Edge Function으로 관리 권장)
```

---

## 🔲 Phase 6 — 실제 인증 시스템 (예정)

- [ ] Supabase Auth 연동 (이메일/구글 소셜 로그인)
- [ ] 현재 Mock 로그인 → 실제 JWT 토큰 기반 인증으로 교체
- [ ] 토큰 잔고를 Supabase DB에서 관리

---

## 🔲 Phase 7 — 모바일 앱 (예정)

- [ ] React Native / Expo 전환 검토
- [ ] Google Play Billing 인앱 결제 실제 연동
- [ ] App Store 제출 준비

---

## 🔑 환경 변수 (.env)

| 변수명 | 설명 | 상태 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 키 | ✅ |
| `SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anon 키 | ✅ |
| `ANTHROPIC_API_KEY` | Claude API 키 | 🔲 추가 필요 |
| `STRIPE_SECRET_KEY` | Stripe 비밀 키 | 🔲 추가 필요 |

---

## 📁 프로젝트 구조

```
visioninterior/
├── server.ts          # Express + Gemini/Claude/Supabase API
├── src/
│   ├── App.tsx        # 라우팅 및 상태 관리
│   ├── components/
│   │   ├── Studio.tsx  # 카메라 촬영 + AI 분석 요청
│   │   ├── Results.tsx # 분석 결과 표시
│   │   ├── Pricing.tsx # 상점 및 결제
│   │   ├── Legal.tsx   # 법적 정책 문서
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts
│   └── contexts/
│       └── LanguageContext.tsx
└── roadmap.md         # 이 파일
```
