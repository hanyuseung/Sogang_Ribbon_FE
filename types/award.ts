export type Award = {
  award_id: number;
  name: string;
  date: string;
};

export type AwardCategory = {
  id: number;
  award_id: number;
  name: string;
};

export type AwardRes = {
  award_category_id: number;
  place_id: number;
  count: number;
  rank: number;
};
