export interface Feedback {
  id: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
}

export type SortBy = "date-desc" | "date-asc" | "rating-desc" | "rating-asc"

export interface FilterOptions {
  sortBy: SortBy
  searchTerm: string
}
