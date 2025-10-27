// Configuration MongoDB pour connexion Atlas
const MONGODB_CONFIG = {
  // URL de connexion MongoDB Atlas
  REMOTE_URI: "mongodb+srv://sentiment_db_user:<db_password>@sentimentmarket.qbf7zif.mongodb.net/sentiment_market?retryWrites=true&w=majority",
  
  // URL locale (fallback)
  LOCAL_URI: "mongodb://localhost:27017/sentiment_market",

  // Options de connexion
  OPTIONS: {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  }
};

export default MONGODB_CONFIG;
