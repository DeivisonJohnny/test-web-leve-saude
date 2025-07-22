import { useEffect, useState } from 'react';
import { ref, query, orderByChild, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

export type Feedback = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export function useFeedbacks(filters?: {
  sortBy?: 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc';
  searchTerm?: string;
}) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(ref(db, 'feedbacks'), orderByChild('createdAt'));

    const unsubscribe = onValue(
      q,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          let lista = Object.entries(data).map(([id, item]: [string, any]) => ({
            id,
            userName: item.userName,
            rating: item.rating,
            comment: item.comment,
            createdAt: new Date(item.createdAt),
          }));

          // Filtro (aplicado no frontend pois Firebase não suporta contains)
          if (filters?.searchTerm) {
            const term = filters.searchTerm.toLowerCase();
            lista = lista.filter(
              (item) =>
                item.userName.toLowerCase().includes(term) ||
                item.comment.toLowerCase().includes(term)
            );
          }

          // Ordenação (poderia ser no Firebase se fosse por um campo fixo)
          if (filters?.sortBy === 'date-asc') {
            lista.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
          } else if (filters?.sortBy === 'rating-asc') {
            lista.sort((a, b) => a.rating - b.rating);
          } else if (filters?.sortBy === 'rating-desc') {
            lista.sort((a, b) => b.rating - a.rating);
          } else {
            // date-desc (padrão)
            lista.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          }

          setFeedbacks(lista);
        } else {
          setFeedbacks([]);
        }

        setLoading(false);
      },
      (err) => {
        console.error('Erro ao ler feedbacks:', err);
        setError('Erro ao carregar feedbacks');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [filters?.sortBy, filters?.searchTerm]);

  return { feedbacks, loading, error };
}
