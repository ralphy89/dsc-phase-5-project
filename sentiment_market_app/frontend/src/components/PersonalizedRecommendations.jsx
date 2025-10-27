import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useAPI } from '../hooks/useAPI';

// Composant StarRating simple
const StarRating = ({ rating = 0, size = "sm" }) => {
  const stars = Math.round(rating);
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const PersonalizedRecommendations = React.memo(({ userId, userEmail, navigate }) => {
  const { apiUrl } = useAPI();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord l'URL configurée
      let response;
      try {
        response = await axios.get(`${apiUrl}/api/recommendations/user/${userId}`);
      } catch (firstError) {
        // Fallback: essayer avec l'IP locale détectée
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const fallbackUrl = `http://${hostname}:5050`;
          response = await axios.get(`${fallbackUrl}/api/recommendations/user/${userId}`);
        } else {
          throw firstError;
        }
      }
      
      if (isMounted) {
        if (response.data.success) {
          setRecommendations(response.data.recommendations || []);
        } else {
          setError("Aucune recommandation disponible");
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des recommandations:", err);
      
      if (isMounted) {
        if (err.response?.status === 404) {
          setError("Service de recommandations non disponible");
        } else if (err.code === 'ECONNREFUSED') {
          setError("Serveur backend non démarré");
        } else {
          setError("Erreur lors du chargement des recommandations");
        }
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [userId, apiUrl]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const getReasonText = useCallback((reason) => {
    switch (reason) {
      case "similar_to_liked":
        return "Produit similaire à vos favoris";
      case "popular":
        return "Produit populaire";
      default:
        return "Recommandé pour vous";
    }
  }, []);

  const getReasonIcon = useCallback((reason) => {
    switch (reason) {
      case "similar_to_liked":
        return "🎯";
      case "popular":
        return "⭐";
      default:
        return "💡";
    }
  }, []);

  const handleToggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  if (!userId) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🔐</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recommandations</h3>
            <p className="text-sm text-gray-600">Connectez-vous pour voir vos recommandations</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          Connectez-vous pour recevoir des recommandations basées sur vos commentaires positifs.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recommandations </h3>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recommandations </h3>
            <p className="text-sm text-gray-600">Erreur de chargement</p>
          </div>
        </div>
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button 
          onClick={fetchRecommendations}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const displayRecommendations = showAll ? recommendations : recommendations.slice(0, 3);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Recommandations </h3>
            <p className="text-sm text-gray-600">
              {recommendations.length} produit{recommendations.length > 1 ? 's' : ''} recommandé{recommendations.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {recommendations.length > 3 && (
          <button
            onClick={handleToggleShowAll}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAll ? 'Voir moins' : 'Voir tout'}
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💭</span>
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Aucune recommandation disponible</h4>
          <p className="text-gray-600 text-sm mb-4">
            Laissez des commentaires positifs sur des produits pour recevoir des recommandations personnalisées.
          </p>
          <p className="text-xs text-gray-500">
            Ou découvrez nos produits les mieux notés ci-dessous.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayRecommendations.map((rec, index) => {
            // Convertir les recommandations en format compatible avec ProductCard
            const product = {
              _id: rec.productId,
              name: rec.name || rec.productName,
              brand: rec.brand,
              categories: Array.isArray(rec.categories) ? rec.categories.join(', ') : rec.categories,
              price: rec.price || 0,
              imageUrl: rec.image,
              description: rec.description,
              averageRating: rec.averageRating || rec.score,
              totalReviews: rec.totalReviews || 0,
              availability: rec.availability,
              features: rec.features,
              recommendationReason: rec.reason,
              recommendationScore: rec.score
            };
            
            return (
              <div key={`${rec.productCsvId}-${index}`} className="relative">
                {/* Badge de recommandation */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                  <span className="text-lg">{getReasonIcon(rec.reason)}</span>
                  <span className="text-gray-700">{getReasonText(rec.reason)}</span>
                </div>
                
                {/* Score de recommandation */}
                <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white rounded-full px-2 py-1 text-xs font-medium">
                  {Math.round(rec.score * 100)}%
                </div>
                
                <ProductCard 
                  product={product} 
                  onOpen={() => navigate(`/product/${rec.productId}`)} 
                />
              </div>
            );
          })}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Ces recommandations sont basées sur vos commentaires positifs.
          </p>
        </div>
      )}
    </div>
  );
});

// Définir le displayName pour faciliter le débogage
PersonalizedRecommendations.displayName = 'PersonalizedRecommendations';

export default PersonalizedRecommendations;