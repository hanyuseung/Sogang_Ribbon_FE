import { Place } from "@/types/place"

export type AwardPlace = Pick<
  Place,
  "id" | "name" | "classification" | "img_url" | "desc_thumbnail" | "desc_detail"
>

export type AwardResult = {
  id: string
  rank: number | null
  description: string | null
  place: AwardPlace
}

export type AwardCategory = {
  id: string
  name: string | null
  results: AwardResult[]
}

export type AwardData = {
  id: string
  name: string
  dateStart: Date | null
  categories: AwardCategory[]
}

export type AwardResultInput = {
  id?: string
  placeId: string
  rank: number | null
  description: string | null
}

export type AwardCategoryInput = {
  id?: string
  name: string | null
  results: AwardResultInput[]
}

export type AwardInput = {
  name: string
  dateStart: string | null
  categories: AwardCategoryInput[]
}

// 관리자 API의 날짜는 JSON 문자열로 전달한다.
export type AdminAward = AwardInput & { id: string }

export type AdminAwardSummary = {
  id: string
  name: string
  dateStart: string | null
  categoryCount: number
  resultCount: number
}
