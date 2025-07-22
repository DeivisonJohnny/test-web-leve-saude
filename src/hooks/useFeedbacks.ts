import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

export type Feedback = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const feedbackRef = ref(db, 'feedbacks');

    const unsubscribe = onValue(
      feedbackRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const lista = Object.entries(data).map(([id, item]: [string, any]) => ({
            id,
            userName: item.userName,
            rating: item.rating,
            comment: item.comment,
            createdAt: new Date(item.createdAt),
          }));

          lista.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
  }, []);

  return { feedbacks, loading, error };
}
