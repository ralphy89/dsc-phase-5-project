import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Identifiant du produit depuis le CSV
    productId: { type: String, required: true, unique: true },
    
    // Informations de base
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    
    // Catégories (array pour gérer plusieurs catégories)
    categories: { type: [String], default: [] },
    
    // Prix et image
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    
    // Métriques calculées
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 }, // Score 0-100
    
    // Statistiques des sentiments
    positiveCount: { type: Number, default: 0 },
    negativeCount: { type: Number, default: 0 },
    neutralCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index pour recherche rapide
// Note: productId a déjà un index via unique: true
productSchema.index({ brand: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ sentimentScore: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;

