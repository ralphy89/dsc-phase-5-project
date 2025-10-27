import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import Pagination from "../components/Pagination";
import { useAuth } from "../contexts/AuthContext";

export default function Home({ navigate }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("most-reviews");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [maxLength, setMaxLength] = useState(""); // Valeur du filtre
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "guest";

  const categories = [
    { id: "all", name: "Tous les produits", icon: "🛍️" },
    { id: "electronics", name: "Électronique", icon: "💻" },
    { id: "fashion", name: "Mode", icon: "👗" },
    { id: "home", name: "Maison", icon: "🏠" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "books", name: "Livres", icon: "📚" },
  ];
  
  const load = async (page = 1, sort = sortBy) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products?page=${page}&limit=15&sort=${sort}`);
      // Utiliser une fonction pour garantir que l'état est mis à jour correctement
      setProducts(() => data.products);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
      if (!initialLoadComplete) {
        // Utiliser setTimeout pour s'assurer que le flag est défini après le render
        setTimeout(() => setInitialLoadComplete(true), 0);
      }
    }
  };

  useEffect(() => {
    load();
    console.log("user id :", userId);
  }, []);

  // Utilisation de useMemo pour mémoriser les produits filtrés
  const filteredProducts = useMemo(() => {
    // Si pas de produits, retourner un tableau vide
    if (products.length === 0) {
      return [];
    }

    // Créer une nouvelle copie pour éviter les mutations
    let filtered = products.map(p => ({...p}));
    
    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtrer par longueur max si définie
    if (maxLength) {
      filtered = filtered.filter((p) => p.length && p.length <= parseFloat(maxLength));
    }
    
    // Tri - Créer une nouvelle copie avant de trier
    const sorted = [...filtered];
    
    if (sortBy === "popular") {
      sorted.sort((a, b) => (b.sentimentScore || 0) - (a.sentimentScore || 0));
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "most-reviews") {
      // Tri par nombre d'avis (du plus grand au plus petit)
      sorted.sort((a, b) => {
        const aReviews = Number(a.totalReviews) || 0;
        const bReviews = Number(b.totalReviews) || 0;
        return bReviews - aReviews;
      });
    }

    // Debug: voir le tri
    console.log(`Tri appliqué: ${sortBy}`, sorted.slice(0, 3).map(p => ({ 
      name: p.name, 
      totalReviews: p.totalReviews,
      sentimentScore: p.sentimentScore,
      price: p.price 
    })));

    return sorted;
  }, [products, selectedCategory, sortBy, maxLength]);

  // Fonctions de pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    load(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez les Produits les Plus Appréciés
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Guidés par l'intelligence artificielle et les avis authentiques de notre communauté
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Explorer maintenant
            </button>
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
              Voir les tendances
            </button>
          </div>
        </div>
      </section>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{products.length}+</div>
          <div className="text-sm text-gray-600 mt-1">Produits</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">1000+</div>
          <div className="text-sm text-gray-600 mt-1">Avis</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">98%</div>
          <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">24h</div>
          <div className="text-sm text-gray-600 mt-1">Livraison</div>
        </div>
      </div>

      {/* Catégories */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Catégories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-tag whitespace-nowrap ${
                selectedCategory === cat.id ? "from-purple-500/60 to-pink-500/60 ring-2 ring-purple-400" : ""
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>
       
      {/* Recommandations personnalisées */}
      {initialLoadComplete && products.length > 0 && (
        <PersonalizedRecommendations
          userId={currentUser?.uid}
          userEmail={currentUser?.email}
          navigate={navigate}
        />
      )}

      {/* Filtres et tri */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Catalogue 
          <span className="text-lg text-gray-500 ml-2">({filteredProducts.length} produits)</span>
        </h2>
        
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Plus populaires</option>
            <option value="most-reviews">Plus d'avis</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Grille de produits */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} onOpen={() => navigate(`/product/${p._id}`)} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>
      )}

      {/* Message si aucun produit */}
      {!loading && filteredProducts.length === 0 && initialLoadComplete && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p className="text-gray-600">Essayez de changer les filtres ou la catégorie</p>
        </div>
      )}
    </div>
  );
}