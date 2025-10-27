import mongoose from "mongoose";
import MONGODB_CONFIG from "./mongodb.js";

const connectDB = async () => {
  // Utiliser l'URL distante ou locale selon la variable d'environnement
  const uri = 'localhost:27017/sentiment_market' || process.env.MONGO_URI || MONGODB_CONFIG.REMOTE_URI;
  
  console.log(`Tentative de connexion à MongoDB: ${uri}`);
  
  try {
    await mongoose.connect(uri, MONGODB_CONFIG.OPTIONS);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    
    // Essayer la connexion locale en fallback
    if (uri !== MONGODB_CONFIG.LOCAL_URI) {
      console.log("🔄 Tentative de connexion locale en fallback...");
      try {
        await mongoose.connect(MONGODB_CONFIG.LOCAL_URI, MONGODB_CONFIG.OPTIONS);
        console.log("✅ MongoDB connected locally");
        console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`);
      } catch (localErr) {
        console.error("❌ Échec de la connexion locale:", localErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;

