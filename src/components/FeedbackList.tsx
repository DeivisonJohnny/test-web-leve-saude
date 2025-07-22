"use client"

import { useMemo } from "react"
import { FeedbackCard } from "./FeedbackCard"
import { FeedbackFilters } from "./FeedbackFilters"
import type { Feedback, FilterOptions } from "@/types/feedback"
import { MessageSquare, TrendingUp } from "lucide-react"

interface FeedbackListProps {
  feedbacks: Feedback[]
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export const FeedbackList = ({ feedbacks, filters, onFiltersChange }: FeedbackListProps) => {
  const filteredAndSortedFeedbacks = useMemo(() => {
    let filtered = feedbacks

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (feedback) =>
          feedback.userName.toLowerCase().includes(searchLower) || feedback.comment.toLowerCase().includes(searchLower),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "date-desc":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "date-asc":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "rating-desc":
          return b.rating - a.rating
        case "rating-asc":
          return a.rating - b.rating
        default:
          return 0
      }
    })

    return filtered
  }, [feedbacks, filters])

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0
    const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0)
    return (sum / feedbacks.length).toFixed(1)
  }, [feedbacks])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Feedbacks</p>
              <p className="text-2xl font-semibold text-gray-900">{feedbacks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Nota Média</p>
              <p className="text-2xl font-semibold text-gray-900">{averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FeedbackFilters filters={filters} onFiltersChange={onFiltersChange} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          {filteredAndSortedFeedbacks.length === feedbacks.length
            ? `${feedbacks.length} feedbacks`
            : `${filteredAndSortedFeedbacks.length} de ${feedbacks.length} feedbacks`}
        </p>
      </div>

      {/* Feedback list */}
      {filteredAndSortedFeedbacks.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum feedback encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.searchTerm ? "Tente ajustar os filtros de busca." : "Não há feedbacks para exibir."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  )
}
