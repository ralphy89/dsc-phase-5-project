import { useEffect, useState } from "react";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../contexts/AuthContext";

const StarRating = ({ rating = 0, size = 'md' }) => {
  const stars = Math.round(rating);
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < stars ? 'text-amber-500 dark:text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("description");
  const { currentUser } = useAuth();
  
  // Utiliser l'ID Firebase de l'utilisateur connecté, ou un ID par défaut si pas connecté
  const userId = currentUser?.uid || "000000000000000000000001";

  const load = async () => {
    try {
      // Récupérer depuis votre API MongoDB (qui inclut maintenant tous les vrais avis)
      const { data } = await axios.get(`/api/products/${productId}`);
      
      // console.log(`Produit chargé: ${data.name}`);
      // console.log(`Avis reçus: ${data.reviews ? data.reviews.length : 0}`);
      
      // Les avis sont maintenant directement inclus dans la réponse de l'API
      // Pas besoin de traitement supplémentaire
      setProduct(data);
    } catch (error) {
      console.error("Erreur lors du chargement du produit:", error);
      setProduct(null);
    }
  };

  const reloadReviews = async () => {
    await load();
  };

  const addToCart = () => {
    console.log(`Ajouté au panier: ${product.name} x${quantity}`);
    // TODO: Implémenter le panier
  };

  useEffect(() => {
    load();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const averageRating = product.averageRating ?? 0;
  const totalReviews = product.totalReviews ?? 0;
  const reviews = product.reviews || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500">
        <button className="hover:text-gray-900 transition-colors">Accueil</button>
        <span className="mx-2">/</span>
        <button className="hover:text-gray-900 transition-colors">Produits</button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Produit principal */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-96 object-cover rounded-lg" 
            />
          </div>
          {/* Miniatures (placeholder pour galerie future) */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-1 rounded-lg border border-gray-200 cursor-pointer hover:ring-2 ring-blue-500 transition-all">
                <img 
                  src={product.imageUrl} 
                  alt={`${product.name} ${i}`} 
                  className="w-full h-20 object-cover rounded-md opacity-60 hover:opacity-100 transition-opacity" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Informations produit */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* Rating et avis */}
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={averageRating} />
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">{averageRating.toFixed(1)}/5</span>
                <span className="text-xs text-gray-600">{totalReviews} avis</span>
              </div>
            </div>

            {/* Prix */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">{product.price.toFixed(2)} HTG</span>
              <span className="text-gray-400 line-through text-lg">{(product.price * 1.3).toFixed(2)} HTG</span>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">-30%</span>
            </div>
            {/* Brand et Manufacturer */}
            {(product.brand || product.manufacturer) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.brand && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">🏷️ {product.brand}</span>
                )}
                {product.manufacturer && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">🏭 {product.manufacturer}</span>
                )}
              </div>
            )}
          </div>

          {/* Description courte */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantité et ajout au panier */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Quantité:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={addToCart} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ajouter au panier
              </button>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              En stock - Expédition sous 24h
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Garantie 2 ans
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Retour gratuit sous 30 jours
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Avis */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab("description")}
            className={`px-6 py-4 font-medium transition-colors ${
              selectedTab === "description"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setSelectedTab("reviews")}
            className={`px-6 py-4 font-medium transition-colors ${
              selectedTab === "reviews"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Avis ({reviews.length})
          </button>
        </div>

        <div className="p-6">
          {selectedTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Caractéristiques principales</h3>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Qualité premium avec garantie constructeur</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Design moderne et ergonomique</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Performances optimales pour un usage quotidien</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>Compatible avec tous les écosystèmes</span></li>
              </ul>
            </div>
          )}

          {selectedTab === "reviews" && (
            <div className="space-y-6">
              {/* Formulaire d'avis */}
              <ReviewForm 
                productId={productId} 
                userId={userId} 
                userEmail={currentUser?.email || null}
                userDisplayName={currentUser?.displayName || null}
                onReviewAdded={reloadReviews} 
              />
              
              {/* Indicateur d'authentification */}
              {!currentUser && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    ⚠️ Vous n'êtes pas connecté. Connectez-vous pour laisser un avis.
                  </p>
                </div>
              )}

              {/* Liste des avis */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {review.username?.substring(0, 2).toUpperCase() || "AN"}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {review.username || "Anonyme"}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {review.userEmail && (
                                <span className="text-blue-600">📧 {review.userEmail}</span>
                              )}
                              {review.userCity && <span>📍 {review.userCity}</span>}
                              {review.reviewDate && (
                                <span>
                                  {new Date(review.reviewDate).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarRating rating={review.rating} size="sm" />
                          {review.didPurchase && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Achat vérifié
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {review.title}
                        </h4>
                      )}
                      
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {review.text}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          review.sentiment === "Positive" 
                            ? "bg-green-100 text-green-700" 
                            : review.sentiment === "Negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {review.sentiment === "Positive" ? "😊 Positif" : review.sentiment === "Negative" ? "😞 Négatif" : "😐 Neutre"}
                        </span>
                        {review.doRecommend !== null && (
                          <span className="text-xs text-gray-600">
                            {review.doRecommend ? "👍 Recommande" : "👎 Ne recommande pas"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis !
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

