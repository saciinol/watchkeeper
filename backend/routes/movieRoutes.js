import express from "express";
import { searchTMDB, saveMovie, getMovies, getMovieById } from "../controllers/movieControllers.js";

const router = express.Router();

router.get("/search", searchTMDB);
router.post("/", saveMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);

export default router;
