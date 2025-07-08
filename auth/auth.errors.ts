import { APIError } from "encore.dev/api";

export const InvalidTokenError = APIError.unauthenticated("invalid token");

export const NoTokenError = APIError.unauthenticated(
	"Token not found in header. Pass a `Token <token>` authorization header",
);

export const NoUserIdError = APIError.unauthenticated("no user id");
