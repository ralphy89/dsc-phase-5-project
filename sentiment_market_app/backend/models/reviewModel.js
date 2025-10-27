import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Référence au produit (MongoDB ObjectId)
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    
    // ID du produit depuis le CSV
    productCsvId: { type: String, required: true },
    
    // Informations utilisateur (optionnel pour les reviews du CSV)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, default: "Anonyme" },
    userEmail: { type: String, default: null },
    userCity: { type: String, default: "" },
    userProvince: { type: String, default: "" },
    
    // Contenu de la review
    title: { type: String, default: "" },
    text: { type: String, required: true },
    
    // Rating (1-5 étoiles)
    rating: { type: Number, required: true, min: 1, max: 5 },
    
    // Sentiment analysé par IA
    sentiment: { type: String, enum: ["Positive", "Negative", "Neutral"], default: "Neutral" },
    confidence: { type: Number, default: 0, min: 0, max: 1 },
    
    // Métadonnées d'achat
    didPurchase: { type: Boolean, default: false },
    doRecommend: { type: Boolean, default: null },
    
    // Date de la review
    reviewDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index pour recherche rapide
reviewSchema.index({ productId: 1 });
reviewSchema.index({ productCsvId: 1 });
reviewSchema.index({ sentiment: 1 });
reviewSchema.index({ rating: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;

