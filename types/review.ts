export type ReviewImage = {
  id: number;
  reviewid: number;
  img_url: string;
  sort_order: number;
  created_at: string;
};

export type Review = {
  id: number;
  userid: number;
  placeid: number;
  keyword_ids: number[];
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  is_del: boolean;
  created_at: string;
};

export type ReviewWithImages = Review & {
  images: ReviewImage[];
};
