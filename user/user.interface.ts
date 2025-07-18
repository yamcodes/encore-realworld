import type { IsEmail, IsURL, MatchesRegexp } from "encore.dev/validate";

export interface UserDto {
	/** ID of the user */
	id: string;
	/** Email of the user */
	email: string;
	/** Username of the user */
	username: string;
	/** User's bio */
	bio: string | null;
	/** URL for the user's profile image */
	image: string | null;
	/** Date and time the user was created */
	createdAt: Date;
	/** Date and time the user was last updated */
	updatedAt: Date;
}

export interface CreateUserDto {
	/**
	 * Email of the user
	 *
	 * @example "john@example.com"
	 */
	email: string & IsEmail;
	/**
	 * Username of the user
	 *
	 * @example "John"
	 */
	username: string;
	/**
	 * User's bio
	 *
	 * @example "I am a software engineer"
	 */
	bio?: string;
	/**
	 * URL for the user's profile image
	 *
	 * @example "https://example.com/image.png"
	 */
	image?: string & IsURL;
	/**
	 * Password of the user
	 *
	 * @example "password"
	 */
	password: string & MatchesRegexp<"^[a-zA-Z\\d@$!%*?&]{8,}$">;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface LoginUserDto {
	email: string;
	password: string;
}

export interface UserResponse {
	user: {
		token: string;
		email: string;
		username: string;
		bio: string | null;
		image: string | null;
	};
}
