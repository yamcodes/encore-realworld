import { APIError } from "encore.dev/api";

export const SelfUpdateError = APIError.permissionDenied(
	"You can only update your own articles",
);

export const SelfDeleteError = APIError.permissionDenied(
	"You can only delete your own articles",
);
