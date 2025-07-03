import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import.meta.env.MODE;

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		// Log error details
		console.error("Error Boundary caught an error:", error, errorInfo);

		this.setState({
			error: error,
			errorInfo: errorInfo,
		});

		// You can also log the error to an error reporting service here
		// logErrorToService(error, errorInfo);
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	handleGoHome = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
					<div className="card w-full max-w-md bg-base-200 shadow-xl">
						<div className="card-body text-center">
							<AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />

							<h2 className="card-title justify-center text-2xl font-bold mb-2">Oops! Something went wrong</h2>

							<p className="text-base-content/70 mb-6">
								We encountered an unexpected error. Don't worry, it's not your fault!
							</p>

							<div className="card-actions justify-center gap-3">
								<button onClick={this.handleReset} className="btn btn-primary gap-2">
									<RefreshCw className="w-4 h-4" />
									Try Again
								</button>

								<button onClick={this.handleGoHome} className="btn btn-outline gap-2">
									<Home className="w-4 h-4" />
									Go Home
								</button>
							</div>

							{/* Show error details in development */}
							{import.meta.env.MODE === "development" && this.state.error && (
								<div className="mt-6 text-left">
									<div className="collapse collapse-arrow bg-base-300">
										<input type="checkbox" />
										<div className="collapse-title text-sm font-medium">Error Details (Development)</div>
										<div className="collapse-content">
											<pre className="text-xs bg-base-100 p-2 rounded overflow-auto">
												{this.state.error.toString()}
												{this.state.errorInfo.componentStack}
											</pre>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
