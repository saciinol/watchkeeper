import { useEffect } from "react";
import { useMovieStore } from "../store/movieStore";
import MovieCard from "../components/MovieCard";

const Home = () => {
	const { savedMovies, setSavedMovies, isLoading, error } = useMovieStore();

	useEffect(() => {
		// load popular/featured movies on home page
		const loadMovies = async () => {
			try {
        // you could fetch popular movies from TMDB or your saved movies
				// for now, we'll just show saved movies
			} catch (error) {
				console.error("Error loading Movies", error);
			}
		};

		loadMovies();
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4">Welcome to WatchKeeper</h1>
				<p className="text-lg text-gray-600">Discover, track, and review your favorite movies</p>
			</div>

			{/* Featured Movies Section */}
			<section className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Featured Movies</h2>

				{isLoading && (
					<div className="flex justify-center">
						<span className="loading loading-spinner loading-lg"></span>
					</div>
				)}

				{error && (
					<div className="alert alert-error">
						<span>{error}</span>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{savedMovies.slice(0, 8).map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))}
				</div>

				{savedMovies.length === 0 && !isLoading && (
					<div className="text-center py-8">
						<p className="text-gray-500">No movies to display yet.</p>
					</div>
				)}
			</section>

			{/* Quick Actions */}
			<section className="bg-base-200 rounded-lg p-6">
				<h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="card bg-base-100 shadow-md">
						<div className="card-body text-center">
							<h3 className="card-title">Search Movies</h3>
							<p>Find your next favorite movie</p>
							<div className="card-actions justify-center">
								<a href="/search" className="btn btn-primary">
									Start Searching
								</a>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-md">
						<div className="card-body text-center">
							<h3 className="card-title">My Watchlist</h3>
							<p>Track movies you want to watch</p>
							<div className="card-actions justify-center">
								<a href="/watchlist" className="btn btn-secondary">
									View Watchlist
								</a>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-md">
						<div className="card-body text-center">
							<h3 className="card-title">My Reviews</h3>
							<p>See all your movie reviews</p>
							<div className="card-actions justify-center">
								<a href="/profile" className="btn btn-accent">
									View Profile
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;