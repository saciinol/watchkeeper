import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import { loginUser } from "../services/authService";
import { validateLoginForm, sanitizeInput } from "../utils/validation";
import toast from "react-hot-toast";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [validationErrors, setValidationErrors] = useState({});

	const { login, isLoading, error } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

	// get the page user was trying to access before login
	const from = location.state?.from?.pathname || "/";

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
			[name]: sanitizeInput(value),
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validation = validateLoginForm(formData);

		if (!validation.isValid) {
			setValidationErrors(validation.errors);

			const firstError = Object.values(validation.errors)[0];
			if (firstError && firstError.length > 0) {
				toast.error(firstError[0]);
			}
			return;
		}

		// clear validation errors if form is valid
		setValidationErrors({});

		try {
			const response = await loginUser(formData.email.trim(), formData.password);

			if (response.success) {
				await login(response.data.user, response.data.token);
				toast.success("Login successful");

				// redirect to the page they were trying to access
				navigate(from, { replace: true });
			}
		} catch (error) {
			toast.error(error.message || "Login Failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-center text-2xl font-bold mb-6">Login to WatchKeeper</h2>

					{error && (
						<div className="alert alert-error mb-4">
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input
								type="text"
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
								<button
									type="button"
									className="absolute right-3 top-1/2 transform -translate-y-1/2"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? "👁️" : "👁️‍🗨️"}
								</button>
							</div>
							{validationErrors.password && (
								<label className="label">
									<span className="label-text-alt text-error text-xs">{validationErrors.password[0]}</span>
								</label>
							)}
						</div>

						<div className="form-control mt-6">
							<button type="submit" className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
								{isLoading ? "Logging in..." : "Login"}
							</button>
						</div>
					</form>

					<div className="divider">OR</div>

					<div className="text-center">
						<p className="text-sm">
							Don't have an account?{" "}
							<Link to="/register" className="link link-primary">
								Sign up here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
