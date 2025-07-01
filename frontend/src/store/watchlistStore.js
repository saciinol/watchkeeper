import { create } from "zustand";

const useWatchlistStore = create((set, get) => ({
	// State
	watchlist: [],
	isLoading: false,
	error: null,

	// Computed getters (functions that derive state)
	getWantToWatch: () => {
		const { watchlist } = get();
		return watchlist.filter((item) => item.status === "want_to_watch");
	},

	getWatching: () => {
		const { watchlist } = get();
		return watchlist.filter((item) => item.status === "watching");
	},

	getCompleted: () => {
		const { watchlist } = get();
		return watchlist.filter((item) => item.status === "completed");
	},

	// Check if movie is in watchlist
	isInWatchlist: (tmdbId) => {
		const { watchlist } = get();
		return watchlist.find((item) => item.tmdb_id === tmdbId);
	},

	// Actions
	setWatchlist: (watchlist) => set({ watchlist }),

	setLoading: (isLoading) => set({ isLoading }),

	setError: (error) => set({ error }),

	loadWatchlist: async (userId) => {
		set({ isLoading: true, error: null });

		try {
			const watchlist = await watchlistService.getWatchlist(userId);
			set({
				watchlist,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.message,
				isLoading: false,
			});
		}
	},

	addToWatchlist: async (movieData, status = "want_to_watch") => {
		set({ error: null });

		try {
			const result = await watchlistService.addToWatchlist({
				...movieData,
				status,
			});

			// Update local state
			const { watchlist } = get();
			const updatedWatchlist = [
				...watchlist,
				{
					...result.movie,
					status: result.watchlist.status,
					watchlist_id: result.watchlist.id,
				},
			];

			set({ watchlist: updatedWatchlist });

			return result;
		} catch (error) {
			set({ error: error.message });
			throw error;
		}
	},

	updateWatchlistStatus: async (tmdbId, newStatus) => {
		set({ error: null });

		try {
			const { watchlist } = get();
			const item = watchlist.find((w) => w.tmdb_id === tmdbId);

			if (!item) return;

			await watchlistService.updateWatchlistStatus(tmdbId, newStatus);

			// Update local state
			const updatedWatchlist = watchlist.map((w) => (w.tmdb_id === tmdbId ? { ...w, status: newStatus } : w));

			set({ watchlist: updatedWatchlist });
		} catch (error) {
			set({ error: error.message });
			throw error;
		}
	},

	removeFromWatchlist: async (userId, movieId) => {
		set({ error: null });

		try {
			await watchlistService.removeFromWatchlist(userId, movieId);

			// Update local state
			const { watchlist } = get();
			const updatedWatchlist = watchlist.filter((w) => w.id !== movieId);

			set({ watchlist: updatedWatchlist });
		} catch (error) {
			set({ error: error.message });
			throw error;
		}
	},

	clearError: () => set({ error: null }),
}));

export default useWatchlistStore;
