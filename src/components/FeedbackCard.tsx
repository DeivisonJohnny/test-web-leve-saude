import Utils from '@/utils/Utils';
import type { Feedback } from '../types/feedback';
import { Card, CardContent } from './ui/Card';

interface FeedbackCardProps {
  feedback: Feedback;
  searchTerm?: string;
}

export function FeedbackCard({ feedback, searchTerm }: FeedbackCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {Utils.highlightMatch(feedback.userName, searchTerm || '')}
            </h3>

            <div className="flex items-center mt-1">
              {renderStars(feedback.rating)}
              <span className="ml-2 text-sm text-gray-600">({feedback.rating}/5)</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">{formatDate(feedback.createdAt)}</span>
        </div>

        <p className="text-gray-700 leading-relaxed">
          {Utils.highlightMatch(feedback.comment, searchTerm || '')}
        </p>
      </CardContent>
    </Card>
  );
}
