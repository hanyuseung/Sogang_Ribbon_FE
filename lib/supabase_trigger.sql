-- 기존 트리거/함수 제거
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 재생성: "user" 쿼팅 적용
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."user" (id, email, nickname, role, review_cnt)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    'user',
    0
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 이미 생성된 auth 유저 중 public."user" 레코드 없는 것 수동 삽입
INSERT INTO public."user" (id, email, nickname, role, review_cnt)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'nickname', split_part(email, '@', 1)),
  'user',
  0
FROM auth.users
WHERE id NOT IN (SELECT id FROM public."user");
