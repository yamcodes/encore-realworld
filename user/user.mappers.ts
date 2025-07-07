import type { User } from "@prisma/client";
import type { UserResponse } from "./user.interface";

/**
 * Map a user to a response
 * @param user The user to map
 * @param token A signed token for the user
 * @returns The mapped user
 */
export const toResponse = async (
	{ email, username, bio, image }: User,
	token: string,
): Promise<UserResponse> => ({
	user: {
		token,
		email,
		username,
		bio,
		image,
	},
});
