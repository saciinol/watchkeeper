import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
	persist(
		(set, get) => ({
			// state
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// actions
			setUser: (user) =>
				set({
					user,
					isAuthenticated: true,
					error: null,
				}),

			setToken: (token) => {
				set({ token });
				// also store in localStorage for axios interceptors
				if (token) {
					localStorage.setItem("authToken", token);
				} else {
					localStorage.removeItem("authToken");
				}
			},

			setLoading: (isLoading) => set({ isLoading }),

			setError: (error) => set({ error }),

			login: async (userData, token) => {
				set({ isLoading: true, error: null });

				try {
					// set user data and token
					get().setUser(userData);
					get().setToken(token);

					set({ isLoading: false });
				} catch (error) {
					set({
						error: error.message,
						isLoading: false,
					});
				}
			},

			logout: () => {
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});
				localStorage.removeItem("authToken");
			},

			clearError: () => set({ error: null }),

			// check if user is still authenticated (useful on app startup)
			checkAuth: () => {
				const token = localStorage.getItem("authToken");
				const { user } = get();

				if (token && user) {
					set({
						isAuthenticated: true,
						token,
					});
				} else {
					get().logout();
				}
			},
		}),
		{
			name: "auth-storage", // key in localStorage
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}), // only persist these fields
		}
	)
);

export default useAuthStore;
