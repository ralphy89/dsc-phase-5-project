import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";

export const getProducts = async (req, res) => {
  try {
    // Paramètres de pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    
    // Nouveau: Paramètre de tri
    const sortBy = req.query.sort || 'popular'; // 'popular' par défaut
    
    let sortOptions = { sentimentScore: -1, averageRating: -1 }; // Tri par défaut (popular)

    if (sortBy === 'most-reviews') {
      sortOptions = { totalReviews: -1 }; // Tri par totalReviews décroissant
    } else if (sortBy === 'price-low') {
        sortOptions = { price: 1 };
    } else if (sortBy === 'price-high') {
        sortOptions = { price: -1 };
    }
    
    // Calculer le nombre total de produits
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);


    // Récupérer les produits avec pagination
    const products = await Product.find({})
      .sort(sortOptions)
      .sort({ sentimentScore: -1, averageRating: -1 })
      .skip(skip)
      .limit(limit);

    // Pour chaque produit, récupérer les 3 derniers reviews
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const recentReviews = await Review.find({ productCsvId: product.productId })
          .sort({ reviewDate: -1 })
          .limit(3)
          .select('username text title rating reviewDate sentiment');
  
        return {
          ...product.toObject(),
          recentReviews
        };
      })
    );
    
    // Réponse avec métadonnées de pagination
    res.json({
      products: productsWithReviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ sentimentScore: -1, averageRating: -1 })
      .limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    // Récupérer TOUS les vrais avis liés au produit par productCsvId
    const reviews = await Review.find({ productCsvId: product.productId })
      .sort({ reviewDate: -1 })
      .select('username userCity reviewDate rating title text sentiment didPurchase doRecommend');
    
    
    // Afficher les avis dans la console pour test
    // if (reviews.length > 0) {
    //   console.log(`\n📝 AVIS RÉCUPÉRÉS:`);
    //   reviews.forEach((review, index) => {
    //     console.log(`   ${index + 1}. ${review.username} (${review.userCity || 'N/A'})`);
    //     console.log(`      - Note: ${review.rating}/5`);
    //     console.log(`      - Sentiment: ${review.sentiment}`);
    //     console.log(`      - Texte: ${review.text?.substring(0, 80)}...`);
    //     console.log('');
    //   });
    // } else {
    //   console.log(`❌ Aucun avis trouvé pour ${product.name}`);
    // }
    
    // Ajouter les vrais avis au produit
    const productWithReviews = {
      ...product.toObject(),
      reviews: reviews
    };
    
    res.json(productWithReviews);
  } catch (err) {
    console.error("Erreur dans getProductById:", err);
    res.status(500).json({ error: err.message });
  }
};

