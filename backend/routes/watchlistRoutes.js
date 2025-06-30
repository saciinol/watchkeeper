import express from "express";
import { upsertWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistControllers.js";

const router = express.Router();

router.post("/", upsertWatchlist);
router.get("/:userId", getWatchlist);
router.delete("/:userId/:movieId", removeFromWatchlist);

export default router;
