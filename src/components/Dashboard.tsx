'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { FilterOptions, SortBy } from '../types/feedback';
import { FeedbackCard } from './FeedbackCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import {
  Heart,
  Shield,
  MessageSquare,
  Star,
  Filter,
  Search,
  TrendingUp,
  Users,
  LogOut,
  BarChart3,
  Calendar,
  SortDesc,
  Loader2,
  AlertCircle,
} from 'lucide-react';

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

  const positiveRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const positive = feedbacks.filter((f) => f.rating >= 4).length;
    return Math.round((positive / feedbacks.length) * 100);
  }, [feedbacks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Leve Saúde
          </h2>
          <p className="text-gray-600 text-lg">Carregando feedbacks...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h2>
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Shield className="w-2.5 h-2.5 text-blue-500" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Leve Saúde
                </h1>
                <p className="text-sm text-gray-600 flex items-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Dashboard de Feedbacks
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Feedbacks</p>
                <p className="text-3xl font-bold text-gray-900">{feedbacks.length}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  Usuários ativos
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Nota Média</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                  <span className="text-lg text-gray-500">/5</span>
                </div>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(Number.parseFloat(averageRating as string))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Satisfação</p>
                <p className="text-3xl font-bold text-gray-900">{positiveRating}%</p>
                <p className="text-xs text-gray-500 mt-1">Avaliações 4+ estrelas</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Filtrados</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredAndSortedFeedbacks.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Resultados atuais</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Filter className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filtros e Busca</h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nome ou comentário
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Digite para buscar..."
                  value={filters.searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <div className="relative">
                <SortDesc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="sort"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortBy)}
                  className="w-full h-12 pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="date-desc">📅 Data (Mais recente)</option>
                  <option value="date-asc">📅 Data (Mais antigo)</option>
                  <option value="rating-desc">⭐ Nota (Maior)</option>
                  <option value="rating-asc">⭐ Nota (Menor)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {filters.searchTerm && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Filtrado por:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                "{filters.searchTerm}"
              </span>
              <button
                onClick={() => handleSearchChange('')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Limpar
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {filteredAndSortedFeedbacks.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Feedbacks ({filteredAndSortedFeedbacks.length})
                </h2>
                <div className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Atualizado agora
                </div>
              </div>
              <div className="grid gap-6">
                {filteredAndSortedFeedbacks.map((feedback, index) => (
                  <div
                    key={feedback.id}
                    className="transform transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards',
                    }}
                  >
                    <FeedbackCard feedback={feedback} searchTerm={filters.searchTerm} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum feedback encontrado
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filters.searchTerm
                    ? 'Não encontramos feedbacks que correspondam aos seus critérios de busca. Tente ajustar os filtros.'
                    : 'Ainda não há feedbacks para exibir. Os feedbacks dos usuários aparecerão aqui.'}
                </p>
                {filters.searchTerm && (
                  <Button
                    onClick={() => handleSearchChange('')}
                    className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
