import api from "./api";

export const watchlistService = {
	// get user's entire watchlist
	getWatchlist: async (userId) => {
		const response = await api.get(`/watchlist/${userId}`);
		return response.data.data;
	},

	// add or update a movie in the watchlist
	addToWatchlist: async (movieData) => {
		const response = await api.post("/watchlist", movieData);
		return response.data.data;
	},

	// update watchlist status for an existing movie
	updateWatchlistStatus: async (movieData, status) => {
		const response = await api.post("/watchlist", {
			...movieData,
			status,
		});
		return response.data.data;
	},

	// remove a movie from the watchlist
	removeFromWatchlist: async (userId, movieId) => {
		const response = await api.delete(`/watchlist/${userId}/${movieId}`);
		return response.data;
	},
};