import { EditIcon, TrashIcon } from "lucide-react";
import StarRating from "./StarRating";

const ReviewCard = ({ review, user, onEdit, onDelete }) => {
	const isOwner = review.user_id === user?.id;
	return (
		<div className="border-b border-base-200 pb-4 last:border-b-0">
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-center gap-3">
					<div className="avatar placeholder">
						<div className="bg-neutral text-neutral-content rounded-full w-10">
							<span className="text-sm">{review.user_name?.charAt(0).toUpperCase() || "U"}</span>
						</div>
					</div>
					<div>
						<p className="font-medium">{review.user_name}</p>
						<div className="flex items-center gap-2">
							<StarRating rating={review.rating} />
							<span className="text-sm text-base-content/70">
								{new Date(review.created_at).toLocaleDateString()}
							</span>
						</div>
					</div>
				</div>

				{isOwner && (
					<div className="dropdown dropdown-end">
						<button className="btn btn-ghost btn-sm btn-circle">
							<EditIcon className="w-4 h-4" />
						</button>
						<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
							<li>
								<button onClick={onEdit}>Edit</button>
							</li>
							<li>
								<button onClick={onDelete} className="text-error">
									<TrashIcon className="w-4 h-4" />
									Delete
								</button>
							</li>
						</ul>
					</div>
				)}
			</div>

			{review.comment && <p className="text-base-content/80 ml-13">{review.comment}</p>}
		</div>
	);
};

export default ReviewCard;
