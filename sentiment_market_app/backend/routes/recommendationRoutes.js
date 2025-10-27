import express from "express";
import {
  getUserRecommendations,
  getUserPreferences,
  refreshUserRecommendations,
  getRecommendationStats
} from "../controllers/recommendationController.js";

const router = express.Router();

// Routes pour les recommandations
router.get("/user/:userId", getUserRecommendations);
router.get("/user/:userId/preferences", getUserPreferences);
router.post("/user/:userId/refresh", refreshUserRecommendations);
router.get("/stats", getRecommendationStats);

export default router;