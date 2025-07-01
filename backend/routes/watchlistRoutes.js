import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { upsertWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistControllers.js";

const router = express.Router();

router.post("/", authenticateToken, upsertWatchlist);
router.get("/:userId", authenticateToken, getWatchlist);
router.delete("/:userId/:movieId", authenticateToken, removeFromWatchlist);

export default router;
