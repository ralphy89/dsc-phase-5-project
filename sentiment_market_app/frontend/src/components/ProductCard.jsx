import ReviewPreview from './ReviewPreview';

const StarRating = ({ rating = 0, showValue = false }) => {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < stars ? 'text-amber-500 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default function ProductCard({ product, onOpen }) {
  const sentimentScore = product.sentimentScore ?? 0;
  const getSentimentLabel = (score) => {
    if (score >= 75) return { text: "Très Apprécié", color: "bg-emerald-100 text-emerald-700" };
    if (score >= 50) return { text: "Populaire", color: "bg-blue-100 text-blue-700" };
    if (score >= 25) return { text: "Tendance", color: "bg-purple-100 text-purple-700" };
    return { text: "Nouveau", color: "bg-orange-100 text-orange-700" };
  };

  const sentiment = getSentimentLabel(sentimentScore);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer" onClick={onOpen}>
      {/* Badge Sentiment */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${sentiment.color}`}>
          {sentiment.text}
        </span>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.averageRating || 0} size="sm" />
          <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
        </div>

        {/* Prix et actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">HTG</span>
            </span>
            {product.brand && (
              <span className="text-xs text-gray-500">{product.brand}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Ajouter au panier
                console.log("Ajouté au panier:", product.name);
              }}
              className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Ajouter au panier"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              onClick={onOpen}
              className="px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Voir
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}

