import express from "express";
import { upsertReview, getMovieReviews, deleteReview, getUserReviews } from "../controllers/reviewControllers.js";

const router = express.Router();

router.post("/", upsertReview);
router.get("/:movieId", getMovieReviews);
router.get("/user/:userId", getUserReviews);
router.delete("/:reviewId", deleteReview);

export default router;
