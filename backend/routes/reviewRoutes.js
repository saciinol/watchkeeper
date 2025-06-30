import express from "express";
import { upsertReview, getMovieReviews, deleteReview } from "../controllers/reviewControllers.js";

const router = express.Router();

router.post("/", upsertReview);
router.get("/:movieId", getMovieReviews);
router.delete("/:reviewId", deleteReview);

export default router;
