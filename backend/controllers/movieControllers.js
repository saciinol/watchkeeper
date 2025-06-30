import axios from "axios";
import { sql } from "../config/db.js";

export const searchTMDB = async (req, res) => {
	const query = req.query.q;

	if (!query || query.trim() === "") {
		return res.status(400).json({
			success: false,
			message: "Search query is required",
		});
	}

	try {
		const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
			params: {
				api_key: process.env.TMDB_API_KEY,
				query,
			},
		});

		const results = response.data.results.map((movie) => ({
			tmdb_id: movie.id,
			title: movie.title,
			year: movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null,
			poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
			plot: movie.overview,
		}));

		console.log(`TMDB search for "${query}" returned ${results.length} results.`);

		res.status(200).json({
			success: true,
			data: results,
		});
	} catch (error) {
		console.error("TMDB search error:", error.message);

		res.status(500).json({
			success: false,
			message: "TMDB search failed",
			...(process.env.NODE_ENV === "development" && { error: error.message }),
		});
	}
};

export const saveMovie = async (req, res) => {
	const { tmdb_id, title, year, poster_url, plot } = req.body;

	try {
		const inserted = await sql`
      INSERT INTO movies (tmdb_id, title, year, poster_url, plot)
      VALUES (${tmdb_id}, ${title}, ${year}, ${poster_url}, ${plot})
      ON CONFLICT (tmdb_id) DO NOTHING
      RETURNING *;
    `;

		const movie = inserted.length > 0 ? inserted[0] : (await sql`SELECT * FROM movies WHERE tmdb_id = ${tmdb_id}`)[0];

		console.log("Saved movie:", movie);

		res.status(inserted.length > 0 ? 201 : 200).json({
			success: true,
			data: movie,
		});
	} catch (error) {
		console.error("Error saving movie:", error.message);

		res.status(500).json({
			success: false,
			message: "Failed to save movie",
			...(process.env.NODE_ENV === "development" && { error: error.message }),
		});
	}
};

export const getMovies = async (req, res) => {
	try {
		const movies = await sql`
      SELECT * FROM movies;
    `;

		res.status(200).json({
			success: true,
			data: movies,
		});
	} catch (error) {
		console.error("Error fetching movies:", error.message);

		res.status(500).json({
			success: false,
			message: "Failed to fetch movies",
		});
	}
};

export const getMovieById = async (req, res) => {
	const { id } = req.params;

	try {
		const movie = await sql`
      SELECT * FROM movies WHERE id = ${id};
    `;

		if (movie.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Movie not found",
			});
		}

		res.status(200).json({
			success: true,
			data: movie[0],
		});
	} catch (error) {
		console.error("Error fetching movie by ID:", error.message);

		res.status(500).json({
			success: false,
			message: "Failed to fetch movie",
		});
	}
};
