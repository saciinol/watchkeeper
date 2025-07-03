import { useEffect, useState } from "react";
import { useAuthStore, useWatchlistStore, useReviewStore } from "../store";
import {
	UserIcon,
	MailIcon,
	CalendarIcon,
	FilmIcon,
	StarIcon,
	BookmarkIcon,
	PlayIcon,
	CheckCircleIcon,
} from "lucide-react";

const Profile = () => {
	const { user } = useAuthStore();
	const { watchlist, loadWatchlist, getWantToWatch, getWatching, getCompleted } = useWatchlistStore();
	const { userReviews, loadUserReviews } = useReviewStore();

	const [activeTab, setActiveTab] = useState("overview");

	useEffect(() => {
		if (user?.id) {
			loadWatchlist(user.id);
			loadUserReviews(user.id);
		}
	}, [user?.id, loadWatchlist, loadUserReviews]);

	// Calculate statistics
	const totalMovies = watchlist.length;
	const wantToWatchCount = getWantToWatch().length;
	const watchingCount = getWatching().length;
	const completedCount = getCompleted().length;
	const totalReviews = userReviews.length;
	const averageRating =
		userReviews.length > 0
			? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
			: 0;

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const StatCard = ({ icon: Icon, title, value, description, color = "primary" }) => (
		<div className="card bg-base-100 shadow-md">
			<div className="card-body">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-base-content/70">{title}</p>
						<p className={`text-2xl font-bold text-${color}`}>{value}</p>
						{description && <p className="text-xs text-base-content/60">{description}</p>}
					</div>
					{Icon && <Icon className={`w-8 h-8 text-${color}`} />}
				</div>
			</div>
		</div>
	);

	const statusLabels = {
		want_to_watch: "Want to Watch",
		watching: "Currently Watching",
		completed: "Completed",
	};

	const RecentActivity = () => {
		// Combine watchlist and reviews for recent activity
		const recentWatchlist = watchlist.slice(0, 5).map((item) => ({
			type: "watchlist",
			movie: item,
			action: `Added to ${statusLabels[item.status]}`,
		}));

		const recentReviews = userReviews.slice(0, 5).map((review) => ({
			type: "review",
			movie: review,
			action: `Rated ${review.rating}/5`,
		}));

		const combinedActivity = [...recentWatchlist, ...recentReviews].slice(0, 8);

		return (
			<div className="space-y-4">
				{combinedActivity.length === 0 ? (
					<div className="text-center py-8">
						<FilmIcon className="w-12 h-12 mx-auto text-base-content/50 mb-2" />
						<p className="text-base-content/70">No recent activity</p>
					</div>
				) : (
					combinedActivity.map((activity, index) => (
						<div key={index} className="flex items-center space-x-4 p-4 bg-base-100 rounded-lg shadow-sm">
							<div className="avatar">
								<div className="w-12 h-12 rounded-lg">
									{activity.movie.poster_url ? (
										<img
											src={activity.movie.poster_url}
											alt={activity.movie.title}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-base-200 flex items-center justify-center">
											<FilmIcon className="w-6 h-6 text-base-content/50" />
										</div>
									)}
								</div>
							</div>
							<div className="flex-1">
								<p className="font-medium">{activity.movie.title}</p>
								<p className="text-sm text-base-content/70">{activity.action}</p>
							</div>
							{activity.type === "review" && (
								<div className="flex items-center space-x-1">
									<StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
									<span className="text-sm font-medium">{activity.movie.rating}</span>
								</div>
							)}
						</div>
					))
				)}
			</div>
		);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Profile Header */}
			<div className="bg-base-200 rounded-lg p-6 mb-8">
				<div className="flex items-center space-x-6">
					<div className="avatar placeholder">
						<div className="bg-primary text-primary-content rounded-full w-20 h-20">
							<span className="text-2xl font-bold">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
						</div>
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2">{user?.name || "User"}</h1>
						<div className="flex items-center space-x-4 text-base-content/70">
							<div className="flex items-center space-x-1">
								<MailIcon className="w-4 h-4" />
								<span>{user?.email}</span>
							</div>
							{user?.created_at && (
								<div className="flex items-center space-x-1">
									<CalendarIcon className="w-4 h-4" />
									<span>Joined {formatDate(user.created_at)}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="tabs tabs-boxed mb-6 w-fit">
				<button
					className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("overview")}
				>
					Overview
				</button>
				<button
					className={`tab ${activeTab === "activity" ? "tab-active" : ""}`}
					onClick={() => setActiveTab("activity")}
				>
					Recent Activity
				</button>
			</div>

			{/* Tab Content */}
			{activeTab === "overview" && (
				<div className="space-y-8">
					{/* Statistics Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<StatCard
							icon={FilmIcon}
							title="Total Movies"
							value={totalMovies}
							description="In watchlist"
							color="primary"
						/>
						<StatCard
							icon={StarIcon}
							title="Reviews Written"
							value={totalReviews}
							description={totalReviews > 0 ? `Avg rating: ${averageRating}` : ""}
							color="warning"
						/>
						<StatCard icon={CheckCircleIcon} title="Movies Completed" value={completedCount} color="success" />
						<StatCard icon={PlayIcon} title="Currently Watching" value={watchingCount} color="info" />
					</div>

					{/* Watchlist Breakdown */}
					<div className="card bg-base-100 shadow-md">
						<div className="card-body">
							<h2 className="card-title mb-4">Watchlist Breakdown</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="stat">
									<div className="stat-figure text-secondary">
										<BookmarkIcon className="w-8 h-8" />
									</div>
									<div className="stat-title">Want to Watch</div>
									<div className="stat-value text-secondary">{wantToWatchCount}</div>
								</div>
								<div className="stat">
									<div className="stat-figure text-primary">
										<PlayIcon className="w-8 h-8" />
									</div>
									<div className="stat-title">Watching</div>
									<div className="stat-value text-primary">{watchingCount}</div>
								</div>
								<div className="stat">
									<div className="stat-figure text-success">
										<CheckCircleIcon className="w-8 h-8" />
									</div>
									<div className="stat-title">Completed</div>
									<div className="stat-value text-success">{completedCount}</div>
								</div>
							</div>
						</div>
					</div>

					{/* Recent Reviews */}
					{userReviews.length > 0 && (
						<div className="card bg-base-100 shadow-md">
							<div className="card-body">
								<h2 className="card-title mb-4">Recent Reviews</h2>
								<div className="space-y-4">
									{userReviews.slice(0, 5).map((review) => (
										<div key={review.id} className="flex items-start space-x-4 p-4 bg-base-200 rounded-lg">
											<div className="avatar">
												<div className="w-16 h-16 rounded-lg">
													{review.poster_url ? (
														<img src={review.poster_url} alt={review.title} className="w-full h-full object-cover" />
													) : (
														<div className="w-full h-full bg-base-300 flex items-center justify-center">
															<FilmIcon className="w-6 h-6 text-base-content/50" />
														</div>
													)}
												</div>
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-2">
													<h3 className="font-semibold">{review.title}</h3>
													<div className="flex items-center space-x-1">
														<StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
														<span className="font-medium">{review.rating}/5</span>
													</div>
												</div>
												{review.comment && (
													<p className="text-sm text-base-content/70 line-clamp-2">{review.comment}</p>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			)}

			{activeTab === "activity" && (
				<div className="card bg-base-100 shadow-md">
					<div className="card-body">
						<h2 className="card-title mb-4">Recent Activity</h2>
						<RecentActivity />
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
