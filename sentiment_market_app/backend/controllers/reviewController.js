import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import { analyzeSentiment } from "../utils/sentimentService.js";
import mongoose from "mongoose";
import RecommendationService from "../services/recommendationService.js";

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Vérifier que le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log(`Recherche d'avis pour le produit: ${product.name}`);
    console.log(`ProductId (MongoDB): ${product._id}`);
    console.log(`ProductCsvId: ${product.productId}`);
    
    // Récupérer tous les avis liés à ce produit par productCsvId
    const reviews = await Review.find({ productCsvId: product.productId })
      .sort({ reviewDate: -1 })
      .select('username userEmail userCity reviewDate rating title text sentiment didPurchase doRecommend');
    
    console.log(`Trouvé ${reviews.length} avis pour ${product.name}`);
    
    res.json(reviews);
  } catch (err) {
    console.error("Erreur dans getReviewsByProduct:", err);
    res.status(500).json({ error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { userId, productId, text, userEmail, userDisplayName } = req.body;
    if (!productId || !text) {
      return res.status(400).json({ error: "productId and text are required" });
    }

    // Validate target product and derive CSV id
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productCsvId = product.productId || "";

    // Optional fields
    const ratingRaw = req.body.rating;
    let rating = Number(ratingRaw);
    if (!Number.isFinite(rating)) rating = 5;
    rating = Math.min(5, Math.max(1, rating));

    const userIdValue = (userId && mongoose.Types.ObjectId.isValid(userId)) ? userId : undefined;

    // Sentiment from ML service with product information
    const productInfo = {
      brand: product.brand || "",
      categories: Array.isArray(product.categories) ? product.categories.join(", ") : product.categories || "",
      title: product.name || ""
    };
    
    const result = await analyzeSentiment(text, productInfo);
    const s = (result?.sentiment || "neutral").toString().toLowerCase();
    const sentiment = s.charAt(0).toUpperCase() + s.slice(1); // match schema enum [Positive, Negative, Neutral]
    const confidence = Number(result?.confidence) || 0;

    // Determine username for display
    const username = userDisplayName || userEmail || "Anonyme";

    const review = await Review.create({
      userId: userIdValue,
      productId,
      productCsvId,
      text,
      rating,
      sentiment,
      confidence,
      username,
      userEmail: userEmail || null,
    });

    // Mettre à jour le nombre total de reviews sans changer le sentimentScore
    // pour éviter que le produit change de position dans la liste
    const totalReviews = await Review.countDocuments({ productId });
    
    // Calculer la nouvelle note moyenne
    const reviews = await Review.find({ productId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Product.findByIdAndUpdate(productId, { 
      totalReviews,
      averageRating: parseFloat(avgRating.toFixed(2))
      // sentimentScore reste inchangé pour éviter le changement de position
    });

    // Mettre à jour les préférences utilisateur si le commentaire est positif
    if (userId && userEmail && sentiment === "Positive" && confidence >= 0.5) {
      try {
        await RecommendationService.updateUserPreferences(
          userId,
          userEmail,
          productId,
          productCsvId,
          product.name,
          product.brand,
          product.categories,
          text,
          sentiment,
          confidence
        );
        console.log(`✅ Préférences mises à jour pour l'utilisateur ${userEmail}`);
      } catch (prefError) {
        console.error("Erreur lors de la mise à jour des préférences:", prefError);
        // Ne pas faire échouer la création de l'avis si les préférences échouent
      }
    } else {
      console.log(`❌ Conditions non remplies pour les préférences: userId=${!!userId}, userEmail=${!!userEmail}, sentiment=${sentiment}, confidence=${confidence}`);
    }

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les avis d'un utilisateur par email
export const getReviewsByUser = async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    if (!userEmail) {
      return res.status(400).json({ error: "Email utilisateur requis" });
    }

    console.log(`Recherche d'avis pour l'utilisateur: ${userEmail}`);
    
    // Récupérer tous les avis de cet utilisateur
    const reviews = await Review.find({ userEmail })
      .sort({ reviewDate: -1 })
      .select('productId productCsvId rating title text sentiment reviewDate userEmail username');
    
    console.log(`Trouvé ${reviews.length} avis pour ${userEmail}`);
    
    res.json(reviews);
  } catch (err) {
    console.error("Erreur dans getReviewsByUser:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fonction optionnelle pour recalculer les sentimentScore en batch
// (à appeler périodiquement ou manuellement si nécessaire)
export const recalculateSentimentScores = async (req, res) => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      const reviews = await Review.find({ productCsvId: product.productId });
      
      if (reviews.length > 0) {
        const positiveCount = reviews.filter(r => r.sentiment === "Positive").length;
        const negativeCount = reviews.filter(r => r.sentiment === "Negative").length;
        const totalSentiments = reviews.length;
        
        // Nouveau calcul de sentimentScore basé sur le ratio positif/négatif
        const sentimentScore = Math.round(((positiveCount - negativeCount) / totalSentiments) * 50 + 50);
        
        await Product.findByIdAndUpdate(product._id, {
          sentimentScore: Math.max(0, Math.min(100, sentimentScore)),
          positiveCount,
          negativeCount,
          neutralCount: totalSentiments - positiveCount - negativeCount
        });
        
        updatedCount++;
      }
    }

    res.json({ 
      message: `Sentiment scores recalculated for ${updatedCount} products`,
      updatedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

