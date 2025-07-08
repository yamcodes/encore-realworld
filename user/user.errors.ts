import { APIError } from "encore.dev/api";

export const UserNotFoundError = APIError.notFound("User not found");

export const UserAlreadyExistsError = APIError.alreadyExists(
	"User already exists",
);

export const UserCountError = APIError.aborted("Error counting existing users");

export const UserCreateError = APIError.aborted("Error creating the user");

export const UserLoginError = APIError.aborted("Error logging in");

export const UserUpdateError = APIError.aborted("Error updating the user");

export const UserGetError = APIError.aborted("Error getting the user");

export const InvalidCredentialsError = APIError.unauthenticated(
	"Invalid credentials",
);
