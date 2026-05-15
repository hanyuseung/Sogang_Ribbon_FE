INSERT INTO public.keyword (name, "order") VALUES
  ('밥약하기 좋아요', 1),
  ('맛이 있어요', 2),
  ('가성비 좋아요', 3),
  ('분위기 좋아요', 4),
  ('친절해요', 5),
  ('혼자 먹기 좋아요', 6),
  ('모임장소로 좋아요', 7),
  ('데이트하기 좋아요', 8)
ON CONFLICT DO NOTHING;
