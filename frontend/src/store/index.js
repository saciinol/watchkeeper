import useAuthStore from "./authStore";
import useMovieStore from "./movieStore";
import useWatchlistStore from "./watchlistStore";
import useReviewStore from "./reviewStore";

// initialize stores when app starts
export const initializeStores = () => {
	// check authentication status
	useAuthStore.getState().checkAuth();

	// load user data if authenticated
	const { isAuthenticated, user } = useAuthStore.getState();
	if (isAuthenticated && user) {
		// load user's watchlist
		useWatchlistStore.getState().loadWatchlist(user.id);

		// load user's reviews
		useReviewStore.getState().loadUserReviews(user.id);
	}
};

// export all stores
export { useAuthStore, useMovieStore, useWatchlistStore, useReviewStore };
