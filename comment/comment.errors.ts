import { APIError } from "encore.dev/api";

export const SelfDeleteError = APIError.permissionDenied(
	"You can only delete your own comments",
);

export const CommentNotFoundError = APIError.notFound("Comment not found");
