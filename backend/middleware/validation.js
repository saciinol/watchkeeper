export const validateRegistration = (req, res, next) => {
	const { name, email, password } = req.body;

	// Sanitize inputs
	req.body.name = name?.trim();
	req.body.email = email?.trim().toLowerCase();

	const errors = [];

	if (!req.body.name) errors.push("Name is required");
	if (!req.body.email) errors.push("Email is required");
	if (!password) errors.push("Password is required");

	if (req.body.name && req.body.name.length > 100) {
		errors.push("Name exceeds maximum length");
	}

	if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
		errors.push("Invalid email format");
	}

	if (password && password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors,
		});
	}

	next();
};

export const validateLogin = (req, res, next) => {
	const { email, password } = req.body;

	// Sanitize inputs
	req.body.email = email?.trim().toLowerCase();

	const errors = [];

	if (!req.body.email) errors.push("Email is required");
	if (!password) errors.push("Password is required");

	if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
		errors.push("Invalid email format");
	}

	if (errors.length > 0) {
		return res.status(400).json({
			success: false,
			message: "Validation failed",
			errors,
		});
	}

	next();
};