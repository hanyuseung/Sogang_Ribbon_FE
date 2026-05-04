export type Keyword = {
  keyword_id: number;
  name: string;
  order: number;
};

export type PlaceKeyword = {
  place_id: number;
  keyword_id: number;
  count: number;
};
