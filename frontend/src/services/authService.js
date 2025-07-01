import api from "./api.js";

export const loginUser = async (email, password) => {
	const response = await api.post("/auth/login", {
		email,
		password,
	});

	return response.data;
};

export const getMovies = async () => {
	const response = await api.get("/movies");
	return response.data;
};
