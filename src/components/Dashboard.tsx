'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { FilterOptions, SortBy } from '../types/feedback';
import { FeedbackCard } from './FeedbackCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useFeedbacks } from '@/hooks/useFeedbacks';

export function Dashboard() {
  const { logout } = useAuth();
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'date-desc',
    searchTerm: '',
  });
  const { feedbacks, loading, error } = useFeedbacks(filters);

  const filteredAndSortedFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(
        (feedback) =>
          feedback.userName.toLowerCase().includes(searchLower) ||
          feedback.comment.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'date-asc':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [filters, feedbacks]);

  const handleSortChange = (sortBy: SortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  };

  const averageRating = useMemo(() => {
    if (filteredAndSortedFeedbacks.length === 0) return 0;
    const sum = filteredAndSortedFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / filteredAndSortedFeedbacks.length).toFixed(1);
  }, [filteredAndSortedFeedbacks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-xl">Carregando feedbacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Feedbacks</h1>
            <Button onClick={logout} variant="outline">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Feedbacks</h3>
            <p className="text-3xl font-bold text-blue-600">{feedbacks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nota Média</h3>
            <p className="text-3xl font-bold text-green-600">{averageRating}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedbacks Filtrados</h3>
            <p className="text-3xl font-bold text-purple-600">
              {filteredAndSortedFeedbacks.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nome ou comentário
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Digite para buscar..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="md:w-64">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortBy)}
                className="w-full h-10 px-3 py-2 border border-input bg-transparent rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="date-desc">Data (Mais recente)</option>
                <option value="date-asc">Data (Mais antigo)</option>
                <option value="rating-desc">Nota (Maior)</option>
                <option value="rating-asc">Nota (Menor)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAndSortedFeedbacks.length > 0 ? (
            filteredAndSortedFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum feedback encontrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
