import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initializeStores } from "./store";
import { useAuthStore } from "./store";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

//public Route component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
};

function App() {
	useEffect(() => {
		initializeStores();
	}, []);

	return (
		<Router>
			<div className="min-h-screen bg-base-100">
				{/* toast notifications */}
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: "#363636",
							color: "#fff",
						},
					}}
				/>

				<Routes>
					{/* public routes */}
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>

					{/* protected routes */}
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>

					{/* add more protected routes here as needed */}
					<Route
						path="/search"
						element={
							<ProtectedRoute>
								{/* your Search component will go here */}
								<div className="container mx-auto px-4 py-8">
									<h1 className="text-2xl font-bold">Search Movies</h1>
									<p>Search page coming soon...</p>
								</div>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/watchlist"
						element={
							<ProtectedRoute>
								{/* your Watchlist component will go here */}
								<div className="container mx-auto px-4 py-8">
									<h1 className="text-2xl font-bold">My Watchlist</h1>
									<p>Watchlist page coming soon...</p>
								</div>
							</ProtectedRoute>
						}
					/>
					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								{/* your Profile component will go here */}
								<div className="container mx-auto px-4 py-8">
									<h1 className="text-2xl font-bold">My Profile</h1>
									<p>Profile page coming soon...</p>
								</div>
							</ProtectedRoute>
						}
					/>

					{/* catch all route - redirect to home */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
