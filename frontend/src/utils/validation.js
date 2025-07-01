export const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const validatePassword = (password) => {
	const errors = [];

	if (!password) {
		errors.push("Password is required");
	} else {
		if (password.length < 8) {
			errors.push("Password must be at least 8 characters long");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateName = (name) => {
	const errors = [];

	if (!name || !name.trim()) {
		errors.push("Name is required");
	} else {
		if (name.trim().length < 2) {
			errors.push("Name must be at least 2 characters long");
		}

		if (name.trim().length > 100) {
			errors.push("Name cannot exceed 100 characters");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateRating = (rating) => {
	const errors = [];

	if (rating === null || rating === undefined) {
		errors.push("Rating is required");
	} else {
		const numRating = parseInt(rating);

		if (isNaN(numRating) || numRating < 1 || numRating > 5) {
			errors.push("Rating must be between 1 and 5");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateComment = (comment) => {
	const errors = [];

	if (comment && comment.length > 1000) {
		errors.push("Comment cannot exceed 1000 characters");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

export const validateRegistrationForm = (formData) => {
	const errors = {};

	// validate name
	const nameValidation = validateName(formData.name);
	if (!nameValidation.isValid) {
		errors.name = nameValidation.errors;
	}

	// validate email
	if (!formData.email || !formData.email.trim()) {
		errors.email = ["Email is required"];
	} else if (!validateEmail(formData.email.trim())) {
		errors.email = ["Please enter a valid email address"];
	}

	// validate password
	const passwordValidation = validatePassword(formData.password);
	if (!passwordValidation.isValid) {
		errors.password = passwordValidation.errors;
	}

	// Validate password confirmation
	if (formData.password !== formData.confirmPassword) {
		errors.confirmPassword = ["Passwords do not match"];
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateLoginForm = (formData) => {
	const errors = {};

	// validate email
	if (!formData.email || !formData.email.trim()) {
		errors.email = ["Email is required"];
	} else if (!validateEmail(formData.email.trim())) {
		errors.email = ["Please enter a valid email address"];
	}

	// validate password
	if (!formData.password) {
		errors.password = ["Password is required"];
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateReviewForm = (rating, comment) => {
	const errors = {};

	// validate rating
	const ratingValidation = validateRating(rating);
	if (!ratingValidation.isValid) {
		errors.rating = ratingValidation.errors;
	}

	// validate comment
	const commentValidation = validateComment(comment);
	if (!commentValidation.isValid) {
		errors.comment = commentValidation.errors;
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

// utility function to sanitize input
export const sanitizeInput = (input) => {
	if (typeof input !== "string") return input;

	return input
		.trim()
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;")
		.replace(/\//g, "&#x2F;");
};
