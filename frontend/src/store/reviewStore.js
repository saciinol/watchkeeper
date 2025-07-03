import { create } from "zustand";
import { reviewService } from "../services/reviewService";

const useReviewStore = create((set, get) => ({
	// state
	reviews: {}, // object with movieId as key, reviews array as value
	userReviews: [], // current user's reviews
	isLoading: false,
	isSubmitting: false,
	error: null,

	// getters
	getMovieReviews: (movieId) => {
		const { reviews } = get();
		return reviews[movieId] || [];
	},

	getUserReviewForMovie: (movieId) => {
		const { userReviews } = get();
		return userReviews.find((review) => review.movie_id === parseInt(movieId));
	},

	getAverageRating: (movieId) => {
		const movieReviews = get().getMovieReviews(movieId);
		if (movieReviews.length === 0) return 0;

		const sum = movieReviews.reduce((acc, review) => acc + review.rating, 0);
		return (sum / movieReviews.length).toFixed(1);
	},

	// actions
	setReviews: (movieId, reviews) => {
		const { reviews: currentReviews } = get();
		set({
			reviews: {
				...currentReviews,
				[movieId]: reviews,
			},
		});
	},

	setUserReviews: (userReviews) => set({ userReviews }),

	setLoading: (isLoading) => set({ isLoading }),

	setSubmitting: (isSubmitting) => set({ isSubmitting }),

	setError: (error) => set({ error }),

	loadMovieReviews: async (movieId) => {
		set({ isLoading: true, error: null });

		try {
			const reviews = await reviewService.getMovieReviews(movieId);
			get().setReviews(movieId, reviews);
			set({ isLoading: false });
		} catch (error) {
			set({
				error: error.message,
				isLoading: false,
			});
		}
	},

	loadUserReviews: async (userId) => {
		set({ isLoading: true, error: null });

		try {
			const userReviews = await reviewService.getUserReviews(userId);
			set({
				userReviews,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.message,
				isLoading: false,
			});
		}
	},

	submitReview: async (movieId, rating, comment, userId, userName) => {
		set({ isSubmitting: true, error: null });

		try {
			const review = await reviewService.submitReview({
				movie_id: movieId,
				rating,
				comment,
        user_id: userId,
        user_name: userName,
			});

			// update movie reviews
			const currentMovieReviews = get().getMovieReviews(movieId);
			const existingIndex = currentMovieReviews.findIndex((r) => r.user_id === review.user_id);

			let updatedMovieReviews;
			if (existingIndex >= 0) {
				// update existing review
				updatedMovieReviews = [...currentMovieReviews];
				updatedMovieReviews[existingIndex] = review;
			} else {
				// add new review
				updatedMovieReviews = [...currentMovieReviews, review];
			}

			get().setReviews(movieId, updatedMovieReviews);

			// update user reviews
			const { userReviews } = get();
			const userReviewIndex = userReviews.findIndex((r) => r.movie_id === movieId);

			let updatedUserReviews;
			if (userReviewIndex >= 0) {
				updatedUserReviews = [...userReviews];
				updatedUserReviews[userReviewIndex] = review;
			} else {
				updatedUserReviews = [...userReviews, review];
			}

			set({
				userReviews: updatedUserReviews,
				isSubmitting: false,
			});

			return review;
		} catch (error) {
			set({
				error: error.message,
				isSubmitting: false,
			});
			throw error;
		}
	},

	deleteReview: async (reviewId, movieId) => {
		set({ error: null });

		try {
			await reviewService.deleteReview(reviewId);

			// remove from movie reviews
			const currentMovieReviews = get().getMovieReviews(movieId);
			const updatedMovieReviews = currentMovieReviews.filter((r) => r.id !== reviewId);
			get().setReviews(movieId, updatedMovieReviews);

			// remove from user reviews
			const { userReviews } = get();
			const updatedUserReviews = userReviews.filter((r) => r.id !== reviewId);
			set({ userReviews: updatedUserReviews });
		} catch (error) {
			set({ error: error.message });
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));

export default useReviewStore;
