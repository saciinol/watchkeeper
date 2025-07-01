import express from "express";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import { upsertReview, getMovieReviews, deleteReview, getUserReviews } from "../controllers/reviewControllers.js";

const router = express.Router();

router.post("/", authenticateToken, upsertReview);
router.get("/:movieId", optionalAuth, getMovieReviews);
router.get("/user/:userId", authenticateToken, getUserReviews);
router.delete("/:reviewId", authenticateToken, deleteReview);

export default router;
