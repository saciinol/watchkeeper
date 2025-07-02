import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { HomeIcon, SearchIcon, BookmarkIcon, UserIcon, LogOutIcon, FilmIcon } from "lucide-react";
import toast from "react-hot-toast";

const Layout = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout, isAuthenticated } = useAuthStore();

	const handleLogout = () => {
		logout();
		toast.success("Logged out successfully");
		navigate("/login");
	};

	const navigation = [
		{ name: "Home", href: "/", icon: HomeIcon },
		{ name: "Search", href: "/search", icon: SearchIcon },
		{ name: "Watchlist", href: "/watchlist", icon: BookmarkIcon },
		{ name: "Profile", href: "/profile", icon: UserIcon },
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
			<header className="navbar bg-base-200 shadow-sm border-b border-base-300">
				<div className="navbar-start">
					<Link to="/" className="btn btn-ghost text-xl font-bold">
						<FilmIcon className="w-6 h-6 mr-2" />
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
										className={`btn btn-ghost btn-sm ${isActive(item.href) ? "bg-primary text-primary-content" : ""}`}
									>
										<Icon className="w-4 h-4 mr-2" />
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="navbar-end">
					<div className="dropdown dropdown-end">
						<div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
							<div className="bg-neutral text-neutral-content rounded-full w-10">
								<span className="text-sm font-medium">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
							</div>
						</div>

						<ul
							tabIndex={0}
							className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
						>
							<li className="menu-title">
								<span>Welcome, {user?.name}</span>
							</li>
							<li>
								<Link to="/profile" className="justify-between">
									Profile
									<UserIcon className="w-4 h-4" />
								</Link>
							</li>
							<li>
								<button onClick={handleLogout} className="text-error">
									Logout
									<LogOutIcon className="w-4 h-4" />
								</button>
							</li>
						</ul>
					</div>
				</div>
			</header>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <div className="btm-nav lg:hidden z-50">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              <Icon className="w-5 h-5" />
              <span className="btm-nav-label text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="pb-16 lg:pb-0">
        {children}
      </main>
		</div>
	);
};

export default Layout;
