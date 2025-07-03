const ErrorAlert = ({ message }) => {
	if (!message) return null;

	return (
		<div className="alert alert-error max-w-2xl mx-auto mb-8">
			<span>{message}</span>
		</div>
	);
};

export default ErrorAlert;
