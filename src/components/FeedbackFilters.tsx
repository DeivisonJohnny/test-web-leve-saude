"use client"

import { Search, Filter } from "lucide-react"
import type { FilterOptions, SortOption } from "@/types/feedback"

interface FeedbackFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export const FeedbackFilters = ({ filters, onFiltersChange }: FeedbackFiltersProps) => {
  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Buscar por nome ou comentário..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="sm:w-64">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
            <Filter className="inline h-4 w-4 mr-1" />
            Ordenar por
          </label>
          <select
            id="sort"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
          >
            <option value="date-desc">Data (Mais recente)</option>
            <option value="date-asc">Data (Mais antigo)</option>
            <option value="rating-desc">Nota (Maior)</option>
            <option value="rating-asc">Nota (Menor)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
