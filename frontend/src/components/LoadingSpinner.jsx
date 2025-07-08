import React from "react";
import { Loader2, Film } from "lucide-react";

// Full page loading spinner
export const PageLoader = ({ message = "Loading..." }) => {
	return (
		<div className="min-h-screen bg-base-100 flex items-center justify-center">
			<div className="text-center">
				<div className="relative mb-4">
					<Film className="w-12 h-12 text-primary mx-auto animate-pulse" />
					<Loader2 className="w-6 h-6 text-primary animate-spin absolute -top-1 -right-1" />
				</div>
				<h3 className="text-lg font-semibold mb-2">WatchKeeper</h3>
				<p className="text-base-content/70">{message}</p>
				<div className="mt-4">
					<div className="loading loading-dots loading-md text-primary"></div>
				</div>
			</div>
		</div>
	);
};

// Route transition loading overlay
export const RouteLoader = () => {
	return (
		<div className="fixed inset-0 bg-base-100/80 backdrop-blur-sm z-50 flex items-center justify-center">
			<div className="text-center">
				<div className="loading loading-spinner loading-lg text-primary mb-2"></div>
				<p className="text-sm text-base-content/70">Loading page...</p>
			</div>
		</div>
	);
};

// Component loading skeleton
export const ComponentLoader = ({ className = "" }) => {
	return (
		<div className={`animate-pulse ${className}`}>
			<div className="flex justify-center py-8">
				<div className="loading loading-spinner loading-lg text-primary"></div>
			</div>
		</div>
	);
};

// Card skeleton for movie loading
export const MovieCardSkeleton = () => {
	return (
		<div className="card bg-base-200 shadow-md animate-pulse">
			<div className="bg-base-300 h-48 rounded-t-lg"></div>
			<div className="card-body">
				<div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
				<div className="h-3 bg-base-300 rounded w-1/2 mb-4"></div>
				<div className="h-8 bg-base-300 rounded w-full"></div>
			</div>
		</div>
	);
};

export default PageLoader;
