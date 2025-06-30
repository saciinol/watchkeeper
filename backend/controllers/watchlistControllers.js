import { sql } from "../config/db.js";

// add or update a movie in the user's watchlist
export const upsertWatchlist = async (req, res) => {
	const { user_id, tmdb_id, title, year, poster_url, plot, status } = req.body;

	if (!user_id || !tmdb_id || !title || !status) {
		return res.status(400).json({
			success: false,
			message: "Missing required fields",
		});
	}

	try {
		// check if the movie already exists
		const existing = await sql`
      SELECT * FROM movies WHERE tmdb_id = ${tmdb_id}
    `;

		let movie;

		if (existing.length > 0) {
			movie = existing[0];
		} else {
			// insert new movie
			const inserted = await sql`
        INSERT INTO movies (tmdb_id, title, year, poster_url, plot)
        VALUES (${tmdb_id}, ${title}, ${year}, ${poster_url}, ${plot})
        RETURNING *;
      `;
			movie = inserted[0];
		}

		// upsert into watchlist
		const watchlist = await sql`
      INSERT INTO watchlists (user_id, movie_id, status)
      VALUES (${user_id}, ${movie.id}, ${status})
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET status = ${status}
      RETURNING *;
    `;

		res.status(200).json({
			success: true,
			data: {
				movie,
				watchlist: watchlist[0],
			},
		});
	} catch (error) {
		console.error("Upsert watchlist error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to update watchlist",
			...(process.env.NODE_ENV === "development" && { error: error.message }),
		});
	}
};

// get a user's entire watchlist
export const getWatchlist = async (req, res) => {
	const { userId } = req.params;

	try {
		const watchlist = await sql`
      SELECT w.*, m.title, m.poster_url
      FROM watchlists w
      JOIN movies m ON m.id = w.movie_id
      WHERE w.user_id = ${userId};
    `;

		res.status(200).json({
			success: true,
			data: watchlist,
		});
	} catch (error) {
		console.error("Fetch watchlist error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to fetch watchlist",
		});
	}
};

// remove a movie from a user's watchlist
export const removeFromWatchlist = async (req, res) => {
	const { userId, movieId } = req.params;

	try {
		await sql`
      DELETE FROM watchlists
      WHERE user_id = ${userId} AND movie_id = ${movieId};
    `;

		res.status(200).json({
			success: true,
			message: "Movie removed from watchlist",
		});
	} catch (error) {
		console.error("Delete watchlist error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to remove movie",
		});
	}
};
