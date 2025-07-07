import { APIError, api } from "encore.dev/api";
import type {
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
	UserResponse,
} from "./user.interface";
import * as UserService from "./user.service";

/**
 * Counts and returns the number of existing users
 */
export const count = api(
	{ method: "GET", path: "/count/users" },
	async (): Promise<{
		count: number;
	}> => {
		try {
			const result = await UserService.count();
			return { count: result };
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
		try {
			const result = await UserService.login(data);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error logging in");
		}
	},
);

export const getCurrentUser = api(
	{ method: "GET", path: "/user" },
	async (): Promise<UserResponse> => {
		try {
			const id = "123"; // TODO: get the id from the token
			const result = await UserService.findOne(id);
			return result;
		} catch (error) {
			throw APIError.aborted(error?.toString() || "Error getting current user");
		}
	},
);

export const updateCurrentUser = api(
	{ method: "PUT", path: "/user" },
	async (data: UpdateUserDto): Promise<UserResponse> => {
		try {
			const id = "123"; // TODO: get the id from the token
			const result = await UserService.update(id, data);
			return result;
		} catch (error) {
			throw APIError.aborted(
				error?.toString() || "Error updating current user",
			);
		}
	},
);
