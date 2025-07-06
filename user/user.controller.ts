import { APIError, api } from "encore.dev/api";
import type {
	CreateUserDto,
	LoginUserDto,
	Response,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import * as UserService from "./user.service";

/**
 * Counts and returns the number of existing users
 */
export const count = api(
	{ method: "GET", path: "/count/users" },
	async (): Promise<Response> => {
		try {
			const result = await UserService.count();
			return { success: true, result };
		} catch (error) {
			throw APIError.aborted(
				error?.toString() || "Error counting existing users",
			);
		}
	},
);

/**
 * Registration
 *
 * No authentication required
 * @returns a User
 */
export const registration = api(
	{ method: "POST", path: "/users" },
	async (data: CreateUserDto): Promise<UserResponse> => {
		try {
			if (!data.username || !data.email || !data.password) {
				throw APIError.invalidArgument("Missing required fields");
			}
			const result = await UserService.create(data);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error creating the user");
		}
	},
);

/**
 * Authentication
 *
 * No authentication required
 * @returns a User
 */
export const authentication = api(
	{ method: "POST", path: "/users/login" },
	async (data: LoginUserDto): Promise<UserResponse> => {
		if (!data.email || !data.password) {
			throw APIError.invalidArgument("Missing required fields");
		}
		try {
			const result = await UserService.login(data);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error logging in");
		}
	},
);

/**
 * Get all users data
 */
export const read = api(
	{ method: "GET", path: "/users" },
	async ({
		page,
		limit,
	}: {
		page?: number;
		limit?: number;
	}): Promise<UserResponse> => {
		try {
			const result = await UserService.find(page, limit);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting users data");
		}
	},
);

/**
 * Get Profile
 *
 * Authentication optional, returns a Profile
 */
export const getProfile = api(
	{ method: "GET", path: "/profiles/:id" },
	async ({ id }: { id: string }): Promise<UserResponse> => {
		try {
			const result = await UserService.findOne(id);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting user data");
		}
	},
);

/**
 * Update User
 *
 * Authentication required
 * @returns a User
 */
export const update = api(
	{ method: "PATCH", path: "/users/:id" },
	async ({
		id,
		data,
	}: {
		id: string;
		data: UpdateUserDto;
	}): Promise<UserResponse> => {
		try {
			const result = await UserService.update(id, data);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error updating user");
		}
	},
);

/**
 * Delete User
 *
 * Authentication required
 * @returns a User
 */
export const destroy = api(
	{ method: "DELETE", path: "/users/:id" },
	async ({ id }: { id: string }): Promise<Response> => {
		try {
			const result = await UserService.delete(id);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error deleting user");
		}
	},
);
