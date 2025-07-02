import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initializeStores } from "./store";
import { useAuthStore } from "./store";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
// import Watchlist from "./pages/Watchlist";
// import Profile from "./pages/Profile";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Layout>{children}</Layout>;
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
								<Search />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/movie/:id"
						element={
							<ProtectedRoute>
								<MovieDetails />
							</ProtectedRoute>
						}
					/>

					{/* <Route
						path="/watchlist"
						element={
							<ProtectedRoute>
								<Watchlist />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/profile"
						element={
							<ProtectedRoute>
								<Profile />
							</ProtectedRoute>
						}
					/> */}

					{/* catch all route - redirect to home */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
