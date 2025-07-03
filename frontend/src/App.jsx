import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initializeStores } from "./store";
import { useAuthStore } from "./store";

// Components
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { PageLoader, RouteLoader } from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop"; 

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeStores();
      } catch (error) {
        console.error("Failed to initialize app:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen during initialization
  if (isInitializing) {
    return <PageLoader message="Initializing WatchKeeper..." />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop /> 

        <div className="min-h-screen bg-base-100">
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#059669",
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#DC2626",
                  color: "#fff",
                },
              },
            }}
          />

          {/* Route loading overlay */}
          {isRouteLoading && <RouteLoader />}

          <Routes>
            {/* Public routes */}
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

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

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

            <Route
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
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
