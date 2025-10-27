import RecommendationService from "../services/recommendationService.js";
import UserPreference from "../models/userPreferenceModel.js";

/**
 * Obtient les recommandations personnalisées pour un utilisateur
 */
export const getUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID requis" });
    }

    const recommendations = await RecommendationService.getUserRecommendations(userId);
    
    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
    
  } catch (error) {
    console.error("Erreur dans getUserRecommendations:", error);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des recommandations",
      details: error.message 
    });
  }
};

/**
 * Obtient les préférences utilisateur
 */
export const getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID requis" });
    }

    const userPrefs = await UserPreference.findOne({ userId });
    
    if (!userPrefs) {
      return res.json({
        success: true,
        preferences: null,
        message: "Aucune préférence trouvée pour cet utilisateur"
      });
    }

    res.json({
      success: true,
      preferences: {
        userId: userPrefs.userId,
        userEmail: userPrefs.userEmail,
        totalPositiveReviews: userPrefs.totalPositiveReviews,
        likedProducts: userPrefs.likedProducts,
        lastActivity: userPrefs.lastActivity
      }
    });
    
  } catch (error) {
    console.error("Erreur dans getUserPreferences:", error);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des préférences",
      details: error.message 
    });
  }
};

/**
 * Force la mise à jour des recommandations pour un utilisateur
 */
export const refreshUserRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID requis" });
    }

    const result = await RecommendationService.refreshUserRecommendations(userId);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        recommendations: result.recommendations
      });
    } else {
      res.status(404).json({ 
        error: result.message 
      });
    }
    
  } catch (error) {
    console.error("Erreur dans refreshUserRecommendations:", error);
    res.status(500).json({ 
      error: "Erreur lors de l'actualisation des recommandations",
      details: error.message 
    });
  }
};

/**
 * Obtient les statistiques des recommandations
 */
export const getRecommendationStats = async (req, res) => {
  try {
    const stats = await UserPreference.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalPositiveReviews: { $sum: "$totalPositiveReviews" },
          avgPositiveReviews: { $avg: "$totalPositiveReviews" },
          usersWithRecommendations: {
            $sum: {
              $cond: [{ $gt: [{ $size: "$currentRecommendations" }, 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalUsers: 0,
        totalPositiveReviews: 0,
        avgPositiveReviews: 0,
        usersWithRecommendations: 0
      }
    });
    
  } catch (error) {
    console.error("Erreur dans getRecommendationStats:", error);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des statistiques",
      details: error.message 
    });
  }
};
