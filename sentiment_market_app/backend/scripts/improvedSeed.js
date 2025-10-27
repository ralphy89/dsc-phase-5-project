import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/sentimentShop";
const csvPath = path.join(process.cwd(), "..", "data", "sample30.csv");

async function connect() {
  await mongoose.connect(mongoUri, { autoIndex: true });
}

async function improvedSeed() {
  await connect();
  console.log("Connected to MongoDB");
  
  // Nettoyer les collections existantes
  await Product.deleteMany({});
  await Review.deleteMany({});
  console.log("Collections nettoyées");

  const productMap = new Map(); // Pour grouper les produits par ID
  const reviews = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        const productId = row.id;
        
        if (!productId) return; // Ignorer les lignes sans ID

        // Si c'est un nouveau produit, l'initialiser
        if (!productMap.has(productId)) {
          const price = Math.max(5, Math.min(500, Math.floor((Number(row.reviews_rating) || 3) * 20)));
          
          productMap.set(productId, {
            _id: new mongoose.Types.ObjectId(),
            productId: productId,
            name: row.name || "Unnamed Product",
            brand: row.brand || "",
            manufacturer: row.manufacturer || "",
            categories: row.categories ? row.categories.split(",").map(c => c.trim()) : ["general"],
            price: price,
            imageUrl: `https://picsum.photos/seed/${encodeURIComponent(productId)}/400/300`,
            description: "", // Sera rempli avec le premier review_text
            sentimentScore: 0,
            averageRating: 0,
            totalReviews: 0,
            ratings: [],
            sentiments: []
          });
        }

        // Ajouter les données de review
        const product = productMap.get(productId);
        
        if (row.reviews_text && row.reviews_text.trim()) {
          if (!product.description) {
            product.description = row.reviews_text.substring(0, 200) + "...";
          }
          
          // Ajouter le rating
          const rating = Number(row.reviews_rating);
          if (!isNaN(rating) && rating > 0) {
            product.ratings.push(rating);
          }
          
          // Ajouter le sentiment
          const sentiment = row.user_sentiment?.toLowerCase();
          if (sentiment === "positive" || sentiment === "negative") {
            product.sentiments.push(sentiment);
          }
          
          // Créer un review séparé
          if (row.reviews_text && row.reviews_text.trim()) {
            reviews.push({
              _id: new mongoose.Types.ObjectId(),
              productId: product._id,
              originalProductId: productId,
              userId: row.reviews_username || "anonymous",
              rating: rating || 0,
              reviewText: row.reviews_text,
              reviewTitle: row.reviews_title || "",
              reviewDate: new Date(row.reviews_date || Date.now()),
              userCity: row.reviews_userCity || "",
              userProvince: row.reviews_userProvince || "",
              didPurchase: row.reviews_didPurchase === "TRUE",
              doRecommend: row.reviews_doRecommend === "TRUE",
              userSentiment: sentiment || "neutral"
            });
          }
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  console.log(`Traitement de ${productMap.size} produits uniques avec ${reviews.length} reviews`);

  // Calculer les statistiques pour chaque produit
  for (const [productId, product] of productMap) {
    if (product.ratings.length > 0) {
      product.averageRating = product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length;
    }
    
    if (product.sentiments.length > 0) {
      const positiveCount = product.sentiments.filter(s => s === "positive").length;
      const totalSentiments = product.sentiments.length;
      product.sentimentScore = Math.round((positiveCount / totalSentiments) * 100);
    }
    
    product.totalReviews = product.ratings.length;
    
    // Nettoyer les arrays temporaires
    delete product.ratings;
    delete product.sentiments;
  }

  // Insérer les produits
  const products = Array.from(productMap.values());
  await Product.insertMany(products);
  console.log(`✅ ${products.length} produits insérés`);

  // Insérer les reviews
  if (reviews.length > 0) {
    await Review.insertMany(reviews);
    console.log(`✅ ${reviews.length} reviews insérées`);
  }

  console.log("🎉 Seed terminé avec succès !");
  console.log(`📊 Statistiques:`);
  console.log(`   - Produits uniques: ${products.length}`);
  console.log(`   - Reviews totales: ${reviews.length}`);
  console.log(`   - Moyenne reviews par produit: ${(reviews.length / products.length).toFixed(1)}`);
  
  await mongoose.disconnect();
}

improvedSeed().catch((e) => {
  console.error("❌ Erreur lors du seed:", e);
  process.exit(1);
});
