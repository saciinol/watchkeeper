import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validateRegistrationForm, sanitizeInput } from "../utils/validation";
import { ComponentLoader } from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import PasswordToggleIcon from "../components/PasswordToggleIcon";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (validationErrors[name]) {
			setValidationErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}

		setFormData({
			...formData,
			[name]: name === "email" ? value : sanitizeInput(value),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validation = validateRegistrationForm(formData);

		if (!validation.isValid) {
			setValidationErrors(validation.errors);

			// show first validation error as toast
			const firstErrorField = Object.keys(validation.errors)[0];
			const firstError = validation.errors[firstErrorField];
			if (firstError && firstError.length > 0) {
				toast.error(firstError[0]);
			}
			return;
		}

		setValidationErrors({});
		setIsLoading(true);

		try {
			const response = await registerUser({
				name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password,
			});

			if (response.success) {
				toast.success("Registration successful! Please login.");
				navigate("/login");
			}
		} catch (error) {
			toast.error(error.message || "Registration failed");
		} finally {
			setIsLoading(false);
		}
	};

	// Show loading overlay while submitting
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-base-200">
				<ComponentLoader />
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-center text-2xl font-bold mb-6">Join WatchKeeper</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Full Name</span>
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								className={`input input-bordered ${validationErrors.name ? "input-error" : ""}`}
								placeholder="Enter your full name"
								required
							/>
							{validationErrors.name && (
								<label className="label">
									<span className="label-text-alt text-error text-xs">{validationErrors.name[0]}</span>
								</label>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`input input-bordered ${validationErrors.email ? "input-error" : ""}`}
								placeholder="Enter your email"
								required
							/>
							{validationErrors.email && (
								<label className="label">
									<span className="label-text-alt text-error text-xs">{validationErrors.email[0]}</span>
								</label>
							)}
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									className={`input input-bordered w-full pr-10 ${validationErrors.password ? "input-error" : ""}`}
									placeholder="Enter your password"
									required
								/>
								<PasswordToggleIcon
									show={showPassword}
									onClick={() => setShowPassword(!showPassword)}
									disabled={isLoading}
								/>
							</div>
							{validationErrors.password && (
								<label className="label">
									<span className="label-text-alt text-error text-xs">{validationErrors.password[0]}</span>
								</label>
							)}
							<label className="label">
								<span className="label-text-alt text-xs">Minimum 8 characters</span>
							</label>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Confirm Password</span>
							</label>
							<input
								type={showPassword ? "text" : "password"}
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`input input-bordered ${validationErrors.confirmPassword ? "input-error" : ""}`}
								placeholder="Confirm your password"
								required
							/>
							{validationErrors.confirmPassword && (
								<label className="label">
									<span className="label-text-alt text-error text-xs">{validationErrors.confirmPassword[0]}</span>
								</label>
							)}
						</div>

						<div className="form-control mt-6">
							<button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
								{isLoading ? "Creating Account..." : "Create Account"}
							</button>
						</div>
					</form>

					<div className="divider">OR</div>

					<div className="text-center">
						<p className="text-sm">
							Already have an account?{" "}
							<Link to="/login" className={`link link-primary ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
								Login here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
