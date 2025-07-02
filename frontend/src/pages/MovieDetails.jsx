import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovieStore, useWatchlistStore, useReviewStore, useAuthStore } from "../store";
import { ArrowLeftIcon, StarIcon, CalendarIcon, BookmarkIcon, EditIcon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

const MovieDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuthStore();

	const { currentMovie, isLoading: movieLoading, error: movieError, loadMovie } = useMovieStore();

	const { addToWatchlist, updateWatchlistStatus, isInWatchlist } = useWatchlistStore();

	const {
		getMovieReviews,
		getUserReviewForMovie,
		getAverageRating,
		loadMovieReviews,
		submitReview,
		deleteReview,
		isSubmitting,
	} = useReviewStore();

	const [showReviewForm, setShowReviewForm] = useState(false);
	const [reviewData, setReviewData] = useState({
		rating: 5,
		comment: "",
	});
	const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);

	useEffect(() => {
		if (id) {
			loadMovie(id);
			loadMovieReviews(id);
		}
	}, [id, loadMovie, loadMovieReviews]);

	const watchlistItem = currentMovie ? isInWatchlist(currentMovie.tmdb_id) : null;
	const reviews = currentMovie ? getMovieReviews(currentMovie.id || id) : [];
	const userReview = currentMovie ? getUserReviewForMovie(currentMovie.id || id) : null;
	const averageRating = currentMovie ? getAverageRating(currentMovie.id || id) : 0;

	const handleAddToWatchlist = async (status = "want_to_watch") => {
		if (!currentMovie) return;

		setIsAddingToWatchlist(true);
		try {
			const movieData = {
				user_id: user.id,
				tmdb_id: currentMovie.tmdb_id,
				title: currentMovie.title,
				year: currentMovie.year,
				poster_url: currentMovie.poster_url,
				plot: currentMovie.plot,
			};

			if (watchlistItem) {
				await updateWatchlistStatus(currentMovie.tmdb_id, status);
				toast.success(`Updated to ${status.replace("_", " ")}`);
			} else {
				await addToWatchlist(movieData, status);
				toast.success("Added to watchlist");
			}
		} catch (error) {
			toast.error(error.message || "Failed to update watchlist");
		} finally {
			setIsAddingToWatchlist(false);
		}
	};

	const handleReviewSubmit = async (e) => {
		e.preventDefault();
		if (!currentMovie) return;

		try {
			await submitReview(currentMovie.id || id, reviewData.rating, reviewData.comment);

			toast.success(userReview ? "Review updated!" : "Review submitted!");
			setShowReviewForm(false);
			setReviewData({ rating: 5, comment: "" });
		} catch (error) {
			toast.error(error.message || "Failed to submit review");
		}
	};

	const handleDeleteReview = async () => {
		if (!userReview || !currentMovie) return;

		if (confirm("Are you sure you want to delete your review?")) {
			try {
				await deleteReview(userReview.id, currentMovie.id || id);
				toast.success("Review deleted");
			} catch (error) {
				toast.error(error.message || "Failed to delete review");
			}
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

	const renderStars = (rating, interactive = false, onRate = null) => {
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<button
						key={star}
						type={interactive ? "button" : undefined}
						className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
						onClick={interactive ? () => onRate(star) : undefined}
						disabled={!interactive}
					>
						<StarIcon className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
					</button>
				))}
			</div>
		);
	};

	if (movieLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-center items-center min-h-[50vh]">
					<div className="text-center">
						<span className="loading loading-spinner loading-lg"></span>
						<p className="mt-4">Loading movie details...</p>
					</div>
				</div>
			</div>
		);
	}

	if (movieError || !currentMovie) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
					<p className="text-base-content/70 mb-6">{movieError || "The movie you're looking for doesn't exist."}</p>
					<button onClick={() => navigate(-1)} className="btn btn-primary">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Back Button */}
			<button onClick={() => navigate(-1)} className="btn btn-ghost mb-6">
				<ArrowLeftIcon className="w-4 h-4 mr-2" />
				Back
			</button>

			{/* Movie Details */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
				{/* Poster */}
				<div className="lg:col-span-1">
					<div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
						{currentMovie.poster_url ? (
							<img src={currentMovie.poster_url} alt={currentMovie.title} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full bg-base-200 flex items-center justify-center">
								<span className="text-base-content/50">No Poster Available</span>
							</div>
						)}
					</div>
				</div>

				{/* Movie Info */}
				<div className="lg:col-span-2">
					<div className="flex flex-col h-full">
						<div className="flex-1">
							<div className="flex flex-wrap items-start justify-between mb-4">
								<h1 className="text-3xl font-bold mb-2">{currentMovie.title}</h1>
								{currentMovie.year && (
									<div className="flex items-center text-base-content/70">
										<CalendarIcon className="w-4 h-4 mr-1" />
										{currentMovie.year}
									</div>
								)}
							</div>

							{/* Rating & Watchlist Status */}
							<div className="flex flex-wrap items-center gap-4 mb-4">
								{averageRating > 0 && (
									<div className="flex items-center gap-2">
										{renderStars(Math.round(averageRating))}
										<span className="text-sm text-base-content/70">
											{averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
										</span>
									</div>
								)}

								{watchlistItem && (
									<span className={`badge ${getStatusColor(watchlistItem.status)}`}>
										<BookmarkIcon className="w-3 h-3 mr-1" />
										{watchlistItem.status.replace("_", " ")}
									</span>
								)}
							</div>

							{/* Plot */}
							{currentMovie.plot && (
								<div className="mb-6">
									<h3 className="text-lg font-semibold mb-2">Plot</h3>
									<p className="text-base-content/80 leading-relaxed">{currentMovie.plot}</p>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-3">
							<div className="dropdown dropdown-top">
								<button
									className={`btn btn-primary ${isAddingToWatchlist ? "loading" : ""}`}
									disabled={isAddingToWatchlist}
									tabIndex={0}
								>
									<BookmarkIcon className="w-4 h-4 mr-2" />
									{watchlistItem ? "Update Status" : "Add to Watchlist"}
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

							<button className="btn btn-secondary" onClick={() => setShowReviewForm(!showReviewForm)}>
								<EditIcon className="w-4 h-4 mr-2" />
								{userReview ? "Edit Review" : "Write Review"}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Review Form */}
			{showReviewForm && (
				<div className="card bg-base-200 mb-8">
					<div className="card-body">
						<h3 className="card-title">{userReview ? "Edit Your Review" : "Write a Review"}</h3>
						<form onSubmit={handleReviewSubmit} className="space-y-4">
							<div>
								<label className="label">
									<span className="label-text">Rating</span>
								</label>
								{renderStars(reviewData.rating, true, (rating) => setReviewData({ ...reviewData, rating }))}
							</div>

							<div>
								<label className="label">
									<span className="label-text">Comment (optional)</span>
								</label>
								<textarea
									className="textarea textarea-bordered w-full"
									placeholder="Share your thoughts about this movie..."
									value={reviewData.comment}
									onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
									rows="4"
								/>
							</div>

							<div className="flex gap-2">
								<button
									type="submit"
									className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
									disabled={isSubmitting}
								>
									{userReview ? "Update Review" : "Submit Review"}
								</button>
								<button type="button" className="btn btn-ghost" onClick={() => setShowReviewForm(false)}>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Reviews Section */}
			<div className="card bg-base-100 shadow-md">
				<div className="card-body">
					<h3 className="card-title mb-4">Reviews ({reviews.length})</h3>

					{reviews.length === 0 ? (
						<div className="text-center py-8 text-base-content/70">
							<p>No reviews yet. Be the first to review this movie!</p>
						</div>
					) : (
						<div className="space-y-4">
							{reviews.map((review) => (
								<div key={review.id} className="border-b border-base-200 pb-4 last:border-b-0">
									<div className="flex items-start justify-between mb-2">
										<div className="flex items-center gap-3">
											<div className="avatar placeholder">
												<div className="bg-neutral text-neutral-content rounded-full w-10">
													<span className="text-sm">{review.user_name?.charAt(0).toUpperCase() || "U"}</span>
												</div>
											</div>
											<div>
												<p className="font-medium">{review.user_name}</p>
												<div className="flex items-center gap-2">
													{renderStars(review.rating)}
													<span className="text-sm text-base-content/70">
														{new Date(review.created_at).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>

										{review.user_id === user?.id && (
											<div className="dropdown dropdown-end">
												<button className="btn btn-ghost btn-sm btn-circle">
													<EditIcon className="w-4 h-4" />
												</button>
												<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
													<li>
														<button
															onClick={() => {
																setReviewData({
																	rating: review.rating,
																	comment: review.comment || "",
																});
																setShowReviewForm(true);
															}}
														>
															Edit
														</button>
													</li>
													<li>
														<button onClick={handleDeleteReview} className="text-error">
															<TrashIcon className="w-4 h-4" />
															Delete
														</button>
													</li>
												</ul>
											</div>
										)}
									</div>

									{review.comment && <p className="text-base-content/80 ml-13">{review.comment}</p>}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MovieDetails;
