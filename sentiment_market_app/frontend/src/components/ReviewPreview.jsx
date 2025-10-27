import { useState } from 'react';

const StarRating = ({ rating = 0, size = 'sm' }) => {
  const stars = Math.round(rating);
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < stars ? 'text-amber-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const SentimentBadge = ({ sentiment }) => {
  const getSentimentStyle = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSentimentStyle(sentiment)}`}>
      <span>{getSentimentIcon(sentiment)}</span>
      <span className="capitalize">{sentiment || 'Neutral'}</span>
    </span>
  );
};

export default function ReviewPreview({ reviews = [], maxReviews = 3 }) {
  const [showAll, setShowAll] = useState(false);
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Aucun avis disponible
      </div>
    );
  }

  const displayReviews = showAll ? reviews : reviews.slice(0, maxReviews);
  const hasMore = reviews.length > maxReviews;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          Avis récents ({reviews.length})
        </h4>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? 'Voir moins' : `Voir tous (${reviews.length})`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayReviews.map((review, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-gray-600">
                  {review.userId || 'Anonyme'}
                </span>
              </div>
              <SentimentBadge sentiment={review.userSentiment} />
            </div>
            
            {review.reviewTitle && (
              <h5 className="text-sm font-medium text-gray-900 mb-1">
                {review.reviewTitle}
              </h5>
            )}
            
            <p className="text-sm text-gray-700 line-clamp-2">
              {review.reviewText}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {new Date(review.reviewDate).toLocaleDateString('fr-FR')}
              </span>
              {review.didPurchase && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  ✓ Acheté
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
