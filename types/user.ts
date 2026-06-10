export type User = {
  id: string;
  email: string;
  nickname: string;
  profile_url: string;
  // null = DB 프로필을 아직 불러오지 않은 상태
  role: string | null;
};
