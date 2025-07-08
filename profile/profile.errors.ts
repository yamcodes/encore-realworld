import { APIError } from "encore.dev/api";

export const SelfFollowError = APIError.permissionDenied(
	"You can only follow yourself",
);

export const SelfUnfollowError = APIError.permissionDenied(
	"You can only unfollow yourself",
);
