import { Place } from "@/types/place"

export type AwardPlace = Pick<
  Place,
  "id" | "name" | "classification" | "img_url" | "desc_thumbnail" | "desc_detail"
>

export type AwardResult = {
  id: string
  rank: number | null
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
