import type { Comment, User } from "@prisma/client";
import type {
	ToCommentResponseParams,
	ToCommentsResponseParams,
} from "./comment.interface";

/**
 * Map a comment to a response
 * @param enrichedComment The comment to map
 * @param currentUserId The current user's ID. If provided, the comment will be mapped to the current user's perspective.
 * @param followingStatus Optional pre-fetched following status for the comment author
 * @returns The mapped comment
 */
export const toCommentResponse = (
	enrichedComment: Comment & {
		author: User & {
			followedBy?: User[];
		};
	},
	{ currentUserId }: ToCommentResponseParams = {},
): {
	comment: {
		id: string;
		createdAt: string;
		updatedAt: string;
		body: string;
		author: {
			username: string;
			bio: string | null;
			image: string | null;
			following: boolean;
		};
	};
} => {
	let following = false;

	if (currentUserId && enrichedComment.author.followedBy) {
		following = enrichedComment.author.followedBy.some(
			(follower) => follower.id === currentUserId,
		);
	}

	return {
		comment: {
			id: enrichedComment.id,
			createdAt: enrichedComment.createdAt.toISOString(),
			updatedAt: enrichedComment.updatedAt.toISOString(),
			body: enrichedComment.body,
			author: {
				username: enrichedComment.author.username,
				bio: enrichedComment.author.bio,
				image: enrichedComment.author.image,
				following,
			},
		},
	};
};

/**
 * Map an array of comments to a response
 * @param commentsWithAuthors The comments to map
 * @param currentUserId The current user's ID. If provided, the comments will be mapped to the current user's perspective.
 * @returns The mapped comments
 */
export function toCommentsResponse(
	commentsWithAuthors: Array<
		Comment & {
			author: User & {
				followedBy?: User[];
			};
		}
	>,
	{ currentUserId }: ToCommentsResponseParams = {},
): {
	comments: Array<{
		id: string;
		createdAt: string;
		updatedAt: string;
		body: string;
		author: {
			username: string;
			bio: string | null;
			image: string | null;
			following: boolean;
		};
	}>;
} {
	const comments = commentsWithAuthors.map((comment) => {
		const response = toCommentResponse(comment, { currentUserId });
		return response.comment;
	});

	return {
		comments,
	};
}
