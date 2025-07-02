import { useState, useEffect, useCallback } from "react";
import { useMovieStore } from "../store";
import { SearchIcon, XIcon } from "lucide-react";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

const Search = () => {
	const [localQuery, setLocalQuery] = useState("");
	const { searchResults, searchQuery, isSearching, error, searchMovies, clearSearch, setSearchQuery } = useMovieStore();

  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) return;

      try {
        await searchMovies(query);
      } catch (error) {
        toast.error(error.message || "Failed to search movies");
      }
    },
    [searchMovies]
  );
  
	// debounced search function
		useEffect(() => {
		if (localQuery.trim()) {
			const timeoutId = setTimeout(() => {
				handleSearch(localQuery);
			}, 500);

			return () => clearTimeout(timeoutId);
		} else {
			clearSearch();
		}
	}, [localQuery, clearSearch, handleSearch]);


	const handleInputChange = (e) => {
		setLocalQuery(e.target.value);
		setSearchQuery(e.target.value);
	};

	const handleClearSearch = () => {
		setLocalQuery("");
		clearSearch();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (localQuery.trim()) {
			handleSearch(localQuery);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Search Header */}
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-4">Search Movies</h1>
				<p className="text-base-content/70">Discover new movies and add them to your watchlist</p>
			</div>

			{/* Search Form */}
			<div className="max-w-2xl mx-auto mb-8">
				<form onSubmit={handleSubmit} className="form-control">
					<div className="input-group">
						<input
							type="text"
							placeholder="Search for movies..."
							className="input input-bordered w-full"
							value={localQuery}
							onChange={handleInputChange}
							autoFocus
						/>
						<div className="relative bottom-12 left-auto float-end">
							{localQuery && (
								<button type="button" className="btn btn-square btn-outline" onClick={handleClearSearch}>
									<XIcon className="w-4 h-4" />
								</button>
							)}
							<button type="submit" className="btn btn-primary" disabled={isSearching || !localQuery.trim()}>
								{isSearching ? (
									<span className="loading loading-spinner loading-sm"></span>
								) : (
									<SearchIcon className="w-4 h-4" />
								)}
							</button>
						</div>
					</div>
				</form>
			</div>

			{/* Search Status */}
			{searchQuery && (
				<div className="text-center mb-6">
					<p className="text-sm text-base-content/70">
						{isSearching ? (
							<>Searching for "{searchQuery}"...</>
						) : (
							<>
								Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
							</>
						)}
					</p>
				</div>
			)}

			{/* Loading State */}
			{isSearching && (
				<div className="flex justify-center py-12">
					<div className="text-center">
						<span className="loading loading-spinner loading-lg"></span>
						<p className="mt-4 text-base-content/70">Searching movies...</p>
					</div>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="alert alert-error max-w-2xl mx-auto mb-8">
					<span>{error}</span>
				</div>
			)}

			{/* Search Results */}
			{!isSearching && searchResults.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{searchResults.map((movie) => (
						<MovieCard key={movie.tmdb_id} movie={movie} />
					))}
				</div>
			)}

			{/* No Results */}
			{!isSearching && searchQuery && searchResults.length === 0 && !error && (
				<div className="text-center py-12">
					<div className="max-w-md mx-auto">
						<SearchIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
						<h3 className="text-xl font-semibold mb-2">No movies found</h3>
						<p className="text-base-content/70 mb-4">
							We couldn't find any movies matching "{searchQuery}". Try adjusting your search terms.
						</p>
						<div className="space-y-2 text-sm text-base-content/60">
							<p>• Check your spelling</p>
							<p>• Try different keywords</p>
							<p>• Use more general terms</p>
						</div>
					</div>
				</div>
			)}

			{/* Welcome State - No search yet */}
			{!searchQuery && !isSearching && (
				<div className="text-center py-12">
					<div className="max-w-md mx-auto">
						<SearchIcon className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
						<h3 className="text-xl font-semibold mb-2">Start Searching</h3>
						<p className="text-base-content/70">
							Enter a movie title above to start discovering new movies to add to your watchlist.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
