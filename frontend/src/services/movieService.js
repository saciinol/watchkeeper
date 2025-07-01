import api from "./api";

export const movieService = {
	// search movies from TMDB
	searchMovies: async (query) => {
		const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}`);
		return response.data.data;
	},

	// get all saved movies
	getMovies: async () => {
		const response = await api.get("/movies");
		return response.data.data;
	},

	// get a specific movie by ID
	getMovieById: async (movieId) => {
		const response = await api.get(`/movies/${movieId}`);
		return response.data.data;
	},

	// save a movie to the database
	saveMovie: async (movieData) => {
		const response = await api.post("/movies", movieData);
		return response.data.data;
	},
};

