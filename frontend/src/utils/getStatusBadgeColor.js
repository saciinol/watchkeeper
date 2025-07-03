export const getStatusBadgeColor = (status) => {
	switch (status) {
		case "want_to_watch":
			return "badge-secondary";
		case "watching":
			return "badge-primary";
		case "completed":
			return "badge-success";
		default:
			return "badge-ghost";
	}
};
