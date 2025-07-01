import api from "./api";

export const reviewService = {
	// get all reviews for a specific movie
	getMovieReviews: async (movieId) => {
		const response = await api.get(`/reviews/${movieId}`);
		return response.data.data;
	},

	// get all reviews by a specific user
	getUserReviews: async (userId) => {
		// Note: This endpoint doesn't exist in your backend yet
		// You may need to add it to your reviewRoutes.js and reviewControllers.js
		const response = await api.get(`/reviews/user/${userId}`);
		return response.data.data;
	},

	// submit a new review or update an existing one
	submitReview: async (reviewData) => {
		const response = await api.post("/reviews", reviewData);
		return response.data.data;
	},

	// delete a review
	deleteReview: async (reviewId) => {
		const response = await api.delete(`/reviews/${reviewId}`);
		return response.data;
	},
};
