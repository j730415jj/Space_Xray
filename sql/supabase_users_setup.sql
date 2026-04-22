-- Supabase: users 테이블 및 크레딧 관리 함수 생성
-- 복사해서 Supabase SQL Editor에 붙여넣고 실행하세요.

-- 1) users 테이블 생성 (auth.users.id를 FK로 연결)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  is_pro boolean DEFAULT false,
  credits integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2) 신규 가입 시(또는 운영에서) 크레딧을 안전하게 증가시키는 함수
-- SECURITY DEFINER로 실행되어, 이 함수를 호출할 때는 서버에서 서비스 역할 키로 호출하세요.
CREATE OR REPLACE FUNCTION public.upsert_add_credits(p_id uuid, p_amount integer)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, credits, created_at)
  VALUES (p_id, GREATEST(p_amount, 0), now())
  ON CONFLICT (id) DO UPDATE
    SET credits = public.users.credits + GREATEST(p_amount, 0);
END;
$$;

-- 3) (선택) 초기값을 부여하는 예시 호출
-- SELECT public.upsert_add_credits('00000000-0000-0000-0000-000000000000', 6);

-- 4) 권장: 서버에서 SUPABASE_SERVICE_ROLE_KEY를 사용하여 이 함수를 호출하세요.
-- 예: 서버에서 POST /api/add_credits 를 호출하면 서버가 서비스 역할 키로
--       RPC를 실행하거나 단순한 upsert 쿼리를 수행하면 안전합니다.

-- 권한: 함수 소유자(보통 'postgres' 또는 현재 사용 계정)의 권한으로 실행됩니다.
-- 주의: 서비스 역할 키는 절대 클라이언트(브라우저)에 노출하지 마세요.

-- 끝.
