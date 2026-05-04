export type Emblem = {
  emblem_id: number;
  name: string;
  icon_url: string;
  tier_order: number;
  review_threshold: number;
  type: string;
};

export type UserEmblem = {
  userid: number;
  emblemid: number;
};
