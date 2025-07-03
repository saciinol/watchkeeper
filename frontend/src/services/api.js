import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const api = axios.create({
	baseURL: `${BASE_URL}/api`,
	timeout: 20000, // request timeout (10 seconds)
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// log the request for debugging (remove in production)
		console.log("Making request to:", config.url);

		return config;
	},
	(error) => {
		console.error("Request setup error:", error);
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		console.log("Response received:", response.status);
		return response;
	},
	(error) => {
		// handle different types of errors

		// no response from server (network error, server down, etc.)
		if (!error.response) {
			console.error("Network Error:", error.message);
			toast.error("Something went wrong");
			return Promise.reject({
				message: "Network error. Please check your connection.",
				type: "network",
			});
		}

		// server responded with an error status
		const { status, data } = error.response;

		switch (status) {
			case 401:
				// unauthorized - token expired or invalid
				console.error("Unauthorized access");

				// remove invalid token
				localStorage.removeItem("authToken");

				// redirect to login page
				window.location.href = "/login";

				return Promise.reject({
					message: "Session expired. Please log in again.",
					type: "auth",
				});

			case 403:
				// forbidden - user doesn't have permission
				return Promise.reject({
					message: "You don't have permission to perform this action.",
					type: "permission",
				});

			case 404:
				// not found
				return Promise.reject({
					message: "The requested resource was not found.",
					type: "not_found",
				});

			case 409:
				// conflict (like email already exists during registration)
				return Promise.reject({
					message: data.message || "A conflict occurred.",
					type: "conflict",
				});

			case 422:
				// validation errors
				return Promise.reject({
					message: "Please check your input and try again.",
					errors: data.errors || [],
					type: "validation",
				});

			case 500:
				// server error
				return Promise.reject({
					message: "Server error. Please try again later.",
					type: "server",
				});

			default:
				// any other error
				return Promise.reject({
					message: data.message || "An unexpected error occurred.",
					type: "unknown",
				});
		}
	}
);

export default api;