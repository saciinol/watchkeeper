import { useState } from "react";
import { useAuthStore, useWatchlistStore } from "../store";
import toast from "react-hot-toast";

const MovieCard = ({ movie }) => {
	const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
	const { user, isAuthenticated } = useAuthStore();
	const { addToWatchlist, isInWatchlist, updateWatchlistStatus } = useWatchlistStore();

	const watchlistItem = isInWatchlist(movie.tmdb_id);

	const handleAddToWatchlist = async (status = "want_to_watch") => {
		if (!isAuthenticated) {
			toast.error("Please login to add movies to your watchlist");
			return;
		}

		setIsAddingToWatchlist(true);

		try {
			const movieData = {
				user_id: user.id,
				tmdb_id: movie.tmdb_id,
				title: movie.title,
				year: movie.year,
				poster_url: movie.poster_url,
				plot: movie.plot,
			};

			if (watchlistItem) {
				// update existing status
				await updateWatchlistStatus(movie.tmdb_id, status);
				toast.success(`Updated to ${status.replace("_", " ")}`);
			} else {
				// add new item
				await addToWatchlist(movieData, status);
				toast.success("Added to watchlist");
			}
		} catch (error) {
			toast.error(error.message || "Failed to update watchlist");
		} finally {
			setIsAddingToWatchlist(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "want_to_watch":
				return "badge-secondary";
			case "watching":
				return "badge-primary";
			case "completed":
				return "badge-success";
			default:
				return "badge-ghost";
		}
	};

	return (
		<div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
			<figure className="aspect-[2/3] overflow-hidden">
				{movie.poster_url ? (
					<img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
				) : (
					<div className="w-full h-full bg-base-200 flex items-center justify-center">
						<span className="text-base-content/50">No Image</span>
					</div>
				)}
			</figure>

			<div className="card-body p-4">
				<div className="flex justify-between items-start mb-2">
					<h3 className="card-title text-sm font-semibold line-clamp-2 flex-1">{movie.title}</h3>
					{movie.year && <span className="text-xs text-base-content/70 ml-2 flex-shrink-0">{movie.year}</span>}
				</div>

				{movie.plot && <p className="text-xs text-base-content/70 line-clamp-3 mb-3">{movie.plot}</p>}

				{watchlistItem && (
					<div className="mb-2">
						<span className={`badge badge-sm ${getStatusColor(watchlistItem.status)}`}>
							{watchlistItem.status.replace("_", " ")}
						</span>
					</div>
				)}

				<div className="card-actions justify-between items-center">
					{isAuthenticated ? (
						<div className="dropdown dropdown-top">
							<button
								className={`btn btn-sm btn-primary ${isAddingToWatchlist ? "loading" : ""}`}
								disabled={isAddingToWatchlist}
								tabIndex={0}
							>
								{watchlistItem ? "Update" : "Add to List"}
							</button>
							<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
								<li>
									<button onClick={() => handleAddToWatchlist("want_to_watch")}>Want to Watch</button>
								</li>
								<li>
									<button onClick={() => handleAddToWatchlist("watching")}>Currently Watching</button>
								</li>
								<li>
									<button onClick={() => handleAddToWatchlist("completed")}>Completed</button>
								</li>
							</ul>
						</div>
					) : (
						<button
							className="btn btn-sm btn-outline"
							onClick={() => toast.error("Please login to add movies to your watchlist")}
						>
							Login to Add
						</button>
					)}

					<a href={`/movie/${movie.id || movie.tmdb_id}`} className="btn btn-sm btn-ghost">
						Details
					</a>
				</div>
			</div>
		</div>
	);
};

export default MovieCard;
