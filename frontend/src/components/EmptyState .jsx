const EmptyState = ({ icon, title, message }) => {
	return (
		<div className="text-center py-12">
			<div className="max-w-md mx-auto">
				{icon && <div className="mb-4">{icon}</div>}
				<h3 className="text-xl font-semibold mb-2">{title}</h3>
				<p className="text-base-content/70">{message}</p>
			</div>
		</div>
	);
};

export default EmptyState;
