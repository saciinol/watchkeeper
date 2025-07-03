import { BookmarkIcon, CheckCircleIcon, PlayIcon } from "lucide-react";

export const getStatusIcon = (status) => {
		switch (status) {
			case "want_to_watch":
				return <BookmarkIcon className="w-4 h-4" />;
			case "watching":
				return <PlayIcon className="w-4 h-4" />;
			case "completed":
				return <CheckCircleIcon className="w-4 h-4" />;
			default:
				return <BookmarkIcon className="w-4 h-4" />;
		}
	};
