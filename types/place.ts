export type PlaceKeyword = {
  name: string;
  count: number;
};

export type Place = {
  id: string;
  latitude: number | null;
  longitude: number | null;
  name: string;
  classification: string | null;
  img_url: string | null;
  ribbon_cardinal: number | null;
  ribbon_deepred: number | null;
  ribbon_pink: number | null;
  keywords?: PlaceKeyword[];
};
