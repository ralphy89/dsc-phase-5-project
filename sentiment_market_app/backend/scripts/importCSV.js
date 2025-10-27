import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import csv from 'csv-parser';

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentiment_market';

// Schémas Mongoose (définis ici pour éviter les problèmes d'import)
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  manufacturer: { type: String, default: "" },
  categories: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  sentimentScore: { type: Number, default: 0 },
  positiveCount: { type: Number, default: 0 },
  negativeCount: { type: Number, default: 0 },
  neutralCount: { type: Number, default: 0 },
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productCsvId: { type: String, required: true, index: true },
  userId: String,
  username: { type: String, default: "Anonyme" },
  userCity: { type: String, default: "" },
  userProvince: { type: String, default: "" },
  title: { type: String, default: "" },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  sentiment: { type: String, enum: ["Positive", "Negative", "Neutral"], default: "Neutral" },
  confidence: { type: Number, default: 0, min: 0, max: 1 },
  didPurchase: { type: Boolean, default: false },
  doRecommend: { type: Boolean, default: null },
  reviewDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Créer les modèles
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

// Fonctions utilitaires
const generatePrice = () => Math.floor(Math.random() * (10000 - 500 + 1)) + 500;

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Fichier CSV introuvable: ${filePath}`));
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const groupReviewsByProduct = (csvData) => {
  const productsMap = new Map();
  
  csvData.forEach((row) => {
    const productId = row.id?.trim();
    if (!productId) return;
    
    if (!productsMap.has(productId)) {
      productsMap.set(productId, {
        productId,
        name: row.name || 'Produit sans nom',
        brand: row.brand || '',
        manufacturer: row.manufacturer || '',
        categories: row.categories ? row.categories.split(',').map(c => c.trim()) : [],
        price: generatePrice(),
        // imageUrl: getImageUrl(row.categories || ''),
        imageUrl: row.image,
        description: row.reviews_text?.substring(0, 200) || 'Description non disponible',
        reviews: []
      });
    }
    
    // Ajouter la review si elle a du contenu
    if (row.reviews_text && row.reviews_text.trim()) {
      const rating = parseInt(row.reviews_rating) || 3;
      const rawSentiment = (row.user_sentiment || 'neutral').toLowerCase();
      const sentiment = rawSentiment === 'positive' ? 'Positive' : 
                        rawSentiment === 'negative' ? 'Negative' : 'Neutral';
      
      productsMap.get(productId).reviews.push({
        productCsvId: productId,
        username: row.reviews_username || 'Anonyme',
        userId: row.reviews_username || 'anonymous',
        userCity: row.reviews_userCity || '',
        userProvince: row.reviews_userProvince || '',
        title: row.reviews_title || '',
        text: row.reviews_text,
        rating,
        sentiment,
        confidence: 0.85,
        didPurchase: row.reviews_didPurchase === 'TRUE',
        doRecommend: row.reviews_doRecommend === 'TRUE' ? true : 
                     row.reviews_doRecommend === 'FALSE' ? false : null,
        reviewDate: row.reviews_date ? new Date(row.reviews_date) : new Date()
      });
    }
  });
  
  return Array.from(productsMap.values());
};

const calculateMetrics = (reviews) => {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      sentimentScore: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0
    };
  }
  
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const positiveCount = reviews.filter(r => r.sentiment === 'Positive').length;
  const negativeCount = reviews.filter(r => r.sentiment === 'Negative').length;
  const neutralCount = reviews.filter(r => r.sentiment === 'Neutral').length;
  
  const sentimentScore = ((positiveCount - negativeCount) / reviews.length) * 50 + 50;
  
  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalReviews: reviews.length,
    sentimentScore: Math.max(0, Math.min(100, parseFloat(sentimentScore.toFixed(2)))),
    positiveCount,
    negativeCount,
    neutralCount
  };
};

const importData = async () => {
  try {
    console.log('🚀 Démarrage de l\'import des données CSV...\n');
    
    // Connexion à MongoDB
    console.log('📊 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');
    
    // Nettoyage
    console.log('🧹 Nettoyage de la base de données...');
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Base de données nettoyée\n');
    
    // Lecture du CSV - Chemin corrigé pour ml_service/data
    // Essayer plusieurs emplacements possibles
    const possiblePaths = [
      path.resolve(__dirname, '..', '..', 'ml_service', 'data', 'sample30-2.csv'),
      path.resolve(__dirname, '..', '..', 'data', 'sample30-2.csv'),
      path.resolve(__dirname, '..', 'data', 'sample30-2.csv'),
    ];
    
    let csvPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        csvPath = testPath;
        break;
      }
    }
    
    if (!csvPath) {
      console.error('\n❌ Fichier CSV introuvable aux emplacements suivants:');
      possiblePaths.forEach(p => console.error(`   - ${p}`));
      console.error('\n💡 Vérifiez que le fichier sample30.csv existe dans un de ces dossiers.\n');
      throw new Error('Fichier CSV introuvable');
    }
    
    console.log('📖 Lecture du fichier CSV:', csvPath);
    const csvData = await readCSV(csvPath);
    console.log(`✅ ${csvData.length} lignes lues\n`);
    
    // Groupement
    console.log('🔄 Groupement des reviews par produit...');
    const products = groupReviewsByProduct(csvData);
    console.log(`✅ ${products.length} produits uniques trouvés\n`);
    
    // Import (limité à 100 produits)
    const productsToImport = products.slice(0, 100);
    console.log(`📦 Import de ${productsToImport.length} produits...\n`);
    
    let importedProducts = 0;
    let importedReviews = 0;
    
    for (const productData of productsToImport) {
      try {
        // Calculer les métriques
        const metrics = calculateMetrics(productData.reviews);
        
        // Créer le produit
        const product = await Product.create({
          productId: productData.productId,
          name: productData.name,
          brand: productData.brand,
          manufacturer: productData.manufacturer,
          categories: productData.categories,
          price: productData.price,
          imageUrl: productData.imageUrl,
          description: productData.description,
          ...metrics
        });
        
        importedProducts++;
        
        // Créer les reviews
        for (const reviewData of productData.reviews) {
          await Review.create({
            ...reviewData,
            productId: product._id
          });
          importedReviews++;
        }
        
        if (importedProducts % 10 === 0) {
          console.log(`   ⏳ ${importedProducts}/${productsToImport.length} produits importés...`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur import produit ${productData.name}:`, error.message);
      }
    }
    
    console.log('\n✨ Import terminé avec succès !');
    console.log(`📦 ${importedProducts} produits importés`);
    console.log(`💬 ${importedReviews} reviews importées`);
    console.log(`📊 Moyenne: ${(importedReviews / importedProducts).toFixed(1)} reviews par produit\n`);
    
    // Vérification (sans populate)
    console.log('🔍 Vérification des données...');
    const sampleProduct = await Product.findOne();
    if (sampleProduct) {
      console.log(`✅ Produit test: ${sampleProduct.name}`);
      const reviewCount = await Review.countDocuments({ productCsvId: sampleProduct.productId });
      console.log(`✅ Avis trouvés pour ce produit: ${reviewCount}`);
      
      // Afficher un exemple d'avis
      const sampleReview = await Review.findOne({ productCsvId: sampleProduct.productId });
      if (sampleReview) {
        console.log(`✅ Exemple d'avis:`);
        console.log(`   - Auteur: ${sampleReview.username}`);
        console.log(`   - Note: ${sampleReview.rating}/5`);
        console.log(`   - Texte: ${sampleReview.text.substring(0, 80)}...`);
      }
    }
    console.log('\n🎉 Tout est prêt ! Vous pouvez maintenant démarrer votre application.\n');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Connexion MongoDB fermée');
  }
};

// Exécution
importData();