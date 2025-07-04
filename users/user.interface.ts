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
	email: string;
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
	image?: string;
	/**
	 * Password of the user
	 *
	 * @example "password"
	 */
	password: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface Response {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** The result of the request */
	result?: string | number;
}

export interface Paginated {
	/** Total number of results */
	count: number;
	/** Number of results per page */
	pageSize: number;
	/** Total number of pages */
	totalPages: number;
	/** Current page number */
	current: number;
}

export interface UserResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** User data */
	result?: UserDto | UserDto[];
	/** Pagination data */
	pagination?: Paginated;
}
