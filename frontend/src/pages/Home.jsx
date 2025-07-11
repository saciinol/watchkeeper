import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMovieStore } from "../store";
import { movieService } from "../services/movieService";
import { RefreshCwIcon } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { ComponentLoader, MovieCardSkeleton } from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import ErrorAlert from "../components/ErrorAlert";

const Home = () => {
	const { savedMovies, setSavedMovies, isLoading, error, setLoading, setError } = useMovieStore();
	const [featuredMovies, setFeaturedMovies] = useState([]);

	// function to shuffle array and get random items
	const getRandomMovies = (movies, count = 10) => {
		if (!movies || movies.length === 0) return [];

		const shuffled = [...movies].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, Math.min(count, movies.length));
	};

	useEffect(() => {
		const loadMovies = async () => {
			setLoading(true);
			setError(null);

			try {
				const movies = await movieService.getMovies();
				setSavedMovies(movies);

				// set random featured movies
				const randomMovies = getRandomMovies(movies, 10);
				setFeaturedMovies(randomMovies);
			} catch (error) {
				console.error("Error loading movies:", error);
				setError(error.message || "Failed to load movies");
				toast.error("Failed to load movies");
			} finally {
				setLoading(false);
			}
		};

		loadMovies();
	}, [setSavedMovies, setLoading, setError]);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4">Welcome to WatchKeeper</h1>
				<p className="text-lg text-gray-600">Discover, track, and review your favorite movies</p>
			</div>

			{/* Featured Movies Section */}
			<section className="mb-12">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold">Featured Movies</h2>
					{savedMovies.length > 10 && (
						<button
							className="btn btn-sm btn-outline"
							onClick={() => {
								const randomMovies = getRandomMovies(savedMovies, 10);
								setFeaturedMovies(randomMovies);
							}}
						>
							<RefreshCwIcon className="size-5" />
						</button>
					)}
				</div>

				{/* Loading State with Movie Card Skeletons */}
				{isLoading && (
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{Array.from({ length: 10 }).map((_, index) => (
							<MovieCardSkeleton key={index} />
						))}
					</div>
				)}

				{/* Error State */}
				<ErrorAlert message={error} />

				{/* Movies Grid */}
				{!isLoading && !error && (
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{featuredMovies.map((movie) => (
							<MovieCard key={movie.id || movie.tmdb_id} movie={movie} />
						))}
					</div>
				)}

				{/* Empty State */}
				{savedMovies.length === 0 && !isLoading && !error && (
					<div className="text-center py-8">
						<p className="text-gray-500">No movies to display yet.</p>
						<p className="text-sm text-gray-400 mt-2">
							Start by searching for movies and adding them to your watchlist!
						</p>
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
								<Link to="/search" className="btn btn-primary">
									Start Searching
								</Link>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-md">
						<div className="card-body text-center">
							<h3 className="card-title">My Watchlist</h3>
							<p>Track movies you want to watch</p>
							<div className="card-actions justify-center">
								<Link to="/watchlist" className="btn btn-secondary">
									View Watchlist
								</Link>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-md">
						<div className="card-body text-center">
							<h3 className="card-title">My Reviews</h3>
							<p>See all your movie reviews</p>
							<div className="card-actions justify-center">
								<Link to="/profile" className="btn btn-accent">
									View Profile
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
