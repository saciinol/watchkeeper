import { create } from "zustand";
import { movieService } from "../services/movieService";

const useMovieStore = create((set, get) => ({
	// state
	searchResults: [],
	searchQuery: "",
	isSearching: false,
	savedMovies: [],
	currentMovie: null,
	isLoading: false,
	error: null,

	// search Actions
	setSearchQuery: (query) => set({ searchQuery: query }),

	setSearchResults: (results) => set({ searchResults: results }),

	setSearching: (isSearching) => set({ isSearching }),

	searchMovies: async (query) => {
		if (!query.trim()) {
			set({ searchResults: [], searchQuery: "" });
			return;
		}

		set({ isSearching: true, error: null, searchQuery: query });

		try {
			const results = await movieService.searchMovies(query);
			set({
				searchResults: results,
				isSearching: false,
			});
		} catch (error) {
			set({
				error: error.message,
				isSearching: false,
				searchResults: [],
			});
		}
	},

	clearSearch: () =>
		set({
			searchResults: [],
			searchQuery: "",
			error: null,
		}),

	// saved Movies Actions
	setSavedMovies: (movies) => set({ savedMovies: movies }),

	addSavedMovie: (movie) => {
		const { savedMovies } = get();
		const exists = savedMovies.find((m) => m.tmdb_id === movie.tmdb_id);

		if (!exists) {
			set({ savedMovies: [...savedMovies, movie] });
		}
	},

	removeSavedMovie: (tmdbId) => {
		const { savedMovies } = get();
		set({
			savedMovies: savedMovies.filter((movie) => movie.tmdb_id !== tmdbId),
		});
	},

	// current Movie Actions
	setCurrentMovie: (movie) => set({ currentMovie: movie }),

	loadMovie: async (movieId) => {
		set({ isLoading: true, error: null });

		try {
			const movie = await movieService.getMovieById(movieId);
			set({
				currentMovie: movie,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.message,
				isLoading: false,
				currentMovie: null,
			});
		}
	},

	// utility Actions
	setLoading: (isLoading) => set({ isLoading }),
	setError: (error) => set({ error }),
	clearError: () => set({ error: null }),
}));

export default useMovieStore;
