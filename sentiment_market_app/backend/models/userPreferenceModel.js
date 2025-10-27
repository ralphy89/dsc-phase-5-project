import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    // ID de l'utilisateur (Firebase UID)
    userId: { type: String, required: true, unique: true },
    
    // Email de l'utilisateur
    userEmail: { type: String, required: true },
    
    // Produits aimés (basés sur les commentaires positifs)
    likedProducts: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productCsvId: { type: String, required: true },
      productName: { type: String, required: true },
      brand: { type: String, default: "" },
      categories: { type: [String], default: [] },
      likedAt: { type: Date, default: Date.now },
      reviewText: { type: String, required: true },
      sentiment: { type: String, enum: ["Positive"], required: true },
      confidence: { type: Number, required: true }
    }],
    
    // Recommandations actuelles (générées par le modèle hybride)
    currentRecommendations: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      productCsvId: { type: String, required: true },
      productName: { type: String, required: true },
      brand: { type: String, default: "" },
      categories: { type: [String], default: [] },
      score: { type: Number, required: true },
      reason: { type: String, required: true }, // "similar_to_liked", "popular", "category_match"
      recommendedAt: { type: Date, default: Date.now }
    }],
    
    // Métadonnées
    totalPositiveReviews: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Index pour recherche rapide
userPreferenceSchema.index({ userId: 1 });
userPreferenceSchema.index({ userEmail: 1 });
userPreferenceSchema.index({ "likedProducts.productId": 1 });

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);
export default UserPreference;
