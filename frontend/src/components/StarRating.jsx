import { StarIcon } from "lucide-react";

const StarRating = ({ rating, interactive = false, onRate = () => {} }) => {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type={interactive ? "button" : undefined}
					className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
					onClick={interactive ? () => onRate(star) : undefined}
					disabled={!interactive}
				>
					<StarIcon className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
				</button>
			))}
		</div>
	);
};

export default StarRating;
