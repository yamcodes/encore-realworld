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
