import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// validate passwords match
		if (formData.password !== formData.confirmPassword) {
			toast.error("Password do not match");
			return;
		}

		// validate password length
		if (formData.password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		setIsLoading(true);

		try {
			const response = await registerUser({
				name: formData.name,
				email: formData.email,
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
								className="input input-bordered"
								placeholder="Enter your full name"
								required
							/>
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
								className="input input-bordered"
								placeholder="Enter your email"
								required
							/>
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
									className="input input-bordered w-full pr-10"
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
								className="input input-bordered"
								placeholder="Confirm your password"
								required
							/>
						</div>

            <div className="form-control mt-6">
							<button
								type="submit"
								className={`btn btn-primary ${isLoading ? "loading" : ""}`}
								disabled={isLoading}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</button>
						</div>
					</form>

          <div className="divider">OR</div>

					<div className="text-center">
						<p className="text-sm">
							Already have an account?{" "}
							<Link to="/login" className="link link-primary">
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