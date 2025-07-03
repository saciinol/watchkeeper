import { sql } from "../config/db.js";

// add or update review
export const upsertReview = async (req, res) => {
	const { movie_id, rating, comment } = req.body;
	const user_id = req.user.id; // get from authenticated user

	if (!movie_id || rating == null) {
		return res.status(400).json({
			success: false,
			message: "Movie ID and rating are required",
		});
	}

	// validate rating range
	if (rating < 1 || rating > 5) {
		return res.status(400).json({
			success: false,
			message: "Rating must be between 1 and 5",
		});
	}

	try {

    const upsertResult = await sql`
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES (${user_id}, ${movie_id}, ${rating}, ${comment})
      ON CONFLICT (user_id, movie_id)
      DO UPDATE SET rating = ${rating}, comment = ${comment}
      RETURNING id; 
    `;

    if (upsertResult.length === 0 || !upsertResult[0].id) {
      console.error("Review upsert failed: No ID returned after insert/update.");
      return res.status(500).json({
        success: false,
        message: "Failed to save review: No review ID generated.",
      });
    }

    const reviewId = upsertResult[0].id;

    const reviewWithUserName = await sql`
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ${reviewId};
    `;

    if (reviewWithUserName.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found after upsert operation.",
      });
    }

    res.status(200).json({
      success: true,
      data: reviewWithUserName[0],
    });
  } catch (error) {
    console.error("Review upsert error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save review",
    });
  }
};

// get all reviews for a movie
export const getMovieReviews = async (req, res) => {
	const { movieId } = req.params;

	try {
		const reviews = await sql`
      SELECT r.*, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE movie_id = ${movieId}
      ORDER BY r.id DESC;
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

// get all reviews by a user
export const getUserReviews = async (req, res) => {
	const { userId } = req.params;

	try {
		const reviews = await sql`
			SELECT r.*, m.title AS movie_title, m.poster_url
			FROM reviews r
			JOIN movies m ON r.movie_id = m.id
			WHERE r.user_id = ${userId}
			ORDER BY r.id DESC;
		`;

		res.status(200).json({
			success: true,
			data: reviews,
		});
	} catch (error) {
		console.error("Fetch user reviews error:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to get user reviews",
		});
	}
};

// delete a review
export const deleteReview = async (req, res) => {
	const { reviewId } = req.params;
  const userId = req.user.id;

	try {
    // verify the review belongs to the user
		const review = await sql`
			SELECT * FROM reviews WHERE id = ${reviewId} AND user_id = ${userId}
		`;

		if (review.length === 0) {
			return res.status(404).json({
				success: false,
				message: "Review not found or access denied",
			});
		}

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
