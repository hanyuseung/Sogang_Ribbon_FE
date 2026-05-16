export type AwardPlace = {
  id: string
  name: string
  classification: string | null
  img_url: string | null
}

export type AwardResult = {
  id: string
  rank: number | null
  count: number
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
  year: number
  categories: AwardCategory[]
}
