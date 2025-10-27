import UserPreference from "../models/userPreferenceModel.js";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import axios from "axios";
import os from "os";

class RecommendationService {
  
  /**
   * Met à jour les préférences utilisateur après un commentaire positif
   */
  static async updateUserPreferences(userId, userEmail, productId, productCsvId, productName, brand, categories, reviewText, sentiment, confidence) {
    try {
      if (sentiment !== "Positive" || confidence < 0.5) {
        return; // Seulement pour les commentaires positifs avec haute confiance
      }

      // Trouver ou créer les préférences utilisateur
      let userPrefs = await UserPreference.findOne({ userId });
      
      if (!userPrefs) {
        userPrefs = await UserPreference.create({
          userId,
          userEmail,
          likedProducts: [],
          currentRecommendations: [],
          totalPositiveReviews: 0
        });
      }

      // Ajouter le produit aimé
      const likedProduct = {
        productId,
        productCsvId,
        productName,
        brand: brand || "",
        categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
        reviewText,
        sentiment,
        confidence
      };

      // Vérifier si le produit n'est pas déjà dans les préférences
      const existingProduct = userPrefs.likedProducts.find(
        p => p.productCsvId === productCsvId
      );

      if (existingProduct) {
        return;
      }

      if (!existingProduct) {
        userPrefs.likedProducts.push(likedProduct);
        userPrefs.totalPositiveReviews += 1;
        userPrefs.lastActivity = new Date();

        // Générer de nouvelles recommandations en utilisant le modèle hybride
        await this.generatePersonalizedRecommendations(userPrefs);

        await userPrefs.save();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
    }
  }

  /**
   * Génère des recommandations personnalisées en utilisant le modèle hybride existant
   */
  static async generatePersonalizedRecommendations(userPrefs) {
    try {
      const recommendations = [];
      
      // Pour chaque produit aimé, obtenir des recommandations similaires
      for (const likedProduct of userPrefs.likedProducts) {
        try {
          // Utiliser l'API ML existante pour obtenir des recommandations
          // Détecter automatiquement l'URL du service ML
          const hostname = os.hostname();
          const mlServiceUrl = hostname === 'localhost' || hostname === '127.0.0.1' 
            ? 'http://localhost:8001' 
            : `http://${hostname}:8001`;
          
          const response = await axios.get(
            `${mlServiceUrl}/recommend/${likedProduct.productCsvId}?top_n=10&alpha=0.7`
          );
          
          if (response.data && response.data.recommendations) {
            for (const rec of response.data.recommendations) {
              // Vérifier que le produit recommandé existe dans notre base
              const product = await Product.findOne({ productId: rec.id });
              if (product) {
                recommendations.push({
                  productId: product._id,
                  productCsvId: rec.id,
                  productName: product.name,
                  brand: product.brand,
                  categories: product.categories,
                  score: rec.hybrid_score || rec.similarity || 0.5,
                  reason: "similar_to_liked",
                  recommendedAt: new Date(),
                  // Ajouter toutes les informations du produit pour l'affichage
                  name: product.name,
                  price: product.price,
                  image: product.imageUrl,
                  description: product.description,
                  averageRating: product.averageRating,
                  totalReviews: product.totalReviews,
                  availability: product.availability,
                  features: product.features
                });
              }
            }
          }
        } catch (apiError) {
          console.error(`Erreur API pour le produit ${likedProduct.productCsvId}:`, apiError.message);
          // Continuer avec les autres produits
        }
      }

      // Éliminer les doublons et les produits déjà aimés
      const uniqueRecommendations = this.deduplicateRecommendations(recommendations, userPrefs.likedProducts);
      
      // Trier par score et prendre les 10 meilleures
      const topRecommendations = uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      // Mettre à jour les recommandations actuelles
      userPrefs.currentRecommendations = topRecommendations;
      
    } catch (error) {
      console.error("Erreur lors de la génération des recommandations:", error);
    }
  }

  /**
   * Élimine les doublons et les produits déjà aimés
   */
  static deduplicateRecommendations(recommendations, likedProducts) {
    const likedProductIds = new Set(likedProducts.map(p => p.productCsvId));
    
    const seen = new Set();
    return recommendations.filter(rec => {
      const key = rec.productCsvId;
      if (seen.has(key) || likedProductIds.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Obtient les recommandations pour un utilisateur
   */
  static async getUserRecommendations(userId) {
    try {
      const userPrefs = await UserPreference.findOne({ userId });
      
      if (!userPrefs) {
        return await this.getTopRatedProducts();
      }
      
      if (userPrefs.currentRecommendations.length === 0) {
        return await this.getTopRatedProducts();
      }
      
      // Enrichir les recommandations avec les informations complètes du produit
      const enrichedRecommendations = [];
      for (const rec of userPrefs.currentRecommendations) {
        const product = await Product.findOne({ productId: rec.productCsvId });
        if (product) {
          enrichedRecommendations.push({
            ...rec.toObject(),
            name: product.name,
            price: product.price,
            image: product.imageUrl,
            description: product.description,
            averageRating: product.averageRating,
            totalReviews: product.totalReviews,
            availability: product.availability,
            features: product.features
          });
        } else {
          // Si le produit n'existe pas, retourner quand même la recommandation de base
          enrichedRecommendations.push(rec.toObject());
        }
      }
      
      return enrichedRecommendations;
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations:", error);
      return await this.getTopRatedProducts();
    }
  }

  /**
   * Obtient les produits les mieux notés
   */
  static async getTopRatedProducts() {
    try {
      const products = await Product.find({
        averageRating: { $gte: 4.0 },
        totalReviews: { $gte: 5 }
      })
      .sort({ averageRating: -1, totalReviews: -1 })
      .limit(10);
      
      return products.map(p => ({
        productId: p._id,
        productCsvId: p.productId,
        productName: p.name,
        brand: p.brand,
        categories: p.categories,
        score: p.averageRating,
        reason: "popular",
        recommendedAt: new Date(),
        // Ajouter toutes les informations du produit pour l'affichage
        name: p.name,
        price: p.price,
        image: p.imageUrl,
        description: p.description,
        averageRating: p.averageRating,
        totalReviews: p.totalReviews,
        availability: p.availability,
        features: p.features
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des produits populaires:", error);
      return [];
    }
  }

  /**
   * Force la mise à jour des recommandations pour un utilisateur
   */
  static async refreshUserRecommendations(userId) {
    try {
      const userPrefs = await UserPreference.findOne({ userId });
      
      if (!userPrefs) {
        return { success: false, message: "Aucune préférence trouvée" };
      }

      // Régénérer les recommandations
      await this.generatePersonalizedRecommendations(userPrefs);
      await userPrefs.save();

      return { 
        success: true, 
        message: "Recommandations actualisées",
        recommendations: userPrefs.currentRecommendations
      };
    } catch (error) {
      console.error("Erreur lors de l'actualisation des recommandations:", error);
      return { success: false, message: error.message };
    }
  }
}

export default RecommendationService;
