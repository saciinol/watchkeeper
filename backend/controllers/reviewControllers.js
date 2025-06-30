import { sql } from "../config/db.js";

// Add or update review
export const upsertReview = async (req, res) => {
	const { user_id, movie_id, rating, comment } = req.body;

	if (!user_id || !movie_id || rating == null) {
		return res.status(400).json({
			success: false,
			message: "Missing required fields",
		});
	}

	try {
		const result = await sql`
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES (${user_id}, ${movie_id}, ${rating}, ${comment})
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET rating = ${rating}, comment = ${comment}
      RETURNING *;
    `;

		res.status(200).json({
			success: true,
			data: result[0],
		});
	} catch (error) {
		console.error("Review upsert error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to save review",
		});
	}
};

// Get all reviews for a movie
export const getMovieReviews = async (req, res) => {
	const { movieId } = req.params;

	try {
		const reviews = await sql`
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE movie_id = ${movieId};
    `;

		res.status(200).json({
			success: true,
			data: reviews,
		});
	} catch (error) {
		console.error("Fetch reviews error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to get reviews",
		});
	}
};

// Delete a review
export const deleteReview = async (req, res) => {
	const { reviewId } = req.params;

	try {
		await sql`DELETE FROM reviews WHERE id = ${reviewId}`;

		res.status(200).json({
			success: true,
			message: "Review deleted",
		});
	} catch (error) {
		console.error("Delete review error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to delete review",
		});
	}
};
