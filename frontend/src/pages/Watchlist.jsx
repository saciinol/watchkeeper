import { useEffect, useState } from "react";
import { useAuthStore, useWatchlistStore } from "../store";
import { BookmarkIcon, PlayIcon, CheckCircleIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Watchlist = () => {
	const { user } = useAuthStore();
	const {
		watchlist,
		isLoading,
		error,
		loadWatchlist,
		removeFromWatchlist,
		updateWatchlistStatus,
		getWantToWatch,
		getWatching,
		getCompleted,
	} = useWatchlistStore();

	const [activeTab, setActiveTab] = useState("all");
	const [removingId, setRemovingId] = useState(null);

	useEffect(() => {
		if (user?.id) {
			loadWatchlist(user.id);
		}
	}, [user?.id, loadWatchlist]);

	const handleRemoveFromWatchlist = async (movieId) => {
		setRemovingId(movieId);
		try {
			await removeFromWatchlist(user.id, movieId);
			toast.success("Movie removed from watchlist");
		} catch (error) {
			toast.error(error.message || "Failed to remove movie");
		} finally {
			setRemovingId(null);
		}
	};

	const statusLabels = {
		want_to_watch: "Want to Watch",
		watching: "Currently Watching",
		completed: "Completed",
	};

	const handleStatusChange = async (movie, newStatus) => {
		try {
			await updateWatchlistStatus(movie.id, newStatus);
			toast.success(
				`Updated to ${statusLabels[newStatus]}`
			);
		} catch (error) {
			toast.error(error.message || "Failed to update status");
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "want_to_watch":
				return <BookmarkIcon className="w-4 h-4" />;
			case "watching":
				return <PlayIcon className="w-4 h-4" />;
			case "completed":
				return <CheckCircleIcon className="w-4 h-4" />;
			default:
				return <BookmarkIcon className="w-4 h-4" />;
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

	const getFilteredMovies = () => {
		switch (activeTab) {
			case "want_to_watch":
				return getWantToWatch();
			case "watching":
				return getWatching();
			case "completed":
				return getCompleted();
			default:
				return watchlist;
		}
	};

	const filteredMovies = getFilteredMovies();

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-center items-center min-h-64">
					<span className="loading loading-spinner loading-lg"></span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="alert alert-error">
					<span>{error}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
				<p className="text-base-content/70">Keep track of movies you want to watch, are watching, or have completed</p>
			</div>

			{/* Tabs */}
			<div className="tabs tabs-boxed mb-6 w-fit">
				<button className={`tab ${activeTab === "all" ? "tab-active" : ""}`} onClick={() => setActiveTab("all")}>
					All ({watchlist.length})
				</button>
				<button
					className={`tab ${activeTab === "want_to_watch" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("want_to_watch")}
				>
					Want to Watch ({getWantToWatch().length})
				</button>
				<button
					className={`tab ${activeTab === "watching" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("watching")}
				>
					Watching ({getWatching().length})
				</button>
				<button
					className={`tab ${activeTab === "completed" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("completed")}
				>
					Completed ({getCompleted().length})
				</button>
			</div>

			{/* Movies Grid */}
			{filteredMovies.length === 0 ? (
				<div className="text-center py-12">
					<BookmarkIcon className="w-16 h-16 mx-auto text-base-content/50 mb-4" />
					<h2 className="text-xl font-semibold mb-2">No movies in this category</h2>
					<p className="text-base-content/70 mb-4">
						{activeTab === "all"
							? "Start building your watchlist by searching for movies!"
							: `No movies in "${statusLabels[activeTab]}" status.`}
					</p>
					<Link to="/search" className="btn btn-primary">
						Search Movies
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{filteredMovies.map((movie) => (
						<div key={movie.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
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

								<div className="mb-3">
									<span className={`badge badge-sm ${getStatusColor(movie.status)}`}>
										{getStatusIcon(movie.status)}
										<span className="ml-1">
											{statusLabels[movie.status]}
										</span>
									</span>
								</div>

								<div className="card-actions justify-between items-center">
									{/* Status Update Dropdown */}
									<div className="dropdown dropdown-top">
										<button className="btn btn-sm btn-outline" tabIndex={0}>
											Update Status
										</button>
										<ul
											tabIndex={0}
											className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mb-2"
										>
											<li>
												<button onClick={() => handleStatusChange(movie, "want_to_watch")}>
													<BookmarkIcon className="w-4 h-4" />
													Want to Watch
												</button>
											</li>
											<li>
												<button onClick={() => handleStatusChange(movie, "watching")}>
													<PlayIcon className="w-4 h-4" />
													Currently Watching
												</button>
											</li>
											<li>
												<button onClick={() => handleStatusChange(movie, "completed")}>
													<CheckCircleIcon className="w-4 h-4" />
													Completed
												</button>
											</li>
										</ul>
									</div>

									{/* Remove Button */}
									<button
										className={`btn btn-sm btn-error btn-outline ${removingId === movie.id ? "loading" : ""}`}
										onClick={() => handleRemoveFromWatchlist(movie.id)}
										disabled={removingId === movie.id}
									>
										{removingId !== movie.id && <TrashIcon className="w-4 h-4" />}
									</button>
								</div>

								{/* Movie Details Link */}
								<div className="mt-2">
									<Link to={`/movie/${movie.movie_id}`} className="btn btn-sm btn-ghost w-full">
										View Details
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Watchlist;
