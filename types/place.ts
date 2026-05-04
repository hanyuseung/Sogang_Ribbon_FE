export type PlaceKeyword = {
  name: string;
  count: number;
};

export type Place = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  classification: string;
  img_url: string;
  ribbon_cardinal: number;
  ribbon_deepred: number;
  ribbon_pink: number;
  keywords?: PlaceKeyword[];
};
