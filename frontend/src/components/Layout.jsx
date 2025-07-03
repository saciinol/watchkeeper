import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Home, Search, Bookmark, User, LogOut, Film, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout, isAuthenticated } = useAuthStore();

	const [theme, setTheme] = useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("theme") || "light";
		}
		return "light";
	});

	useEffect(() => {
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("data-theme", theme);
			localStorage.setItem("theme", theme);
		}
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully");
		navigate("/login");
	};

	const navigation = [
		{ name: "Home", href: "/", icon: Home },
		{ name: "Search", href: "/search", icon: Search },
		{ name: "Watchlist", href: "/watchlist", icon: Bookmark },
		{ name: "Profile", href: "/profile", icon: User },
	];

	const isActive = (path) => {
		return location.pathname === path;
	};

	if (!isAuthenticated) {
		return children;
	}

	return (
		<div className="min-h-screen bg-base-100">
			{/* Navigation Header */}
			<header className="navbar bg-base-200 shadow-sm border-b border-base-300 sticky top-0 z-40">
				<div className="navbar-start">
					<Link to="/" className="btn btn-ghost text-xl font-bold">
						<Film className="w-6 h-6 mr-2" />
						WatchKeeper
					</Link>
				</div>

				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-1 gap-2">
						{navigation.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.name}>
									<Link
										to={item.href}
										className={`btn btn-ghost btn-sm transition-all duration-200 ${
											isActive(item.href) ? "bg-primary text-primary-content shadow-md scale-105" : "hover:bg-base-300"
										}`}
									>
										<Icon className="w-4 h-4 mr-2" />
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="navbar-end gap-2">
					{/* Theme Toggle Button */}
					<label className="swap swap-rotate btn btn-ghost btn-circle">
						{/* This checkbox controls the theme */}
						<input
							type="checkbox"
							className="theme-controller"
							value={theme}
							checked={theme === "dark"}
							onChange={toggleTheme}
						/>

						{/* Sun icon for light theme */}
						<Sun className="swap-on w-6 h-6 text-warning" />

						{/* Moon icon for dark theme */}
						<Moon className="swap-off w-6 h-6 text-info" />
					</label>
          
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar placeholder hover:bg-base-300 transition-colors"
						>
							<div className="bg-primary text-primary-content rounded-full w-10">
								<span className="text-sm font-medium">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
							</div>
						</div>

						<ul
							tabIndex={0}
							className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
						>
							<li className="menu-title">
								<span className="text-primary font-medium">Welcome, {user?.name}</span>
							</li>
							<div className="divider my-1"></div>
							<li>
								<Link to="/profile" className="justify-between hover:bg-base-200 transition-colors">
									Profile
									<User className="w-4 h-4" />
								</Link>
							</li>
							<li>
								<button onClick={handleLogout} className="text-error hover:bg-error/10 transition-colors">
									Logout
									<LogOut className="w-4 h-4" />
								</button>
							</li>
						</ul>
					</div>
				</div>
			</header>

			{/* Enhanced Mobile Navigation - Bottom Tab Bar */}
			<div className="btm-nav lg:hidden z-50 border-t border-base-300 bg-base-200/95 backdrop-blur">
				{navigation.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.href);

					return (
						<Link
							key={item.name}
							to={item.href}
							className={`
								relative transition-all duration-300 ease-out
								${active ? "active text-primary bg-primary/10" : "text-base-content/60 hover:text-base-content hover:bg-base-300/50"}
							`}
						>
							{/* Active indicator */}
							{active && (
								<div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full"></div>
							)}

							<Icon
								className={`
								w-5 h-5 transition-all duration-200 
								${active ? "scale-110" : "scale-100"}
							`}
							/>

							<span
								className={`
								btm-nav-label text-xs font-medium transition-all duration-200
								${active ? "text-primary font-semibold" : "text-base-content/60"}
							`}
							>
								{item.name}
							</span>

							{/* Subtle glow effect for active item */}
							{active && <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10"></div>}
						</Link>
					);
				})}
			</div>

			{/* Main Content with proper spacing */}
			<main className="pb-20 lg:pb-4 min-h-[calc(100vh-64px)]">{children}</main>
		</div>
	);
};

export default Layout;
