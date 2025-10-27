import express from "express";
import { addReview, getReviewsByProduct, getReviewsByUser, recalculateSentimentScores } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/product/:productId", getReviewsByProduct);
router.get("/user/:userEmail", getReviewsByUser);
router.post("/", addReview);
router.post("/recalculate-scores", recalculateSentimentScores); // Route optionnelle pour recalculer les scores

export default router;

