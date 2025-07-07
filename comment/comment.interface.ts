/**
 * Parameters for the toCommentResponse function
 */
export type ToCommentResponseParams = {
	/**
	 * The current user's ID. If provided, the comment will be mapped to the current user's perspective.
	 */
	currentUserId?: string;
};

/**
 * Parameters for the toCommentsResponse function
 */
export type ToCommentsResponseParams = Pick<
	ToCommentResponseParams,
	"currentUserId"
>;

/**
 * Response for a single comment
 */
export type CommentResponse = {
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
};

/**
 * Response for a list of comments
 */
export type CommentsResponse = {
	comments: CommentResponse["comment"][];
};
