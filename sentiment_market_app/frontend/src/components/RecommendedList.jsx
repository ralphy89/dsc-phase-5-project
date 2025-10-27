import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { useAPI } from "../hooks/useAPI";

export default function RecommendedList({ userId, navigate }) {
  const { apiUrl } = useAPI();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/recommendations/user/${userId}`);
      
      if (response.data.success && response.data.recommendations) {
        // Convertir les recommandations en format compatible avec ProductCard
        console.log("response.data.recommendations :", response.data.recommendations);
        const products = response.data.recommendations.map(rec => ({
          _id: rec.productId,
          name: rec.productName,
          brand: rec.brand,
          categories: Array.isArray(rec.categories) ? rec.categories.join(', ') : rec.categories,
          averageRating: rec.score,
          totalReviews: 0,
          price: 0,
          image: null
        }));
        setItems(products);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des recommandations:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  if (loading) {
    return (
      <section className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <span className="text-3xl">✨</span>
            Recommandés pour vous
          </h2>
          <p className="text-gray-600 text-sm">Sélection personnalisée basée sur vos préférences</p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Voir tout
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} onOpen={() => navigate(`/product/${p._id}`)} />
        ))}
      </div>
    </section>
  );
}

