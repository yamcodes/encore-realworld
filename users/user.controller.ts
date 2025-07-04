import { APIError, api } from "encore.dev/api";
import type {
	CreateUserDto,
	Response,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import UserService from "./user.service";

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
 * Method to create a new user
 */
export const create = api(
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
 * Get user data by id
 */
export const readOne = api(
	{ method: "GET", path: "/users/:id" },
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
 * Update user data
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
 * Delete user by id
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
